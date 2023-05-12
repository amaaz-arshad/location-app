import {
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {
  AnimatedRegion,
  LatLng,
  MapMarker,
  Marker,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  COLORS,
  DEFAULT_LOCATION,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../helpers/constants';
import {fitAllCoordinates, getDeltaValue, onRecenter} from '../helpers/utils';
import Geolocation from 'react-native-geolocation-service';
import MyLocationIcon from 'react-native-vector-icons/MaterialIcons';
import {Image} from 'react-native';
import {GOOGLE_MAPS_API_KEY} from '@env';

const Map = (props: any) => {
  const [origin, setOrigin] = useState<LatLng>();
  const [destination, setDestination] = useState<LatLng>();
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [coordinates, setCoordinates] = useState(new AnimatedRegion());
  const [heading, setHeading] = useState<number>(0);
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>();

  useEffect(() => {
    // console.log('getting location');
    // getLiveLocation();
    console.log('watching for location changes');
    const id = Geolocation.watchPosition(
      position => {
        console.log(position);
        const {latitude, longitude, heading} = position.coords;
        animate({latitude, longitude});
        setOrigin({latitude, longitude});
        setCoordinates(
          new AnimatedRegion({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        );
        setIsCurrentLocation(true);
        console.log('heading:', position.coords.heading);
        setHeading(heading as number);
      },
      error => {
        setOrigin(DEFAULT_LOCATION);
        setCoordinates(
          new AnimatedRegion({
            ...DEFAULT_LOCATION,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        );
        console.log(error);
      },
      {enableHighAccuracy: true},
    );
    return () => Geolocation.clearWatch(id);
  }, []);

  // const getLiveLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       // console.log(position);
  //       const {latitude, longitude, heading} = position.coords;
  //       animate({latitude, longitude});
  //       setOrigin({latitude, longitude});
  //       setCoordinates(
  //         new AnimatedRegion({
  //           latitude,
  //           longitude,
  //           latitudeDelta: LATITUDE_DELTA,
  //           longitudeDelta: LONGITUDE_DELTA,
  //         }),
  //       );
  //       setIsCurrentLocation(true);
  //     },
  //     error => {
  //       setOrigin(DEFAULT_LOCATION);
  //       setCoordinates(
  //         new AnimatedRegion({
  //           ...DEFAULT_LOCATION,
  //           latitudeDelta: LATITUDE_DELTA,
  //           longitudeDelta: LONGITUDE_DELTA,
  //         }),
  //       );
  //       console.log(error);
  //     },
  //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //   );
  // };

  const getCoordinates = (
    pickupCoordinates: any,
    destinationCoordinates: any,
  ) => {
    setOrigin(pickupCoordinates);
    setDestination(destinationCoordinates);
  };

  const animate = (newCoords: LatLng) => {
    if (markerRef.current) {
      markerRef.current.animateMarkerToCoordinate(newCoords, 5000);
    }
  };

  return (
    <>
      {origin ? (
        <>
          <View style={{flex: 0.95}}>
            <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={{
                ...origin,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              ref={mapRef}>
              {(isCurrentLocation || destination) && (
                <Marker.Animated
                  ref={markerRef}
                  title="current"
                  // @ts-ignore
                  coordinate={coordinates}
                  // pinColor={COLORS.primary}
                >
                  <Image
                    source={require('../assets/current.png')}
                    style={{
                      width: 20,
                      height: 20,
                      transform: [{rotate: `${heading}deg`}],
                    }}
                    resizeMode="contain"
                  />
                </Marker.Animated>
              )}
              {destination && (
                <>
                  <Marker coordinate={destination} title="destination" />
                  <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_API_KEY}
                    strokeWidth={3}
                    strokeColor="red"
                    // optimizeWaypoints={true}
                    onReady={result => {
                      fitAllCoordinates(mapRef, result.coordinates);
                    }}
                  />
                </>
              )}
            </MapView>
            <TouchableOpacity
              style={styles.recenter}
              onPress={() => onRecenter(mapRef, origin)}>
              <View style={styles.relocater}>
                <MyLocationIcon name="my-location" size={25} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.05}}>
            <Button
              title="Choose Location"
              onPress={() =>
                props.navigation.navigate('ChooseLocation', {
                  getCoordinates,
                  isCurrentLocation,
                  origin,
                })
              }
            />
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recenter: {
    position: 'absolute',
    top: 20,
    right: 15,
  },
  relocater: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 3,
    elevation: 3,
  },
});
