import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../helpers/constants';
import {UserData} from '../helpers/types';

export default function AddressCard(props: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{props.name}</Text>
      <View style={styles.horizontalText}>
        <Text style={styles.heading}>Role:</Text>
        <Text>{props.role}</Text>
      </View>
      <View style={styles.horizontalText}>
        <Text style={styles.heading}>Latitude:</Text>
        <Text>{props.coords.latitude}</Text>
      </View>
      <View style={styles.horizontalText}>
        <Text style={styles.heading}>Longitude:</Text>
        <Text>{props.coords.longitude}</Text>
      </View>
      <View style={styles.horizontalText}>
        <Text style={styles.heading}>Address:</Text>
        <Text>{props.address}</Text>
      </View>
      <View style={styles.horizontalText}>
        <Text style={styles.heading}>Last update at:</Text>
        <Text>{props.lastLocationUpdate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    paddingRight: 70,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    marginHorizontal: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 5,
    color: COLORS.primary,
  },
  horizontalText: {
    flexDirection: 'row',
  },
  heading: {
    fontWeight: 'bold',
    marginRight: 5,
  },
});
