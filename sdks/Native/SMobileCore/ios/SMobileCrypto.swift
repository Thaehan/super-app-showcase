import CryptoKit
import Foundation
import Security

public enum SMobileCryptoError: Error {
  case invalidKey
  case invalidNonce
  case decryptionFailed
  case randomGenerationFailed(OSStatus)
}

/// Common crypto utilities backed by CryptoKit.
public enum SMobileCrypto {
  public struct AESGCMResult {
    public let ciphertext: Data
    public let nonce: Data
    public let tag: Data
  }

  /// Generates cryptographically secure random bytes.
  public static func randomBytes(count: Int) throws -> Data {
    var data = Data(count: count)
    let status = data.withUnsafeMutableBytes { buffer in
      SecRandomCopyBytes(kSecRandomDefault, count, buffer.baseAddress!)
    }
    guard status == errSecSuccess else {
      throw SMobileCryptoError.randomGenerationFailed(status)
    }
    return data
  }

  /// SHA256 hash as hex string.
  public static func sha256Hex(_ data: Data) -> String {
    let hash = SHA256.hash(data: data)
    return hash.map { String(format: "%02x", $0) }.joined()
  }

  /// SHA256 hash of a UTF-8 string.
  public static func sha256Hex(_ string: String) -> String {
    sha256Hex(Data(string.utf8))
  }

  /// HMAC-SHA256 returning hex string.
  public static func hmacSHA256Hex(data: Data, key: Data) -> String {
    let key = SymmetricKey(data: key)
    let mac = HMAC<SHA256>.authenticationCode(for: data, using: key)
    return mac.map { String(format: "%02x", $0) }.joined()
  }

  /// Encrypts data using AES-GCM. Generates a random 12-byte nonce if none is provided.
  public static func aesGCMEncrypt(
    plaintext: Data,
    key: Data,
    nonce: Data? = nil,
    authenticatedData: Data? = nil
  ) throws -> AESGCMResult {
    guard key.count >= 16 else { throw SMobileCryptoError.invalidKey }
    let symmetricKey = SymmetricKey(data: key)

    let useNonce: AES.GCM.Nonce
    if let nonce {
      guard let n = try? AES.GCM.Nonce(data: nonce) else {
        throw SMobileCryptoError.invalidNonce
      }
      useNonce = n
    } else {
      useNonce = AES.GCM.Nonce()
    }

    let sealedBox = try AES.GCM.seal(
      plaintext,
      using: symmetricKey,
      nonce: useNonce,
      authenticating: authenticatedData ?? Data()
    )

    return AESGCMResult(
      ciphertext: sealedBox.ciphertext,
      nonce: Data(sealedBox.nonce),
      tag: sealedBox.tag
    )
  }

  /// Decrypts AES-GCM ciphertext produced by `aesGCMEncrypt`.
  public static func aesGCMDecrypt(
    ciphertext: Data,
    nonce: Data,
    tag: Data,
    key: Data,
    authenticatedData: Data? = nil
  ) throws -> Data {
    guard key.count >= 16 else { throw SMobileCryptoError.invalidKey }
    guard let nonce = try? AES.GCM.Nonce(data: nonce) else {
      throw SMobileCryptoError.invalidNonce
    }
    let symmetricKey = SymmetricKey(data: key)
    let box = try AES.GCM.SealedBox(
      nonce: nonce,
      ciphertext: ciphertext,
      tag: tag
    )
    do {
      return try AES.GCM.open(
        box,
        using: symmetricKey,
        authenticating: authenticatedData ?? Data()
      )
    } catch {
      throw SMobileCryptoError.decryptionFailed
    }
  }
}
