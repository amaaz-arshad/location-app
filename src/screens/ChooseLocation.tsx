import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import GooglePlacesInput from '../components/GooglePlacesInput';
import {ScrollView} from 'react-native-gesture-handler';
import {showError} from '../helpers/utils';
import FlashMessage from 'react-native-flash-message';
import {LatLng} from 'react-native-maps';

function ChooseLocation(props: any) {
  const {origin, isCurrentLocation} = props.route.params;
  const [pickupCoordinates, setPickupCoordinates] = useState<LatLng>(
    isCurrentLocation && {
      latitude: origin.latitude,
      longitude: origin.longitude,
    },
  );
  const [destinationCoordinates, setDestinationCoordinates] =
    useState<LatLng>();

  const getPickupDetails = (latitude: number, longitude: number) => {
    setPickupCoordinates({latitude, longitude});
  };
  const getDestinationDetails = (latitude: number, longitude: number) => {
    setDestinationCoordinates({latitude, longitude});
  };

  const isValid = () => {
    if (!pickupCoordinates) {
      showError('Please enter a pickup location');
      return false;
    }
    if (!destinationCoordinates) {
      showError('Please enter a destination location');
      return false;
    }
    return true;
  };

  const onSearch = () => {
    if (isValid()) {
      props.route.params.getCoordinates(
        pickupCoordinates,
        destinationCoordinates,
      );
      props.navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        {!isCurrentLocation && (
          <GooglePlacesInput
            placeholder="Enter pickup location"
            getAddressDetails={getPickupDetails}
          />
        )}
        <GooglePlacesInput
          placeholder="Enter destination location"
          getAddressDetails={getDestinationDetails}
        />
        <View style={{height: 10}} />
        <Button title="Search" onPress={onSearch} />
      </ScrollView>
      <FlashMessage position="top" />
    </View>
  );
}

export default ChooseLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
});
