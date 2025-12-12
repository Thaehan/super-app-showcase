import { NitroModules } from "react-native-nitro-modules";
import type {
  AesGcmEncryptResult,
  BiometricAuthResult,
  BiometricAvailability,
  FinXCoreRNSpec,
} from "./FinXCoreRN.nitro";

const FinXCoreRNHybridObject =
  NitroModules.createHybridObject<FinXCoreRNSpec>("FinXCoreRN");

export const setItem = (key: string, value: string) =>
  FinXCoreRNHybridObject.setItem(key, value);

export const getItem = (key: string) => FinXCoreRNHybridObject.getItem(key);

export const removeItem = (key: string) =>
  FinXCoreRNHybridObject.removeItem(key);

export const clear = () => FinXCoreRNHybridObject.clear();

export const biometricsAvailability = (): BiometricAvailability =>
  FinXCoreRNHybridObject.biometricsAvailability();

export const authenticateBiometrics = (
  reason?: string,
  allowDevicePasscode?: boolean
): BiometricAuthResult =>
  FinXCoreRNHybridObject.authenticateBiometrics(
    reason ?? "Authenticate to continue",
    allowDevicePasscode ?? true
  );

export const cryptoRandomBytesBase64 = (length: number) =>
  FinXCoreRNHybridObject.cryptoRandomBytesBase64(length);

export const cryptoSha256 = (text: string) =>
  FinXCoreRNHybridObject.cryptoSha256(text);

export const cryptoHmacSha256 = (text: string, key: string) =>
  FinXCoreRNHybridObject.cryptoHmacSha256(text, key);

export const cryptoAesGcmEncrypt = (
  plaintext: string,
  keyBase64: string,
  aadBase64?: string
): AesGcmEncryptResult =>
  FinXCoreRNHybridObject.cryptoAesGcmEncrypt(plaintext, keyBase64, aadBase64);

export const cryptoAesGcmDecrypt = (
  ciphertextBase64: string,
  nonceBase64: string,
  tagBase64: string,
  keyBase64: string,
  aadBase64?: string
): string =>
  FinXCoreRNHybridObject.cryptoAesGcmDecrypt(
    ciphertextBase64,
    nonceBase64,
    tagBase64,
    keyBase64,
    aadBase64
  );
