import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import Container from '../components/Container';

const AccountScreen = () => {
  const {signOut} = useAuth();

  return (
    <Container style={styles.container}>
      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#D0BCFF',
    padding: 16,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
  },
});

export default AccountScreen;
