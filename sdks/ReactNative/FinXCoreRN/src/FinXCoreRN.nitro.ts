import type { HybridObject } from "react-native-nitro-modules";

export type FinXBiometryType =
  | "none"
  | "touchID"
  | "faceID"
  | "fingerprint"
  | "face"
  | "multiple"
  | "unknown";

export type BiometricAvailability = {
  biometryType: FinXBiometryType;
  isAvailable: boolean;
  isEnrolled: boolean;
  error?: string | null;
};

export type BiometricAuthResult = {
  biometryType: FinXBiometryType;
  success: boolean;
  error?: string | null;
};

export type AesGcmEncryptResult = {
  ciphertextBase64: string;
  nonceBase64: string;
  tagBase64: string;
};

export interface FinXCoreRN
  extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;

  biometricsAvailability(): BiometricAvailability;
  authenticateBiometrics(
    reason?: string,
    allowDevicePasscode?: boolean,
  ): BiometricAuthResult;

  cryptoRandomBytesBase64(length: number): string;
  cryptoSha256(text: string): string;
  cryptoHmacSha256(text: string, key: string): string;
  cryptoAesGcmEncrypt(
    plaintext: string,
    keyBase64: string,
    aadBase64?: string,
  ): AesGcmEncryptResult;
  cryptoAesGcmDecrypt(
    ciphertextBase64: string,
    nonceBase64: string,
    tagBase64: string,
    keyBase64: string,
    aadBase64?: string,
  ): string;
}

export type FinXCoreRNSpec = FinXCoreRN;
