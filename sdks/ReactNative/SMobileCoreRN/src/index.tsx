import { NitroModules } from "react-native-nitro-modules";
import type {
  AesGcmEncryptResult,
  BiometricAuthResult,
  BiometricAvailability,
  SMobileCoreRNSpec,
} from "./SMobileCoreRN.nitro";

const SMobileCoreRNHybridObject =
  NitroModules.createHybridObject<SMobileCoreRNSpec>("SMobileCoreRN");

export const setItem = (key: string, value: string) =>
  SMobileCoreRNHybridObject.setItem(key, value);

export const getItem = (key: string) => SMobileCoreRNHybridObject.getItem(key);

export const removeItem = (key: string) =>
  SMobileCoreRNHybridObject.removeItem(key);

export const clear = () => SMobileCoreRNHybridObject.clear();

export const biometricsAvailability = (): BiometricAvailability =>
  SMobileCoreRNHybridObject.biometricsAvailability();

export const authenticateBiometrics = (
  reason?: string,
  allowDevicePasscode?: boolean
): BiometricAuthResult =>
  SMobileCoreRNHybridObject.authenticateBiometrics(
    reason ?? "Authenticate to continue",
    allowDevicePasscode ?? true
  );

export const cryptoRandomBytesBase64 = (length: number) =>
  SMobileCoreRNHybridObject.cryptoRandomBytesBase64(length);

export const cryptoSha256 = (text: string) =>
  SMobileCoreRNHybridObject.cryptoSha256(text);

export const cryptoHmacSha256 = (text: string, key: string) =>
  SMobileCoreRNHybridObject.cryptoHmacSha256(text, key);

export const cryptoAesGcmEncrypt = (
  plaintext: string,
  keyBase64: string,
  aadBase64?: string
): AesGcmEncryptResult =>
  SMobileCoreRNHybridObject.cryptoAesGcmEncrypt(plaintext, keyBase64, aadBase64);

export const cryptoAesGcmDecrypt = (
  ciphertextBase64: string,
  nonceBase64: string,
  tagBase64: string,
  keyBase64: string,
  aadBase64?: string
): string =>
  SMobileCoreRNHybridObject.cryptoAesGcmDecrypt(
    ciphertextBase64,
    nonceBase64,
    tagBase64,
    keyBase64,
    aadBase64
  );
