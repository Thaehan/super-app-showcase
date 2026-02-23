import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const AuthProvider = React.lazy(() => import('auth/AuthProvider'));
const SignInScreen = React.lazy(() => import('auth/SignInScreen'));

const App = () => {
  const queryClient = React.useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000,
          retry: 1,
        },
      },
    }),
  ).current;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary name="AuthProvider">
          <React.Suspense fallback={<SplashScreen />}>
            <AuthProvider>
              {(authData: {isSignout: boolean; isLoading: boolean}) => {
                if (authData.isLoading) {
                  return <SplashScreen />;
                }

                if (authData.isSignout) {
                  return (
                    <React.Suspense fallback={<SplashScreen />}>
                      <SignInScreen />
                    </React.Suspense>
                  );
                }

                return (
                  <NavigationContainer
                    onReady={() => RNBootSplash.hide({fade: true})}>
                    <MainNavigator />
                  </NavigationContainer>
                );
              }}
            </AuthProvider>
          </React.Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
