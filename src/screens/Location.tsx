import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {LatLng, Marker, Region} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {
  COLORS,
  DEFAULT_LOCATION,
  GOOGLE_MAPS_APIKEY,
  USER_A,
  USER_B,
  USER_C,
} from '../helpers/constants';
import {getDeltaValue} from '../helpers/utils';
import MapViewDirections from 'react-native-maps-directions';

const {LATITUDE_DELTA, LONGITUDE_DELTA} = getDeltaValue();

const Location = () => {
  const [myLocation, setMyLocation] = useState<LatLng>();
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setMyLocation(position.coords);
        setIsCurrentLocation(true);
      },
      error => {
        setMyLocation(DEFAULT_LOCATION);
        console.log(error);
      },
      {enableHighAccuracy: true},
    );
    // return () => Geolocation.clearWatch(id);
  }, []);

  return (
    <>
      {myLocation ? (
        <MapView
          style={StyleSheet.absoluteFill}
          ref={mapRef}
          initialRegion={{
            ...myLocation,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {isCurrentLocation && <Marker title="Me" coordinate={myLocation} />}
          <Marker title="User A" coordinate={USER_A} />
          <Marker title="User B" coordinate={USER_B} />
          <Marker title="User C" coordinate={USER_C} />
          <Marker
            title="Me"
            coordinate={myLocation}
            pinColor={COLORS.primary}
          />
          <MapViewDirections
            waypoints={[USER_A, USER_C]}
            origin={myLocation}
            destination={USER_B}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={0}
            optimizeWaypoints={true}
            onReady={result => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: 50,
                  bottom: 50,
                  left: 50,
                  top: 50,
                },
              });
            }}
          />
        </MapView>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
