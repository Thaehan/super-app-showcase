import React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TabsParamList} from '../navigation/TabsNavigator';
import {HomeStackParamList} from '../navigation/HomeNavigator';
import upcomingBookings from '../data/upcomingBookings.json';
import newProducts from '../data/newProducts.json';
import recentNews from '../data/recentNews.json';
import recentArticles from '../data/recentArticles.json';
import {MMKVTest} from '../components/MMKVTest';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList>,
  BottomTabScreenProps<TabsParamList, 'HomeNavigator'>
>;

const renderUpcoming = ({item}: any) => (
  <View style={styles.card}>
    <View style={styles.cardTitleRow}>
      <View style={styles.avatarIcon}>
        <Icon name="calendar" size={24} color="#fff" />
      </View>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={styles.cardTitle}>{`${item.title} • ${item.provider}`}</Text>
        <Text style={styles.cardSubtitle}>{`${item.date} ${item.time}`}</Text>
      </View>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity onPress={() => {}} style={styles.textButton}>
        <Text style={styles.textButtonLabel}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.containedButton}>
        <Text style={styles.containedButtonLabel}>Reschedule</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const renderProduct: ListRenderItem<any> = ({item, index}) => (
  <View style={[styles.card, styles.cardWidth]}>
    <Image source={{uri: `${item.image}?${index}`}} style={styles.cardCover} />
    <View style={styles.cardContent}>
      <Text style={styles.titleText}>{`${item.name} • $${item.price}`}</Text>
      <Text style={styles.paragraphText} numberOfLines={1}>{item.description}</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity onPress={() => {}} style={styles.textButton}>
        <Text style={styles.textButtonLabel}>To Wishlist</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.textButton}>
        <Text style={styles.textButtonLabel}>Buy</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const renderArticle: ListRenderItem<any> = ({item, index}) => (
  <View style={[styles.card, styles.cardWidth]}>
    <Image source={{uri: `${item.image}?${index}`}} style={styles.cardCover} />
    <View style={styles.cardContent}>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.paragraphText} numberOfLines={3}>{item.content}</Text>
    </View>
  </View>
);

const renderDivider = () => <View style={styles.divider} />;

const HomeScreen = ({navigation}: Props) => {
  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Appointments</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Upcoming' as any)}
          style={styles.seeAllButton}>
          <Text style={styles.seeAllLabel}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={upcomingBookings.data}
        renderItem={renderUpcoming}
        ItemSeparatorComponent={renderDivider}
        contentContainerStyle={styles.contentContainer}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Products</Text>
        <TouchableOpacity onPress={() => {}} style={styles.seeAllButton}>
          <Text style={styles.seeAllLabel}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={newProducts.data}
        renderItem={renderProduct}
        ItemSeparatorComponent={renderDivider}
        contentContainerStyle={styles.contentContainer}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent News</Text>
        <TouchableOpacity onPress={() => {}} style={styles.seeAllButton}>
          <Text style={styles.seeAllLabel}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recentNews.data}
        renderItem={renderArticle}
        ItemSeparatorComponent={renderDivider}
        contentContainerStyle={styles.contentContainer}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Articles</Text>
        <TouchableOpacity onPress={() => {}} style={styles.seeAllButton}>
          <Text style={styles.seeAllLabel}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recentArticles.data}
        renderItem={renderArticle}
        ItemSeparatorComponent={renderDivider}
        contentContainerStyle={styles.contentContainer}
      />
      <MMKVTest app="Host" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  divider: {
    backgroundColor: 'transparent',
    width: 16,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1B1F',
  },
  seeAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E8DEF8',
    borderRadius: 20,
  },
  seeAllLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6750A4',
  },
  card: {
    backgroundColor: '#F7F2FA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardWidth: {
    width: 270,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6750A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#49454F',
    marginTop: 2,
  },
  cardCover: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    gap: 8,
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
  textButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6750A4',
  },
  containedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6750A4',
    borderRadius: 20,
  },
  containedButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});

export default HomeScreen;
