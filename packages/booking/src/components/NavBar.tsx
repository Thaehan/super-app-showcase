import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NavBar = ({navigation, back, options, route}: NativeStackHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      {back ? (
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#1C1B1F" />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {options.title ?? route.name}
      </Text>
      <View style={styles.backButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6EDFF',
    paddingHorizontal: 4,
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#1C1B1F',
    textAlign: 'center',
  },
});

export default NavBar;
