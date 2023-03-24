import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const Bhr = (props: any) => {
  return (
    <View style={styles.container}>
      <Button
        title="View all users"
        onPress={() => props.navigation.navigate('Location', {id: 1})}
      />
      <View style={{height: 20}} />
      <Button title="View User A" />
      <View style={{height: 20}} />
      <Button title="View User B" />
    </View>
  );
};

export default Bhr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
