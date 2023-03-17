import React, {useEffect, useState} from 'react';
import {
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
// import {distanceInMeters, InRange} from '../helpers/utils';
// import {FIXED_LOCATION} from '../helpers/constants';

export const FIXED_LOCATION = {
  latitude: 24.8620292,
  longitude: 67.0708194,
  radius: 5, // in meters
};

export const distanceInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371000; // Earth's radius in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const InRange = (distance: number) => {
  return (distance <= FIXED_LOCATION.radius).toString();
};

function Location(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [location, setLocation] = useState({longitude: 0, latitude: 0});
  const [timeStamp, setTimeStamp] = useState('');
  const [distance, setDistance] = useState(0);
  const [isInRange, setIsInRange] = useState('false');

  useEffect(() => {
    console.log('getting location...');
    const id = Geolocation.watchPosition(
      position => {
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
        console.log(distance);

        setTimeStamp(new Date(position.timestamp).toISOString());
        setLocation(position.coords);
      },
      error => console.log(error),
      {interval: 100},
    );
    return () => Geolocation.clearWatch(id);
  });

  //   useEffect(() => {
  //     console.log('getting location...');
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         console.log(position);
  //         const {latitude, longitude} = position.coords;
  //         setDistance(
  //           distanceInMeters(
  //             latitude,
  //             longitude,
  //             FIXED_LOCATION.latitude,
  //             FIXED_LOCATION.longitude,
  //           ),
  //         );
  //         console.log(distance);

  //         setTimeStamp(new Date(position.timestamp).toISOString());
  //         setLocation(position.coords);
  //       },
  //       error => console.log(error),
  //     );
  //   },[]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          <Text style={styles.txt}>latitude: {location.latitude}</Text>
          <Text style={styles.txt}>longitude: {location.longitude}</Text>
          <Text style={styles.txt}>timestamp: {timeStamp}</Text>
          <Text style={styles.txt}>distance: {distance}</Text>
          <Text style={styles.txt}>Is in range: {InRange(distance)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  txt: {
    fontSize: 20,
  },
});

export default Location;
