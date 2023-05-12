import {showMessage} from 'react-native-flash-message';
import {Dimensions, PermissionsAndroid, Platform} from 'react-native';
import {
  FIXED_LOCATION,
  GEOCODE_API,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from './constants';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import {UserData} from './types';
import MapView, {LatLng} from 'react-native-maps';
import {RefObject} from 'react';
import axios from 'axios';
import {GOOGLE_MAPS_API_KEY} from '@env';
import moment from 'moment';

export const getDistanceInMeters = (
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

const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const isInRange = (distance: number) => {
  return distance <= FIXED_LOCATION.radius;
};

export const showError = (message: string) => {
  showMessage({
    message,
    type: 'danger',
    icon: 'danger',
  });
};

export const getLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const requestPermission = async () => {
  const backgroundgranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    {
      title: 'Background Location Permission',
      message:
        'We need access to your location ' +
        'so you can get live quality updates.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('background location permission granted');
  }
};

export const getDeltaValue = (latDelta: number) => {
  const screen = Dimensions.get('window');
  const aspectRatio = screen.width / screen.height;
  const longDelta = latDelta * aspectRatio;
  return longDelta;
};

export const fitAllCoordinates = (
  mapRef: RefObject<MapView>,
  mapViewCoords: LatLng[],
) => {
  mapRef.current?.fitToCoordinates(mapViewCoords, {
    edgePadding: {
      right: 30,
      bottom: 50,
      left: 30,
      top: 50,
    },
  });
};

export const onRecenter = (mapRef: RefObject<MapView>, coords?: LatLng) => {
  if (coords) {
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  }
};

export const getAddressFromCoords = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    let a = new Date().getTime();
    const response = await axios.get(
      `${GEOCODE_API}?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    );
    let b = new Date().getTime();
    console.log('axios address response time:', b - a);
    return response.data.results[0].formatted_address;
  } catch (error: any) {
    console.log('error:', error);
    showError(error.message);
    return '';
  }
};
