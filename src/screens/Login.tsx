import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {showError} from '../helpers/utils';
import FlashMessage from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import auth from '@react-native-firebase/auth';

const Login = (props: any) => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const signin = () => {
    setIsLoading(true);
    console.log(data);
    if (!data.email || !data.password) {
      showError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(() => {
        console.log('User signed in!');
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
        <Button title="Login" onPress={signin} />
      </View>

      <TouchableOpacity onPress={() => props.navigation.replace('Register')}>
        <View style={{marginTop: 20}}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </View>
      </TouchableOpacity>

      <Spinner visible={isLoading} />
      <FlashMessage position="top" />
    </View>
  );
};

export default Login;

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
