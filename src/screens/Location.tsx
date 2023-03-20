import React, {useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';
import {distanceInMeters, isInRange} from '../helpers/utils';
import {FIXED_LOCATION} from '../helpers/constants';

interface ILocation {
  longitude?: number;
  latitude?: number;
}

function Location(): JSX.Element {
  const [location, setLocation] = useState<ILocation>({});
  const [timeStamp, setTimeStamp] = useState('');
  const [distance, setDistance] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [inRange, setInRange] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const id = setInterval(() => {
      console.log('getting location...');
      Geolocation.getCurrentPosition(
        position => {
          setErrMsg('');
          setIsLoading(false);
          console.log(position);
          const {latitude, longitude} = position.coords;
          setDistance(
            distanceInMeters(
              latitude,
              longitude,
              FIXED_LOCATION.latitude,
              FIXED_LOCATION.longitude,
            ),
          );
          // setInRange(isInRange(distance));
          setTimeStamp(new Date(position.timestamp).toISOString());
          setLocation(position.coords);
        },
        error => {
          setIsLoading(false);
          setErrMsg(error.message);
          console.log(error);
        },
      );
    }, 2000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            !isLoading && !errMsg
              ? isInRange(Number(distance))
                ? 'green'
                : '#be1809'
              : '#F5FCFF',
        },
      ]}>
      {isLoading ? (
        <Text style={{fontSize: 20}}>Fetching current location...</Text>
      ) : errMsg ? (
        <Text style={{fontSize: 20}}>{errMsg}</Text>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.txt}>latitude: {location.latitude}</Text>
          <Text style={styles.txt}>longitude: {location.longitude}</Text>
          <Text style={styles.txt}>distance: {distance}</Text>
          <Text style={styles.txt}>
            In range: {isInRange(Number(distance)).toString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textContainer: {alignItems: 'center'},
  txt: {
    fontSize: 18,
    color: 'white',
  },
});

export default Location;
