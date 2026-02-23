package com.margelo.nitro.smobilecorern

import androidx.biometric.BiometricManager
import androidx.fragment.app.FragmentActivity
import com.facebook.proguard.annotations.DoNotStrip
import com.smobile.core.SMobileBiometrics
import com.smobile.core.SMobileCrypto
import com.smobile.core.KeychainManager
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.NullType
import java.util.concurrent.CountDownLatch

@DoNotStrip
class SMobileCoreRN : HybridSMobileCoreRNSpec() {

  private val keychain: KeychainManager by lazy {
    val ctx = NitroModules.applicationContext
      ?: throw IllegalStateException("NitroModules.applicationContext not set")
    KeychainManager(ctx)
  }

  override fun setItem(key: String, value: String) {
    keychain.set(key, value)
  }

  override fun getItem(key: String): Variant_NullType_String {
    val value = keychain.get(key)
    return if (value == null) {
      Variant_NullType_String.create(NullType.NULL)
    } else {
      Variant_NullType_String.create(value)
    }
  }

  override fun removeItem(key: String) {
    keychain.remove(key)
  }

  override fun clear() {
    keychain.clear()
  }

  override fun biometricsAvailability(): BiometricAvailability {
    val ctx = NitroModules.applicationContext
      ?: throw IllegalStateException("NitroModules.applicationContext not set")
    val availability = SMobileBiometrics.availability(ctx)
    val mappedError = when (availability.status) {
      BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED ->
        Variant_NullType_String.create("Biometrics not enrolled.")
      BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE ->
        Variant_NullType_String.create("Biometric hardware not available.")
      BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE ->
        Variant_NullType_String.create("Biometric hardware unavailable.")
      else -> null
    }

    return BiometricAvailability(
      mapBiometryType(availability.biometryType),
      availability.isAvailable,
      availability.isEnrolled,
      mappedError
    )
  }

  override fun authenticateBiometrics(
    reason: String?,
    allowDevicePasscode: Boolean?
  ): BiometricAuthResult {
    val ctx = NitroModules.applicationContext
      ?: throw IllegalStateException("NitroModules.applicationContext not set")
    val activity = ctx.currentActivity as? FragmentActivity
      ?: return BiometricAuthResult(
        mapBiometryType(com.smobile.core.BiometryType.UNKNOWN),
        false,
        Variant_NullType_String.create("No FragmentActivity available for biometrics.")
      )

    val latch = CountDownLatch(1)
    var result: BiometricAuthResult? = null

    activity.runOnUiThread {
      SMobileBiometrics.authenticate(
        activity,
        reason ?: "Authenticate to continue",
        allowDeviceCredential = allowDevicePasscode ?: true
      ) { authResult ->
        val error = authResult.error?.let { Variant_NullType_String.create(it) }
        result = BiometricAuthResult(
          mapBiometryType(authResult.biometryType),
          authResult.success,
          error
        )
        latch.countDown()
      }
    }

    latch.await()
    return result
      ?: BiometricAuthResult(
        mapBiometryType(com.smobile.core.BiometryType.UNKNOWN),
        false,
        Variant_NullType_String.create("Authentication cancelled.")
      )
  }

  override fun cryptoRandomBytesBase64(length: Double): String {
    val size = length.toInt().coerceAtLeast(0)
    val bytes = SMobileCrypto.randomBytes(size)
    return android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP)
  }

  override fun cryptoSha256(text: String): String {
    return SMobileCrypto.sha256Hex(text)
  }

  override fun cryptoHmacSha256(text: String, key: String): String {
    return SMobileCrypto.hmacSHA256Hex(text.toByteArray(), key.toByteArray())
  }

  override fun cryptoAesGcmEncrypt(
    plaintext: String,
    keyBase64: String,
    aadBase64: String?
  ): AesGcmEncryptResult {
    val key = android.util.Base64.decode(keyBase64, android.util.Base64.DEFAULT)
    val aad = aadBase64?.let { android.util.Base64.decode(it, android.util.Base64.DEFAULT) }
    val result = SMobileCrypto.aesGCMEncrypt(
      plaintext.toByteArray(),
      key,
      aad = aad
    )

    return AesGcmEncryptResult(
      android.util.Base64.encodeToString(result.ciphertext, android.util.Base64.NO_WRAP),
      android.util.Base64.encodeToString(result.iv, android.util.Base64.NO_WRAP),
      android.util.Base64.encodeToString(result.tag, android.util.Base64.NO_WRAP)
    )
  }

  override fun cryptoAesGcmDecrypt(
    ciphertextBase64: String,
    nonceBase64: String,
    tagBase64: String,
    keyBase64: String,
    aadBase64: String?
  ): String {
    val key = android.util.Base64.decode(keyBase64, android.util.Base64.DEFAULT)
    val ciphertext = android.util.Base64.decode(ciphertextBase64, android.util.Base64.DEFAULT)
    val nonce = android.util.Base64.decode(nonceBase64, android.util.Base64.DEFAULT)
    val tag = android.util.Base64.decode(tagBase64, android.util.Base64.DEFAULT)
    val aad = aadBase64?.let { android.util.Base64.decode(it, android.util.Base64.DEFAULT) }

    val plaintext = SMobileCrypto.aesGCMDecrypt(ciphertext, nonce, tag, key, aad)
    return String(plaintext)
  }

  private fun mapBiometryType(type: com.smobile.core.BiometryType): SMobileBiometryType =
    when (type) {
      com.smobile.core.BiometryType.NONE -> SMobileBiometryType.NONE
      com.smobile.core.BiometryType.FINGERPRINT -> SMobileBiometryType.FINGERPRINT
      com.smobile.core.BiometryType.FACE -> SMobileBiometryType.FACE
      com.smobile.core.BiometryType.MULTIPLE -> SMobileBiometryType.MULTIPLE
      com.smobile.core.BiometryType.UNKNOWN -> SMobileBiometryType.UNKNOWN
    }
}
