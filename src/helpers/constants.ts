import {getDeltaValue} from './utils';

export const START_TIME = '10:00:00';
export const END_TIME = '17:00:00';
export const TIME_INTERVAL = 120000; // in milliseconds
export const MIN_DISTANCE = 50; // in meters
export const LATITUDE_DELTA = 0.02;
export const LONGITUDE_DELTA = getDeltaValue(LATITUDE_DELTA);
export const FIXED_LOCATION = {
  latitude: 24.8620431,
  longitude: 67.070827,
  radius: 15, // in meters
};
export const DEFAULT_LOCATION = {
  latitude: 24.943701061460356,
  longitude: 67.04720402570186,
};
export const USER_A = {
  latitude: 24.937685012379387,
  longitude: 67.04451799686564,
};
export const USER_B = {
  latitude: 24.81098022074855,
  longitude: 67.01133677306831,
};
export const USER_C = {
  latitude: 24.920494073910263,
  longitude: 67.05744987293228,
};
export const COLORS = {
  primary: '#1e88e5',
  green: 'green',
  background: '#f5f5f5',
};
export const GEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json';
