import {LatLng} from 'react-native-maps';

export interface ILocation {
  longitude?: number;
  latitude?: number;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: string;
  coords: LatLng;
  address: string;
  lastLocationUpdate: string;
  locationHistory: {
    [key: string]: History[];
  };
}

export interface History {
  coords: LatLng;
  timestamp: string;
}
