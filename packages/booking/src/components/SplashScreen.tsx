import React from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen = () => (
  <SafeAreaView style={styles.container}>
    <Icon style={styles.icon} size={56} color="#36343B" name="cloud" />
    <Text style={styles.text}>Booking application is loading. Please wait...</Text>
    <ActivityIndicator style={styles.progress} size="large" color="#6750A4" />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  icon: { textAlign: 'center' },
  text: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 24, color: '#36343B', textAlign: 'center' },
  progress: { marginVertical: 16, marginHorizontal: 32 },
});

export default SplashScreen;
