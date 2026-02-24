import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
  authenticateBiometrics,
  biometricsAvailability,
  clear as clearKeychain,
  cryptoRandomBytesBase64,
  cryptoSha256,
  getItem,
  setItem,
} from 'smobile-core-rn';

const SMobileCoreTest = () => {
  const [status, setStatus] = useState('Ready to test SMobileCoreRN');
  const [value, setValue] = useState('');
  const [key, setKey] = useState('smobile-demo-token');

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
    if (!targetKey) return;
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
    if (!targetKey) return;
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
      const auth = authenticateBiometrics('Authenticate to test SMobileCoreRN');
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
      const hash = cryptoSha256(value || 'smobile-demo');
      setStatus(`SHA256: ${hash.slice(0, 12)}…`);
    } catch (e) {
      setStatus(`Hash error: ${(e as Error).message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMobileCoreRN playground</Text>
      <TextInput
        style={styles.input}
        value={key}
        onChangeText={setKey}
        placeholder="Key"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Value to store/hash"
      />
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.button, styles.containedBtn]} onPress={runSet}>
          <Text style={styles.containedLabel}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.outlinedBtn]} onPress={runGet}>
          <Text style={styles.outlinedLabel}>Read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={runClear}>
          <Text style={styles.outlinedLabel}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.button, styles.tonalBtn]} onPress={runBiometrics}>
          <Text style={styles.tonalLabel}>Check biometrics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.outlinedBtn]} onPress={runAuth}>
          <Text style={styles.outlinedLabel}>Prompt auth</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.button, styles.tonalBtn]} onPress={runHash}>
          <Text style={styles.tonalLabel}>SHA256</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.outlinedBtn]}
          onPress={() => setValue(cryptoRandomBytesBase64(24))}>
          <Text style={styles.outlinedLabel}>Random bytes</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  containedBtn: {
    backgroundColor: '#6750A4',
  },
  containedLabel: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  outlinedBtn: {
    borderWidth: 1,
    borderColor: '#79747E',
  },
  outlinedLabel: {
    color: '#6750A4',
    fontWeight: '500',
    fontSize: 14,
  },
  tonalBtn: {
    backgroundColor: '#E8DEF8',
  },
  tonalLabel: {
    color: '#1D192B',
    fontWeight: '500',
    fontSize: 14,
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: '#49454F',
  },
});

export default SMobileCoreTest;
