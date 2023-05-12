import {
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserData} from '../helpers/types';
import {
  COLORS,
  END_TIME,
  START_TIME,
  TIME_INTERVAL,
} from '../helpers/constants';
import auth from '@react-native-firebase/auth';
import {requestPermission, showError} from '../helpers/utils';
import FlashMessage from 'react-native-flash-message';
import moment from 'moment';
import {getLocationAndData, getRealTimeData} from './common/bhrAndLocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

const Bhr = (props: any) => {
  const [myData, setMyData] = useState<UserData>();
  const [usersData, setUsersData] = useState<UserData[]>();
  const user = auth().currentUser;
  // const user = useAuth();

  useEffect(() => {
    requestPermission();
    getRealTimeData(user, setMyData, setUsersData);
  }, []);

  useEffect(() => {
    ReactNativeForegroundService.add_task(
      () => {
        const time = moment(new Date()).format('HH:mm:ss');
        if (time >= START_TIME && time <= END_TIME) {
          console.log('service running at', time);
          getLocationAndData(user);
          console.log('user name', user?.displayName);
          console.log('user id', user?.uid);
        }
      },
      {
        delay: TIME_INTERVAL,
        onLoop: true,
        taskId: 'taskid',
        onError: e => console.log(`Error logging:`, e),
      },
    );

    ReactNativeForegroundService.start({
      id: 144,
      title: 'Foreground Service',
      message: 'you are online!',
    });
  }, []);

  return myData && usersData ? (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome {user?.displayName ?? ''}
        </Text>
        {myData.role === 'admin' && (
          <View>
            <Button
              title="View all users on map"
              onPress={() => props.navigation.push('AllLocations')}
            />
            <View style={{height: 20}} />
            <Button
              title="View all users data"
              onPress={() => props.navigation.push('AllUsersData')}
            />
            <View style={{height: 20}} />
            <Button
              title="view myself"
              onPress={() =>
                props.navigation.push('LocationHistory', {user: myData})
              }
            />
            {usersData?.map((user: UserData) => (
              <View key={user.uid} style={{marginTop: 20}}>
                <Button
                  title={`View ${user.name}`}
                  onPress={() =>
                    props.navigation.push('LocationHistory', {user})
                  }
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <FlashMessage position="top" />
    </>
  ) : (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default Bhr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
});
