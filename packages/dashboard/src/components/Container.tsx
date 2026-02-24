import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const Container = ({children, style}: Props) => (
  <SafeAreaView style={[styles.container, style]}>
    {children}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Container;
