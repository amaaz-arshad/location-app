import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {LatLng, Marker, Region} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {
  COLORS,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  TIME_INTERVAL,
} from '../helpers/constants';
import MapViewDirections from 'react-native-maps-directions';
import {UserData} from '../helpers/types';
import firestore from '@react-native-firebase/firestore';
import {GOOGLE_MAPS_API_KEY} from '@env';
import auth from '@react-native-firebase/auth';
import MyLocationIcon from 'react-native-vector-icons/MaterialIcons';
import LocateIcon from 'react-native-vector-icons/Ionicons';
import {fitAllCoordinates, onRecenter} from '../helpers/utils';
import moment from 'moment';
import {getLocationAndData, getRealTimeData} from './common/bhrAndLocation';

const AllLocations = () => {
  const [myData, setMyData] = useState<UserData>();
  const [usersData, setUsersData] = useState<UserData[]>();
  const [mapViewCoords, setMapViewCoords] = useState<LatLng[]>([]);
  const mapRef = useRef<MapView>(null);
  const user = auth().currentUser;

  useEffect(() => {
    getRealTimeData(user, setMyData, setUsersData);
  }, []);

  return myData && usersData ? (
    <>
      <MapView
        style={StyleSheet.absoluteFill}
        ref={mapRef}
        initialRegion={{
          ...myData.coords,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}>
        <Marker
          coordinate={myData.coords}
          pinColor={COLORS.primary}
          title="Me"
          description={`Last Location at: ${myData.lastLocationUpdate}`}
        />

        {usersData?.map((user: UserData) => (
          <Marker
            key={user.uid}
            coordinate={user.coords}
            title={user.name}
            description={`Last Location at: ${user.lastLocationUpdate}`}
          />
        ))}
        <MapViewDirections
          waypoints={usersData
            ?.filter((user, index) => index)
            .map((user: UserData) => user.coords)}
          origin={myData.coords}
          destination={usersData?.[0]?.coords}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={0}
          // optimizeWaypoints={true}
          onReady={result => {
            setMapViewCoords(result.coordinates);
            fitAllCoordinates(mapRef, result.coordinates);
          }}
        />
      </MapView>
      <TouchableOpacity
        style={styles.viewAll}
        onPress={() => fitAllCoordinates(mapRef, mapViewCoords)}>
        <View style={styles.relocater}>
          <LocateIcon name="locate" size={25} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.recenter}
        onPress={() => onRecenter(mapRef, myData.coords)}>
        <View style={styles.relocater}>
          <MyLocationIcon name="my-location" size={25} color="black" />
        </View>
      </TouchableOpacity>
    </>
  ) : (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default AllLocations;

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
  viewAll: {
    position: 'absolute',
    top: 70,
    right: 15,
  },
});
