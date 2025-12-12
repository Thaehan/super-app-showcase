import Foundation
import LocalAuthentication

public enum FinXBiometryType: String {
  case none
  case touchID
  case faceID
  case unknown

  static func from(_ type: LABiometryType) -> FinXBiometryType {
    switch type {
    case .none: return .none
    case .touchID: return .touchID
    case .faceID: return .faceID
    @unknown default: return .unknown
    }
  }
}

public struct FinXBiometricAvailability {
  public let biometryType: FinXBiometryType
  public let isAvailable: Bool
  public let isEnrolled: Bool
  public let error: Error?
}

public struct FinXBiometricAuthResult {
  public let biometryType: FinXBiometryType
  public let success: Bool
  public let error: Error?
}

public enum FinXBiometricsError: Error {
  case unavailable
  case notEnrolled
}

/// Lightweight biometric helper (Face ID / Touch ID).
public enum FinXBiometrics {
  /// Returns whether biometrics can be used right now.
  public static func availability() -> FinXBiometricAvailability {
    let context = LAContext()
    var error: NSError?
    let canEvaluate = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    let enrolled = (error as? LAError)?.code != .biometryNotEnrolled

    return FinXBiometricAvailability(
      biometryType: FinXBiometryType.from(context.biometryType),
      isAvailable: canEvaluate,
      isEnrolled: enrolled,
      error: error
    )
  }

  /// Prompts the user for biometric authentication.
  /// Completion is always dispatched on the main queue.
  public static func authenticate(
    reason: String = "Authenticate to continue",
    localizedFallbackTitle: String? = nil,
    localizedCancelTitle: String? = nil,
    allowDevicePasscode: Bool = true,
    completion: @escaping (FinXBiometricAuthResult) -> Void
  ) {
    let context = LAContext()
    context.localizedFallbackTitle = localizedFallbackTitle
    context.localizedCancelTitle = localizedCancelTitle

    let policy: LAPolicy = allowDevicePasscode
      ? .deviceOwnerAuthentication
      : .deviceOwnerAuthenticationWithBiometrics

    var evalError: NSError?
    guard context.canEvaluatePolicy(policy, error: &evalError) else {
      let result = FinXBiometricAuthResult(
        biometryType: FinXBiometryType.from(context.biometryType),
        success: false,
        error: evalError ?? FinXBiometricsError.unavailable
      )
      DispatchQueue.main.async { completion(result) }
      return
    }

    context.evaluatePolicy(policy, localizedReason: reason) { success, error in
      let result = FinXBiometricAuthResult(
        biometryType: FinXBiometryType.from(context.biometryType),
        success: success,
        error: error
      )
      DispatchQueue.main.async { completion(result) }
    }
  }
}
