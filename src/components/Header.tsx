import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

function Header(props: any) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => props.navigation.toggleDrawer()}>
        <Icon name="menu" size={25} color="black" />
      </TouchableOpacity>
      <View>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '95%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
  },
  icon: {
    position: 'absolute',
    left: 0,
  },
});

export default Header;
