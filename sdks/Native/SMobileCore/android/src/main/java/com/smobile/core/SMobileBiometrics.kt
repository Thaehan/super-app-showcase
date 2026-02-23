package com.smobile.core

import android.content.Context
import android.content.pm.PackageManager
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

enum class BiometryType {
  NONE,
  FINGERPRINT,
  FACE,
  MULTIPLE,
  UNKNOWN
}

data class BiometricAvailability(
  val biometryType: BiometryType,
  val isAvailable: Boolean,
  val isEnrolled: Boolean,
  val status: Int
)

data class BiometricAuthResult(
  val biometryType: BiometryType,
  val success: Boolean,
  val error: String?
)

/**
 * Lightweight helpers for checking and prompting biometrics.
 */
object SMobileBiometrics {

  private fun detectType(context: Context): BiometryType {
    val pm = context.packageManager
    val hasFace = pm.hasSystemFeature(PackageManager.FEATURE_FACE)
    val hasFingerprint = pm.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT)
    return when {
      hasFace && hasFingerprint -> BiometryType.MULTIPLE
      hasFace -> BiometryType.FACE
      hasFingerprint -> BiometryType.FINGERPRINT
      else -> BiometryType.UNKNOWN
    }
  }

  /**
   * Returns current biometric availability and enrollment state.
   */
  fun availability(context: Context): BiometricAvailability {
    val manager = BiometricManager.from(context)
    val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or
      BiometricManager.Authenticators.DEVICE_CREDENTIAL
    val status = manager.canAuthenticate(authenticators)
    val available = status == BiometricManager.BIOMETRIC_SUCCESS
    val enrolled = status != BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED

    return BiometricAvailability(
      biometryType = detectType(context),
      isAvailable = available,
      isEnrolled = enrolled,
      status = status
    )
  }

  /**
   * Prompts the user for biometric auth. Requires a FragmentActivity host.
   */
  fun authenticate(
    activity: FragmentActivity,
    title: String,
    subtitle: String? = null,
    description: String? = null,
    allowDeviceCredential: Boolean = true,
    callback: (BiometricAuthResult) -> Unit
  ) {
    val executor = ContextCompat.getMainExecutor(activity)
    val authenticators = if (allowDeviceCredential) {
      BiometricManager.Authenticators.BIOMETRIC_STRONG or
        BiometricManager.Authenticators.DEVICE_CREDENTIAL
    } else {
      BiometricManager.Authenticators.BIOMETRIC_STRONG
    }

    val promptInfoBuilder = BiometricPrompt.PromptInfo.Builder()
      .setTitle(title)
      .setAllowedAuthenticators(authenticators)

    subtitle?.let { promptInfoBuilder.setSubtitle(it) }
    description?.let { promptInfoBuilder.setDescription(it) }

    val prompt = BiometricPrompt(
      activity,
      executor,
      object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
          super.onAuthenticationSucceeded(result)
          callback(
            BiometricAuthResult(
              biometryType = detectType(activity),
              success = true,
              error = null
            )
          )
        }

        override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
          super.onAuthenticationError(errorCode, errString)
          callback(
            BiometricAuthResult(
              biometryType = detectType(activity),
              success = false,
              error = errString.toString()
            )
          )
        }

        override fun onAuthenticationFailed() {
          super.onAuthenticationFailed()
          callback(
            BiometricAuthResult(
              biometryType = detectType(activity),
              success = false,
              error = "Authentication failed"
            )
          )
        }
      }
    )

    prompt.authenticate(promptInfoBuilder.build())
  }
}
