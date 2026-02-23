import type { HybridObject } from "react-native-nitro-modules";

export type SMobileBiometryType =
  | "none"
  | "touchID"
  | "faceID"
  | "fingerprint"
  | "face"
  | "multiple"
  | "unknown";

export type BiometricAvailability = {
  biometryType: SMobileBiometryType;
  isAvailable: boolean;
  isEnrolled: boolean;
  error?: string | null;
};

export type BiometricAuthResult = {
  biometryType: SMobileBiometryType;
  success: boolean;
  error?: string | null;
};

export type AesGcmEncryptResult = {
  ciphertextBase64: string;
  nonceBase64: string;
  tagBase64: string;
};

export interface SMobileCoreRN
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

export type SMobileCoreRNSpec = SMobileCoreRN;
