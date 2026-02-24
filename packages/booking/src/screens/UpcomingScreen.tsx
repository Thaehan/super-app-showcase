import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import upcomingBookings from '../data/upcomingBookings.json';

const renderItem = ({item}: any) => (
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

const renderDivider = () => <View style={styles.divider} />;

const UpcomingScreen = () => (
  <FlatList
    data={upcomingBookings.data}
    renderItem={renderItem}
    ItemSeparatorComponent={renderDivider}
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
  />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 16 },
  divider: { backgroundColor: 'transparent', height: 8 },
  card: { backgroundColor: '#F7F2FA', borderRadius: 12, overflow: 'hidden' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatarIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6750A4', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#1C1B1F' },
  cardSubtitle: { fontSize: 14, color: '#49454F', marginTop: 2 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, gap: 8 },
  textButton: { paddingHorizontal: 12, paddingVertical: 8 },
  textButtonLabel: { fontSize: 14, fontWeight: '500', color: '#6750A4' },
  containedButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#6750A4', borderRadius: 20 },
  containedButtonLabel: { fontSize: 14, fontWeight: '500', color: '#fff' },
});

export default UpcomingScreen;
