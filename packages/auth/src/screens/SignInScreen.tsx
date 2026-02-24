import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import Container from '../components/Container';

const SignInScreen = () => {
  const {signIn} = useAuth();

  return (
    <Container style={styles.container}>
      <Text style={styles.welcomeHeadline}>Welcome!</Text>
      <Text style={styles.welcomeText}>
        This is a dummy login screen. Just press the button and have a look
        around this super app 🚀
      </Text>
      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeHeadline: {
    fontSize: 28,
    fontWeight: '600',
    color: '#36343B',
  },
  welcomeText: {
    fontSize: 16,
    padding: 16,
    paddingBottom: 32,
    color: '#1C1B1F',
    textAlign: 'center',
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

export default SignInScreen;
