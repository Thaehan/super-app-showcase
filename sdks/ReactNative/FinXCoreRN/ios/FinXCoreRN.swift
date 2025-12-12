import FinXCore
import NitroModules

final class FinXCoreRN: HybridFinXCoreRNSpec {
  private let keychain = FinXKeychain(service: "com.finx.core.keychain")
  private typealias NativeBiometryType = FinXCore.FinXBiometryType

  func setItem(key: String, value: String) throws {
    try keychain.set(value, for: key)
  }

  func getItem(key: String) throws -> Variant_NullType_String {
    let value = try keychain.get(key)
    if let value {
      return .second(value)
    }
    return .first(.null)
  }

  func removeItem(key: String) throws {
    _ = try keychain.remove(key)
  }

  func clear() throws {
    _ = try keychain.clear()
  }

  func biometricsAvailability() throws -> BiometricAvailability {
    let availability = FinXBiometrics.availability()
    let mappedError: Variant_NullType_String? = availability.error.map {
      .second($0.localizedDescription)
    }

    return BiometricAvailability(
      biometryType: mapBiometryType(availability.biometryType),
      isAvailable: availability.isAvailable,
      isEnrolled: availability.isEnrolled,
      error: mappedError
    )
  }

  func authenticateBiometrics(
    reason: String?,
    allowDevicePasscode: Bool?
  ) throws -> BiometricAuthResult {
    let semaphore = DispatchSemaphore(value: 0)
    var captured: FinXBiometricAuthResult?

    DispatchQueue.main.async {
      FinXBiometrics.authenticate(
        reason: reason ?? "Authenticate to continue",
        allowDevicePasscode: allowDevicePasscode ?? true
      ) { result in
        captured = result
        semaphore.signal()
      }
    }

    semaphore.wait()
    guard let authResult = captured else {
      return BiometricAuthResult(
        biometryType: mapBiometryType(.unknown),
        success: false,
        error: .second("Authentication unavailable")
      )
    }

    let mappedError: Variant_NullType_String? = authResult.error.map {
      .second($0.localizedDescription)
    }

    return BiometricAuthResult(
      biometryType: mapBiometryType(authResult.biometryType),
      success: authResult.success,
      error: mappedError
    )
  }

  func cryptoRandomBytesBase64(length: Double) throws -> String {
    let count = max(0, Int(length))
    let data = try FinXCrypto.randomBytes(count: count)
    return data.base64EncodedString()
  }

  func cryptoSha256(text: String) throws -> String {
    return FinXCrypto.sha256Hex(text)
  }

  func cryptoHmacSha256(text: String, key: String) throws -> String {
    return FinXCrypto.hmacSHA256Hex(data: Data(text.utf8), key: Data(key.utf8))
  }

  func cryptoAesGcmEncrypt(
    plaintext: String,
    keyBase64: String,
    aadBase64: String?
  ) throws -> AesGcmEncryptResult {
    guard let keyData = Data(base64Encoded: keyBase64) else {
      throw FinXCryptoError.invalidKey
    }
    let aadData = aadBase64.flatMap { Data(base64Encoded: $0) }

    let result = try FinXCrypto.aesGCMEncrypt(
      plaintext: Data(plaintext.utf8),
      key: keyData,
      authenticatedData: aadData
    )

    return AesGcmEncryptResult(
      ciphertextBase64: result.ciphertext.base64EncodedString(),
      nonceBase64: result.nonce.base64EncodedString(),
      tagBase64: result.tag.base64EncodedString()
    )
  }

  func cryptoAesGcmDecrypt(
    ciphertextBase64: String,
    nonceBase64: String,
    tagBase64: String,
    keyBase64: String,
    aadBase64: String?
  ) throws -> String {
    guard
      let keyData = Data(base64Encoded: keyBase64),
      let ciphertext = Data(base64Encoded: ciphertextBase64),
      let nonce = Data(base64Encoded: nonceBase64),
      let tag = Data(base64Encoded: tagBase64)
    else {
      throw FinXCryptoError.invalidNonce
    }

    let aadData = aadBase64.flatMap { Data(base64Encoded: $0) }
    let plaintext = try FinXCrypto.aesGCMDecrypt(
      ciphertext: ciphertext,
      nonce: nonce,
      tag: tag,
      key: keyData,
      authenticatedData: aadData
    )

    guard let string = String(data: plaintext, encoding: .utf8) else {
      throw FinXCryptoError.decryptionFailed
    }

    return string
  }

  private func mapBiometryType(_ type: NativeBiometryType) -> FinXBiometryType {
    switch type {
    case .none: return .none
    case .touchID: return .touchid
    case .faceID: return .faceid
    case .unknown: return .unknown
    }
  }
}
