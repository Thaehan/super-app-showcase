import Foundation
import Security

/// Minimal Swift-only keychain helper for native apps.
public final class SMobileKeychain {
  private let service: String

  public init(service: String = "com.smobile.core") {
    self.service = service
  }

  @discardableResult
  public func set(_ value: String, for key: String) throws -> Bool {
    guard let data = value.data(using: .utf8) else {
      throw KeychainError.encodingFailed
    }

    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: service,
      kSecAttrAccount as String: key,
    ]

    // Delete existing entry first to simplify logic.
    SecItemDelete(query as CFDictionary)

    let attributes: [String: Any] = query.merging([
      kSecValueData as String: data,
      kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock,
    ]) { _, new in new }

    let status = SecItemAdd(attributes as CFDictionary, nil)
    guard status == errSecSuccess else { throw KeychainError.from(status) }
    return true
  }

  public func get(_ key: String) throws -> String? {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: service,
      kSecAttrAccount as String: key,
      kSecReturnData as String: kCFBooleanTrue as Any,
      kSecMatchLimit as String: kSecMatchLimitOne,
    ]

    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)

    if status == errSecItemNotFound { return nil }
    guard status == errSecSuccess else { throw KeychainError.from(status) }
    guard let data = item as? Data, let string = String(data: data, encoding: .utf8) else {
      throw KeychainError.decodingFailed
    }
    return string
  }

  @discardableResult
  public func remove(_ key: String) throws -> Bool {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: service,
      kSecAttrAccount as String: key,
    ]
    let status = SecItemDelete(query as CFDictionary)
    if status == errSecItemNotFound { return false }
    guard status == errSecSuccess else { throw KeychainError.from(status) }
    return true
  }

  @discardableResult
  public func clear() throws -> Bool {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: service,
    ]
    let status = SecItemDelete(query as CFDictionary)
    if status == errSecItemNotFound { return false }
    guard status == errSecSuccess else { throw KeychainError.from(status) }
    return true
  }
}

public enum KeychainError: Error {
  case encodingFailed
  case decodingFailed
  case osStatus(OSStatus)

  static func from(_ status: OSStatus) -> KeychainError {
    KeychainError.osStatus(status)
  }
}
