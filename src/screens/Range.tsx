import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import {getDistanceInMeters, isInRange} from '../helpers/utils';
import {COLORS, FIXED_LOCATION} from '../helpers/constants';
import {ILocation} from '../helpers/types';

function Range(): JSX.Element {
  const [location, setLocation] = useState<ILocation>({});
  const [timeStamp, setTimeStamp] = useState('');
  const [distance, setDistance] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [inRange, setInRange] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [distanceOutsideRange, setDistanceOutsideRange] = useState<number>();

  useEffect(() => {
    // const id = setInterval(() => {
    console.log('getting location...');
    const id = Geolocation.watchPosition(
      position => {
        setErrMsg('');
        setIsLoading(false);
        console.log(position);
        const {latitude, longitude} = position.coords;
        const distanceInMeters = getDistanceInMeters(
          latitude,
          longitude,
          FIXED_LOCATION.latitude,
          FIXED_LOCATION.longitude,
        );
        const rangeBoolValue = isInRange(distanceInMeters);
        setDistanceOutsideRange(
          rangeBoolValue ? undefined : distanceInMeters - FIXED_LOCATION.radius,
        );
        setTimeStamp(new Date(position.timestamp).toISOString());
        setDistance(distanceInMeters);
        setInRange(rangeBoolValue);
        setLocation(position.coords);
      },
      error => {
        setIsLoading(false);
        setErrMsg(error.message);
        console.log(error);
      },
      {enableHighAccuracy: true},
    );
    // }, 4000);

    return () => {
      Geolocation.clearWatch(id);
      // clearInterval(id);
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            !isLoading && !errMsg ? (inRange ? 'green' : '#be1809') : '#F5FCFF',
        },
      ]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : errMsg ? (
        <Text style={{fontSize: 20}}>{errMsg}</Text>
      ) : (
        <View>
          {/* {distanceOutsideRange ? (
            <Text style={styles.txt}>
              You are{' '}
              <Text style={{fontWeight: 'bold'}}>
                {distanceOutsideRange.toFixed(2)}
              </Text>{' '}
              meters outside the range
            </Text>
          ) : (
            <Text style={styles.txt}>You are in range</Text>
            
          )} */}
          <Text style={styles.txt}>latitude: {location.latitude}</Text>
          <Text style={styles.txt}>longitude: {location.longitude}</Text>
          <Text style={styles.txt}>distance: {distance}</Text>
          <Text style={styles.txt}>In range: {inRange.toString()}</Text>
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
    padding: 20,
  },
  txt: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default Range;
