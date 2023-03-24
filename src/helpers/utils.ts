import {showMessage} from 'react-native-flash-message';
import {Dimensions, PermissionsAndroid, Platform} from 'react-native';
import {FIXED_LOCATION} from './constants';

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

export const deg2rad = (deg: number) => deg * (Math.PI / 180);

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

export const getDeltaValue = () => {
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  return {LATITUDE_DELTA, LONGITUDE_DELTA};
};
