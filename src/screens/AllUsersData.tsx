import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserData} from '../helpers/types';
import {COLORS} from '../helpers/constants';
import AddressCard from '../components/AddressCard';
import {getRealTimeData} from './common/bhrAndLocation';
import auth from '@react-native-firebase/auth';

export default function AllUsersData() {
  const [myData, setMyData] = useState<UserData>();
  const [usersData, setUsersData] = useState<UserData[]>();
  const user = auth().currentUser;

  useEffect(() => {
    getRealTimeData(user, setMyData, setUsersData);
  }, []);

  return myData && usersData ? (
    <ScrollView style={styles.container}>
      <AddressCard
        name="Me"
        role={myData.role}
        coords={myData.coords}
        address={myData.address}
        lastLocationUpdate={myData.lastLocationUpdate}
      />
      {usersData.map((user, index) => {
        return (
          <AddressCard
            key={index}
            name={user.name}
            role={user.role}
            coords={user.coords}
            address={user.address}
            lastLocationUpdate={user.lastLocationUpdate}
          />
        );
      })}
      <View style={{height: 20}} />
    </ScrollView>
  ) : (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
