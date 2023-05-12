import {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {showError} from '../helpers/utils';
import {firebase} from '@react-native-firebase/firestore';
import FlashMessage from 'react-native-flash-message';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

export default function Logout() {
  useEffect(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        ReactNativeForegroundService.stopAll().then(() => {
          console.log('service stopped');
        });
      })
      .catch((err: any) => {
        showError(err.message);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Logging out...</Text>
      <FlashMessage position="top" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
