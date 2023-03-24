import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_APIKEY} from '../helpers/constants';

const GooglePlacesInput = (props: any) => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={props.placeholder}
        onPress={(data, details) => {
          const {lat, lng} = details?.geometry.location ?? {};
          props.getAddressDetails(lat, lng);
        }}
        fetchDetails={true}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: 'en',
        }}
        styles={{
          textInput: styles.addressInput,
        }}
      />
    </View>
  );
};

export default GooglePlacesInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressInput: {
    backgroundColor: '#f3f3f3',
  },
});
