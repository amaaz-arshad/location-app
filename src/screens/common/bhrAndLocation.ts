import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserData} from '../../helpers/types';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import {
  getAddressFromCoords,
  getDistanceInMeters,
  showError,
} from '../../helpers/utils';
import {LatLng} from 'react-native-maps';
import {MIN_DISTANCE} from '../../helpers/constants';
import RNLocation from 'react-native-location';

export const getLocationAndData = async (
  user: FirebaseAuthTypes.User | null,
) => {
  if (user) {
    const mydata = await getUserData(user.uid);
    let prevCoords: LatLng | undefined;
    if (mydata.coords.latitude && mydata.coords.longitude) {
      prevCoords = mydata.coords;
    }
    if (mydata) {
      getCurrentLocation(user.uid, mydata, prevCoords);
    }
  }
};

export const getUserData = async (uid: string) => {
  const mydata = (await firestore().collection('users').doc(uid).get()).data();
  return mydata as UserData;
};

export const getCurrentLocation = (
  uid: string,
  mydata: UserData,
  prevCoords?: LatLng,
) => {
  console.log('getting current location');
  RNLocation.getLatestLocation({timeout: 60000})
    .then(async location => {
      try {
        if (location) {
          console.log('location:', location);
          const {latitude, longitude} = location;
          let distance;

          if (prevCoords) {
            distance = getDistanceInMeters(
              prevCoords.latitude,
              prevCoords.longitude,
              latitude,
              longitude,
            );
            console.log('distance:', distance);
          }

          if (!distance || distance > MIN_DISTANCE) {
            const address = await getAddressFromCoords(latitude, longitude);
            const timestamp = moment(location.timestamp).format();
            const date = moment(location.timestamp).format('YYYY-MM-DD');
            const locationHistory = mydata.locationHistory;

            if (!locationHistory[date]) {
              locationHistory[date] = [];
            }
            locationHistory[date].push({
              coords: {latitude, longitude},
              timestamp,
            });

            console.log('updating data in firestore');
            firestore()
              .collection('users')
              .doc(uid)
              .update({
                coords: {latitude, longitude},
                lastLocationUpdate: timestamp,
                locationHistory,
                address,
              })
              .then(() => {
                console.log('coords and data updated!');
              });
          } else {
            console.log('distance too small');
          }
        }
      } catch (error: any) {
        showError(error.message);
        console.error(error);
      }
    })
    .catch(error => {
      showError(error.message);
      console.log(error);
    });
};

export const getRealTimeData = (
  user: FirebaseAuthTypes.User | null,
  setMyData: React.Dispatch<React.SetStateAction<UserData | undefined>>,
  setUsersData: React.Dispatch<React.SetStateAction<UserData[] | undefined>>,
) => {
  if (user) {
    firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const alldata = querySnapshot.docs.map(doc => doc.data()) as UserData[];
        const mydata = alldata.find(item => item.uid === user.uid);
        const restdata = alldata.filter(item => item.uid !== user.uid);
        setMyData(mydata);
        setUsersData(restdata);
      });
  }
};
