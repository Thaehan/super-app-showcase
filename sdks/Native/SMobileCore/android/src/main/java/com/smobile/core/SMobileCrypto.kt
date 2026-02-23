package com.smobile.core

import java.security.MessageDigest
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.Mac
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

data class AESGCMResult(
  val ciphertext: ByteArray,
  val iv: ByteArray,
  val tag: ByteArray
)

object SMobileCrypto {
  private const val AES_ALGO = "AES"
  private const val AES_GCM_NO_PADDING = "AES/GCM/NoPadding"
  private const val GCM_TAG_LENGTH = 128 // bits

  fun randomBytes(count: Int): ByteArray {
    val bytes = ByteArray(count)
    SecureRandom().nextBytes(bytes)
    return bytes
  }

  fun sha256Hex(data: ByteArray): String {
    val digest = MessageDigest.getInstance("SHA-256").digest(data)
    return digest.toHex()
  }

  fun sha256Hex(input: String): String = sha256Hex(input.toByteArray())

  fun hmacSHA256Hex(data: ByteArray, key: ByteArray): String {
    val mac = Mac.getInstance("HmacSHA256")
    mac.init(SecretKeySpec(key, "HmacSHA256"))
    return mac.doFinal(data).toHex()
  }

  fun aesGCMEncrypt(
    plaintext: ByteArray,
    key: ByteArray,
    iv: ByteArray = randomBytes(12),
    aad: ByteArray? = null
  ): AESGCMResult {
    val secretKey = SecretKeySpec(key, AES_ALGO)
    val cipher = Cipher.getInstance(AES_GCM_NO_PADDING)
    val params = GCMParameterSpec(GCM_TAG_LENGTH, iv)
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, params)
    aad?.let { cipher.updateAAD(it) }

    val encrypted = cipher.doFinal(plaintext)
    val cipherText = encrypted.copyOfRange(0, encrypted.size - 16)
    val tag = encrypted.copyOfRange(encrypted.size - 16, encrypted.size)

    return AESGCMResult(cipherText, iv, tag)
  }

  fun aesGCMDecrypt(
    ciphertext: ByteArray,
    iv: ByteArray,
    tag: ByteArray,
    key: ByteArray,
    aad: ByteArray? = null
  ): ByteArray {
    val secretKey = SecretKeySpec(key, AES_ALGO)
    val cipher = Cipher.getInstance(AES_GCM_NO_PADDING)
    val params = GCMParameterSpec(GCM_TAG_LENGTH, iv)
    cipher.init(Cipher.DECRYPT_MODE, secretKey, params)
    aad?.let { cipher.updateAAD(it) }

    val combined = ByteArray(ciphertext.size + tag.size)
    System.arraycopy(ciphertext, 0, combined, 0, ciphertext.size)
    System.arraycopy(tag, 0, combined, ciphertext.size, tag.size)

    return cipher.doFinal(combined)
  }

  private fun ByteArray.toHex(): String =
    joinToString(separator = "") { byte -> "%02x".format(byte) }
}
