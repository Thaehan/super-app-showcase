import Foundation
import LocalAuthentication

public enum SMobileBiometryType: String {
  case none
  case touchID
  case faceID
  case unknown

  static func from(_ type: LABiometryType) -> SMobileBiometryType {
    switch type {
    case .none: return .none
    case .touchID: return .touchID
    case .faceID: return .faceID
    @unknown default: return .unknown
    }
  }
}

public struct SMobileBiometricAvailability {
  public let biometryType: SMobileBiometryType
  public let isAvailable: Bool
  public let isEnrolled: Bool
  public let error: Error?
}

public struct SMobileBiometricAuthResult {
  public let biometryType: SMobileBiometryType
  public let success: Bool
  public let error: Error?
}

public enum SMobileBiometricsError: Error {
  case unavailable
  case notEnrolled
}

/// Lightweight biometric helper (Face ID / Touch ID).
public enum SMobileBiometrics {
  /// Returns whether biometrics can be used right now.
  public static func availability() -> SMobileBiometricAvailability {
    let context = LAContext()
    var error: NSError?
    let canEvaluate = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    let enrolled = (error as? LAError)?.code != .biometryNotEnrolled

    return SMobileBiometricAvailability(
      biometryType: SMobileBiometryType.from(context.biometryType),
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
    completion: @escaping (SMobileBiometricAuthResult) -> Void
  ) {
    let context = LAContext()
    context.localizedFallbackTitle = localizedFallbackTitle
    context.localizedCancelTitle = localizedCancelTitle

    let policy: LAPolicy = allowDevicePasscode
      ? .deviceOwnerAuthentication
      : .deviceOwnerAuthenticationWithBiometrics

    var evalError: NSError?
    guard context.canEvaluatePolicy(policy, error: &evalError) else {
      let result = SMobileBiometricAuthResult(
        biometryType: SMobileBiometryType.from(context.biometryType),
        success: false,
        error: evalError ?? SMobileBiometricsError.unavailable
      )
      DispatchQueue.main.async { completion(result) }
      return
    }

    context.evaluatePolicy(policy, localizedReason: reason) { success, error in
      let result = SMobileBiometricAuthResult(
        biometryType: SMobileBiometryType.from(context.biometryType),
        success: success,
        error: error
      )
      DispatchQueue.main.async { completion(result) }
    }
  }
}
