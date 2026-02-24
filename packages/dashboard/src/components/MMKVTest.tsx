import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({id: 'super-app-shared'});

export const MMKVTest = ({app}: {app: string}) => {
  const [keyToRead, setKeyToRead] = useState<string>('test_mmkv_key');
  const [val, setVal] = useState<string>('');
  const [savedVal, setSavedVal] = useState<string>('');

  useEffect(() => {
    // Read initial value whenever key changes
    const v = storage.getString(keyToRead);
    setSavedVal(v || '');

    // Setup listener
    const listener = storage.addOnValueChangedListener((key: string) => {
      if (key === keyToRead) {
        const newValue = storage.getString(keyToRead) || '';
        setSavedVal(newValue);
      }
    });

    return () => {
      listener.remove();
    };
  }, [keyToRead]);

  const onSave = () => {
    storage.set('test_mmkv_key', val);
  };

  const onRead = () => {
     const v = storage.getString(keyToRead);
     setSavedVal(v || '');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MMKV Test ({app})</Text>
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, {flex: 1, marginRight: 8}]}
          value={keyToRead}
          onChangeText={setKeyToRead}
          placeholder="Key to read"
        />
        <Button title="Read" onPress={onRead} />
      </View>
      
      <Text style={styles.valueText}>Value: {savedVal}</Text>
      
      <TextInput
        style={styles.input}
        value={val}
        onChangeText={setVal}
        placeholder="Enter new value for 'test_mmkv_key'"
      />
      <Button title="Save to 'test_mmkv_key'" onPress={onSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#e6f7ff',
    margin: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
