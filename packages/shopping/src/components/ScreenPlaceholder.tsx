import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ScreenPlaceholder = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Not implemented yet</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, color: '#1C1B1F' },
});

export default ScreenPlaceholder;
