import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {showError} from '../helpers/utils';
import FlashMessage from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Register = (props: any) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const signup = async () => {
    setIsLoading(true);
    console.log(data);
    const {name, email, password} = data;
    if (!email || !password || !name) {
      showError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(result => {
        console.log('User account created & signed in!');
        result.user.updateProfile({
          displayName: name,
        });
        firestore()
          .collection('users')
          .doc(result.user.uid)
          .set({
            uid: result.user.uid,
            name,
            email,
            role: email === 'admin@test.com' ? 'admin' : 'user',
            coords: {
              latitude: null,
              longitude: null,
            },
            lastLocationUpdate: null,
            address: '',
            locationHistory: {},
          })
          .then(() => {
            console.log('User added!');
          });
      })
      .catch(error => {
        showError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={text => setData({...data, name: text})}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={text => setData({...data, email: text})}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={text => setData({...data, password: text})}
      />

      <View style={styles.btn}>
        {isLoading ? (
          <Button title="Register" disabled />
        ) : (
          <Button title="Register" onPress={signup} />
        )}
      </View>

      <TouchableOpacity onPress={() => props.navigation.replace('Login')}>
        <View style={{marginTop: 20}}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </View>
      </TouchableOpacity>

      <Spinner visible={isLoading} />
      <FlashMessage position="top" />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
  },
  btn: {
    marginTop: 20,
    width: '100%',
  },
  link: {
    color: 'blue',
  },
});
