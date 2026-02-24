import React from 'react';
import {
  Alert, Dimensions, FlatList, Image, ListRenderItem, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import products from '../data/products.json';

const showNotImplementedAlert = () => Alert.alert('Not implemented yet');

const renderProduct: ListRenderItem<any> = ({item, index}) => (
  <View style={[styles.card, styles.cardWidth]}>
    <Image source={{uri: `${item.image}?${index}`}} style={styles.cardCover} />
    <View style={styles.cardContent}>
      <Text style={styles.titleText}>{`${item.name} • $${item.price}`}</Text>
      <Text style={styles.paragraphText} numberOfLines={1}>{item.description}</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity onPress={showNotImplementedAlert} style={styles.textButton}>
        <Text style={styles.textButtonLabel}>To Wishlist</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showNotImplementedAlert} style={styles.textButton}>
        <Text style={styles.textButtonLabel}>Buy</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const renderSliderItem = () => (
  <Image source={{uri: 'https://picsum.photos/600?a'}} style={styles.sliderItem} />
);

const renderDivider = () => <View style={styles.divider} />;

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <FlatList horizontal showsHorizontalScrollIndicator={false}
        data={products.data} renderItem={renderSliderItem} pagingEnabled />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Featured Products</Text>
        <TouchableOpacity onPress={showNotImplementedAlert} style={styles.seeAllButton}>
          <Text style={styles.seeAllLabel}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={products.data}
        renderItem={renderProduct} ItemSeparatorComponent={renderDivider} contentContainerStyle={styles.contentContainer} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Products</Text>
        <TouchableOpacity onPress={showNotImplementedAlert} style={styles.seeAllButton}>
          <Text style={styles.seeAllLabel}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={products.data}
        renderItem={renderProduct} ItemSeparatorComponent={renderDivider} contentContainerStyle={styles.contentContainer} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>You may also like</Text>
        <TouchableOpacity onPress={showNotImplementedAlert} style={styles.seeAllButton}>
          <Text style={styles.seeAllLabel}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={products.data}
        renderItem={renderProduct} ItemSeparatorComponent={renderDivider} contentContainerStyle={styles.contentContainer} />
    </ScrollView>
  );
};

const {width: sliderItemWidth} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { paddingHorizontal: 16 },
  divider: { backgroundColor: 'transparent', width: 16 },
  header: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '600', color: '#1C1B1F' },
  seeAllButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#E8DEF8', borderRadius: 20 },
  seeAllLabel: { fontSize: 14, fontWeight: '500', color: '#6750A4' },
  card: { backgroundColor: '#F7F2FA', borderRadius: 12, overflow: 'hidden' },
  cardWidth: { width: 270 },
  cardCover: { width: '100%', height: 150 },
  cardContent: { padding: 16 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, gap: 8 },
  titleText: { fontSize: 16, fontWeight: '500', color: '#1C1B1F' },
  paragraphText: { fontSize: 14, color: '#49454F', marginTop: 4 },
  textButton: { paddingHorizontal: 12, paddingVertical: 8 },
  textButtonLabel: { fontSize: 14, fontWeight: '500', color: '#6750A4' },
  sliderItem: { width: sliderItemWidth, height: (sliderItemWidth / 3) * 2 },
});

export default HomeScreen;
