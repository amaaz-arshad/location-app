import {Button, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {LatLng, MapMarker, Marker} from 'react-native-maps';
import {fitAllCoordinates, getDeltaValue, onRecenter} from '../helpers/utils';
import {History, UserData} from '../helpers/types';
import {COLORS, LATITUDE_DELTA, LONGITUDE_DELTA} from '../helpers/constants';
import firestore from '@react-native-firebase/firestore';
import MapViewDirections from 'react-native-maps-directions';
import {ActivityIndicator} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MyLocationIcon from 'react-native-vector-icons/MaterialIcons';
import LocateIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {GOOGLE_MAPS_API_KEY} from '@env';
import auth from '@react-native-firebase/auth';

export default function LocationHistory(props: any) {
  const user = props.route.params.user as UserData;
  const [userData, setUserData] = useState(user);
  const [startLocation, setStartLocation] = useState<History>();
  const [lastLocation, setLastLocation] = useState<History>();
  const [morePoints, setMorePoints] = useState<History[]>();
  const mapRef = useRef<MapView>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(
    moment().format('yyyy-MM-DD'),
  );
  const [mapViewCoords, setMapViewCoords] = useState<LatLng[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    props.navigation.setOptions({
      title: user.name,
    });
  }, []);

  useEffect(() => {
    getUpdatedData(user.uid);
  }, [formattedDate]);

  const getUpdatedData = (uid: string) => {
    firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(querySnapshot => {
        // console.log('user data: ', querySnapshot.data());
        const data = querySnapshot.data() as UserData;
        console.log('date: ', formattedDate);
        const history = data.locationHistory[formattedDate];
        if (history && history.length > 0) {
          const end = history[history.length - 1];
          setLastLocation(end);
          if (history.length > 1) {
            const start = history[0];
            setStartLocation(start);
            if (history.length > 2) {
              const morePoints = history.slice(1, -1);
              setMorePoints(morePoints);
            }
          }
        }
        setUserData(data);
        setIsLoading(false);
      });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setSelectedDate(date);
    setFormattedDate(moment(date).format('yyyy-MM-DD'));
    setStartLocation(undefined);
    setMorePoints(undefined);
    hideDatePicker();
  };

  return lastLocation || userData ? (
    <>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate}
      />
      <View style={{flex: 0.05}}>
        <Button title={formattedDate} onPress={showDatePicker} />
      </View>
      <View style={{flex: 0.95}}>
        <MapView
          style={StyleSheet.absoluteFill}
          ref={mapRef}
          initialRegion={{
            ...(lastLocation?.coords || userData.coords),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {lastLocation ? (
            <Marker
              coordinate={lastLocation.coords}
              pinColor={COLORS.primary}
              // image={{uri: '../assets/pointer.PNG'}}
              title={`${lastLocation.coords.latitude}, ${lastLocation.coords.longitude}`}
              description={`Timestamp: ${lastLocation.timestamp}`}
            />
          ) : (
            <Marker
              coordinate={userData.coords}
              pinColor={COLORS.primary}
              // image={{uri: '../assets/pointer.PNG'}}
              title={`${userData.coords.latitude}, ${userData.coords.longitude}`}
              description={`Timestamp: ${userData.lastLocationUpdate}`}
            />
          )}

          {startLocation && (
            <Marker
              coordinate={startLocation.coords}
              title={`${startLocation.coords.latitude}, ${startLocation.coords.longitude}`}
              description={`Timestamp: ${startLocation.timestamp}`}
            />
          )}

          {morePoints?.map((point, index) => (
            <Marker
              key={index}
              coordinate={point.coords}
              pinColor={COLORS.green}
              title={`${point.coords.latitude}, ${point.coords.longitude}`}
              description={`Timestamp: ${point.timestamp}`}
            />
          ))}

          {startLocation && (
            <MapViewDirections
              origin={startLocation.coords}
              destination={lastLocation?.coords || userData.coords}
              waypoints={morePoints && morePoints.map(point => point.coords)}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor="red"
              // optimizeWaypoints={true}
              onReady={result => {
                setMapViewCoords(result.coordinates);
                fitAllCoordinates(mapRef, result.coordinates);
              }}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={styles.recenter}
          onPress={() =>
            onRecenter(mapRef, lastLocation?.coords || userData.coords)
          }>
          <View style={styles.relocater}>
            <MyLocationIcon name="my-location" size={25} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewAll}
          onPress={() => fitAllCoordinates(mapRef, mapViewCoords)}>
          <View style={styles.relocater}>
            <LocateIcon name="locate" size={25} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </>
  ) : (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

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
    padding: 5,
    borderRadius: 3,
    elevation: 3,
  },
  viewAll: {
    position: 'absolute',
    top: 70,
    right: 15,
  },
});
