import React, {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  label: string;
  icon: string;
};

const Placeholder: FC<Props> = ({label, icon}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Icon size={96} color="#36343B" name={icon} />
      <Text style={styles.text}>{label}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#36343B',
  },
});

export default Placeholder;
