import React, {useCallback} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/MainNavigator';
import services from '../data/services.json';
import {ServicesStackParamList} from '../navigation/ServicesNavigator';

type ServiceScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ServicesStackParamList, 'Services'>,
  NativeStackScreenProps<MainStackParamList>
>;

type ServiceMenuItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const ServicesScreen = ({navigation}: ServiceScreenProps) => {
  const openBooking = useCallback(
    () => navigation.navigate('Booking'),
    [navigation],
  );

  const openNews = useCallback(() => navigation.navigate('News'), [navigation]);

  const openShopping = useCallback(
    () => navigation.navigate('Shopping'),
    [navigation],
  );

  const openDashboard = useCallback(
    () => navigation.navigate('Dashboard'),
    [navigation],
  );

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<ServiceMenuItem>) => {
      const lastItem = index === services.data.length - 1;
      const map = new Map([
        ['booking', openBooking],
        ['news', openNews],
        ['shopping', openShopping],
        ['dashboard', openDashboard],
      ]);

      const onPress =
        map.get(item.id) ?? (() => Alert.alert('Not implemented yet'));

      return (
        <View style={[styles.serviceItem, lastItem && styles.lastServiceItem]}>
          <TouchableOpacity onPress={onPress} style={styles.cardItem} activeOpacity={0.7}>
            <Image source={{uri: `${item.image}?${index}`}} style={styles.cardCover} />
            <View style={styles.cardContent}>
              <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.paragraphText} numberOfLines={1}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [openBooking, openDashboard, openNews, openShopping],
  );

  return (
    <FlatList
      numColumns={2}
      data={services.data}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 8,
  },
  serviceItem: {
    flex: 1,
    padding: 8,
    maxWidth: '100%',
  },
  lastServiceItem: {
    maxWidth: '50%',
  },
  cardItem: {
    flex: 1,
    backgroundColor: '#F7F2FA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardCover: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
  },
  paragraphText: {
    fontSize: 14,
    color: '#49454F',
    marginTop: 4,
  },
});

export default ServicesScreen;
