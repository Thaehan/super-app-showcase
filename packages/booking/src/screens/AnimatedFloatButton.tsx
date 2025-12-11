import React, {useEffect} from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/**
 * Simple screen to validate Reanimated is working.
 * - A floating button gently bobs up/down via a repeating animation.
 * - Tapping the button toggles a spring that moves it horizontally.
 */
const AnimatedFloatButton = () => {
  const vertical = useSharedValue(0);
  const horizontal = useSharedValue(0);

  useEffect(() => {
    vertical.value = withRepeat(
      withTiming(-14, {duration: 900, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [vertical]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: vertical.value},
      {translateX: horizontal.value},
      {scale: 1 + Math.abs(vertical.value) / 80},
    ],
    shadowOffset: {width: 0, height: 6 + Math.abs(vertical.value) / 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  }));

  const onPress = () => {
    horizontal.value = withSpring(horizontal.value === 0 ? 80 : 0, {
      damping: 12,
      stiffness: 140,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fab, animatedStyle]}>
        <Pressable onPress={onPress} style={styles.pressable}>
          <Text style={styles.label}>Test Reanimated</Text>
          <Text style={styles.subLabel}>Tap me</Text>
        </Pressable>
      </Animated.View>
      <Text style={styles.hint}>
        Floating button should bob up/down automatically. Tap to slide sideways
        with a spring — if it moves, Reanimated is configured.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1021',
    padding: 24,
  },
  fab: {
    backgroundColor: '#ff5c8a',
    borderRadius: 32,
  },
  pressable: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  subLabel: {
    color: '#ffe6f0',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
  },
  hint: {
    color: '#d0d7ff',
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 20,
  },
});

export default AnimatedFloatButton;
