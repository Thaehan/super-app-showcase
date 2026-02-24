import React, {useCallback, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = useCallback(
    (query: string) => setSearchQuery(query),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <Icon name="magnify" size={24} color="#6750A4" style={styles.searchIcon} />
        <TextInput
          placeholder="Search..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchInput}
          placeholderTextColor="#79747E"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchbar: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2FA',
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 56,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1B1F',
  },
});

export default SearchScreen;
