import {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/firestore';

export default function useAuth() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user as FirebaseAuthTypes.User);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return user;
}
