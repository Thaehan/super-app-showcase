import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {
  authenticateBiometrics,
  biometricsAvailability,
  clear as clearKeychain,
  cryptoRandomBytesBase64,
  cryptoSha256,
  getItem,
  setItem,
} from 'finx-core-rn';

const FinXCoreTest = () => {
  const [status, setStatus] = useState('Ready to test FinXCoreRN');
  const [value, setValue] = useState('');
  const [key, setKey] = useState('finx-demo-token');

  const ensureKey = () => {
    const trimmed = key.trim();
    if (!trimmed) {
      setStatus('Please enter a key');
      return null;
    }
    return trimmed;
  };

  const runSet = () => {
    const targetKey = ensureKey();
    if (!targetKey) {
      return;
    }
    try {
      const payload = value || cryptoRandomBytesBase64(16);
      setItem(targetKey, payload);
      setStatus(`Saved key "${targetKey}"`);
    } catch (e) {
      setStatus(`Save failed: ${(e as Error).message}`);
    }
  };

  const runGet = () => {
    const targetKey = ensureKey();
    if (!targetKey) {
      return;
    }
    try {
      const stored = getItem(targetKey);
      setStatus(
        stored ? `Read "${stored}" for key "${targetKey}"` : 'No value stored',
      );
    } catch (e) {
      setStatus(`Read failed: ${(e as Error).message}`);
    }
  };

  const runClear = () => {
    try {
      clearKeychain();
      setStatus('Cleared keychain');
    } catch (e) {
      setStatus(`Clear failed: ${(e as Error).message}`);
    }
  };

  const runBiometrics = () => {
    try {
      const availability = biometricsAvailability();
      setStatus(
        `Biometrics: ${availability.biometryType}, available=${availability.isAvailable}, enrolled=${availability.isEnrolled}`,
      );
    } catch (e) {
      setStatus(`Availability error: ${(e as Error).message}`);
    }
  };

  const runAuth = () => {
    try {
      const auth = authenticateBiometrics('Authenticate to test FinXCoreRN');
      setStatus(
        auth.success
          ? `Auth success (${auth.biometryType})`
          : `Auth failed: ${auth.error ?? 'unknown error'}`,
      );
    } catch (e) {
      setStatus(`Auth error: ${(e as Error).message}`);
    }
  };

  const runHash = () => {
    try {
      const hash = cryptoSha256(value || 'finx-demo');
      setStatus(`SHA256: ${hash.slice(0, 12)}…`);
    } catch (e) {
      setStatus(`Hash error: ${(e as Error).message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        FinXCoreRN playground
      </Text>
      <TextInput
        mode="outlined"
        label="Key"
        value={key}
        onChangeText={setKey}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        mode="outlined"
        label="Value to store/hash"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      />
      <View style={styles.actionsRow}>
        <Button mode="contained" onPress={runSet} style={styles.button}>
          Save
        </Button>
        <Button mode="outlined" onPress={runGet} style={styles.button}>
          Read
        </Button>
        <Button mode="text" onPress={runClear} style={styles.button}>
          Clear
        </Button>
      </View>
      <View style={styles.actionsRow}>
        <Button mode="contained-tonal" onPress={runBiometrics} style={styles.button}>
          Check biometrics
        </Button>
        <Button mode="outlined" onPress={runAuth} style={styles.button}>
          Prompt auth
        </Button>
      </View>
      <View style={styles.actionsRow}>
        <Button mode="contained-tonal" onPress={runHash} style={styles.button}>
          SHA256
        </Button>
        <Button
          mode="outlined"
          onPress={() => setValue(cryptoRandomBytesBase64(24))}
          style={styles.button}>
          Random bytes
        </Button>
      </View>
      <Text variant="bodyMedium" style={styles.status}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'white',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    flexGrow: 1,
  },
  status: {
    marginTop: 8,
  },
});

export default FinXCoreTest;
