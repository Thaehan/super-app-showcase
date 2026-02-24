import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CalendarList, CalendarUtils, DateData} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import bookings from '../data/bookings.json';

const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());

const renderAppointment = ({item}: any) => (
  <View style={styles.listItem}>
    <View style={styles.listIconContainer}>
      <Icon name="calendar" size={24} color="#49454F" />
    </View>
    <View style={{flex: 1}}>
      <Text style={styles.listTitle}>{`${item.title} • ${item.provider}`}</Text>
      <Text style={styles.listDescription}>{`${item.date} ${item.time}`}</Text>
    </View>
  </View>
);

const CalendarScreen = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);

  const marked = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
      },
      [INITIAL_DATE]: {
        selected: true,
        selectedColor: '#6750A4',
      },
    };
  }, [selected]);

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

  return (
    <View style={styles.container}>
      <CalendarList
        horizontal={true}
        pagingEnabled={true}
        hideExtraDays={false}
        current={INITIAL_DATE}
        markedDates={marked}
        onDayPress={onDayPress}
        theme={{
          backgroundColor: 'black',
          textSectionTitleColor: 'black',
          dayTextColor: 'black',
          monthTextColor: 'black',
          indicatorColor: 'black',
          selectedDayBackgroundColor: '#625B71',
        }}
      />
      <FlatList data={bookings.data} renderItem={renderAppointment} />
      <TouchableOpacity style={styles.fab} onPress={() => {}} activeOpacity={0.7}>
        <Icon name="plus" size={24} color="#6750A4" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
  },
  listDescription: {
    fontSize: 14,
    color: '#49454F',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E8DEF8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
});

export default CalendarScreen;
