import {Button, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
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
  GOOGLE_MAPS_APIKEY,
} from '../helpers/constants';
import {getDeltaValue} from '../helpers/utils';
import Geolocation from 'react-native-geolocation-service';

const {LATITUDE_DELTA, LONGITUDE_DELTA} = getDeltaValue();

const Map = (props: any) => {
  const [origin, setOrigin] = useState<LatLng>();
  const [destination, setDestination] = useState<LatLng>();
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [coordinates, setCoordinates] = useState(new AnimatedRegion());
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>();

  useEffect(() => {
    console.log('getting location');
    const id = Geolocation.watchPosition(
      position => {
        console.log(position);
        const {latitude, longitude} = position.coords;
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

  const getLiveLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setOrigin(position.coords);
        setIsCurrentLocation(true);
      },
      error => {
        setOrigin(DEFAULT_LOCATION);
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getCoordinates = (
    pickupCoordinates: any,
    destinationCoordinates: any,
  ) => {
    setOrigin(pickupCoordinates);
    setDestination(destinationCoordinates);
  };

  const animate = (newCoords: LatLng) => {
    if (markerRef.current) {
      markerRef.current.animateMarkerToCoordinate(newCoords, 4000);
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
                  pinColor={COLORS.primary}
                />
              )}
              {destination && (
                <>
                  <Marker coordinate={destination} title="destination" />
                  <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="red"
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
                </>
              )}
            </MapView>
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
});
