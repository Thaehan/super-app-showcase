import React from 'react';
import { View, StyleSheet } from 'react-native';
import ErrorBoundary from '../components/ErrorBoundary';
import Placeholder from '../components/Placeholder';

const Account = React.lazy(() => import('auth/AccountScreen'));

const AccountScreen = () => {
  return (
    <View style={styles.container}>
      <ErrorBoundary name="AccountScreen">
        <React.Suspense fallback={<Placeholder label="Account" icon="account" />}>
          <Account />
        </React.Suspense>
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AccountScreen;
