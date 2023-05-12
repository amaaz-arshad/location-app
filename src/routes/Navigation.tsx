import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Logout from '../components/Logout';
// import {auth} from '../config/firebase';
import Bhr from '../screens/Bhr';
import ChooseLocation from '../screens/ChooseLocation';
import Login from '../screens/Login';
import Map from '../screens/Map';
import Range from '../screens/Range';
import Register from '../screens/Register';
import LocationHistory from '../screens/LocationHistory';
import {useAuthState} from 'react-firebase-hooks/auth';
import React, {useEffect} from 'react';
import useAuth from '../hooks/useAuth';
import AllLocations from '../screens/AllLocations';
import Header from '../components/Header';
import AllUsersData from '../screens/AllUsersData';
import auth from '@react-native-firebase/auth';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const BhrStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bhr"
        component={Bhr}
        options={{
          headerTitle: () => (
            <Header navigation={props.navigation} title="BHR" />
          ),
        }}
      />
      <Stack.Screen
        name="AllLocations"
        component={AllLocations}
        options={{headerTitleAlign: 'center', title: 'All Locations'}}
      />
      <Stack.Screen
        name="LocationHistory"
        component={LocationHistory}
        options={{headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="AllUsersData"
        component={AllUsersData}
        options={{headerTitleAlign: 'center', title: 'All Users Data'}}
      />
    </Stack.Navigator>
  );
};

const MapStack = (props: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          headerTitle: () => (
            <Header navigation={props.navigation} title="Map" />
          ),
        }}
      />
      <Drawer.Screen
        name="ChooseLocation"
        component={ChooseLocation}
        options={{title: 'Choose Location', headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
};

function Navigation() {
  //  const user = auth().currentUser;
  const user = useAuth();
  // const [user, loading] = useAuthState(auth);

  return user ? (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{headerShown: false}}>
        <Drawer.Screen
          name="BhrStack"
          component={BhrStack}
          options={{title: 'BHR'}}
        />
        {/* <Drawer.Screen
          name="MapStack"
          component={MapStack}
          options={{title: 'Map'}}
        />
        <Drawer.Screen
          name="Range"
          component={Range}
          options={{headerShown: true, headerTitleAlign: 'center'}}
        /> */}
        {user.email === 'admin@test.com' && (
          <Drawer.Screen name="Logout" component={Logout} />
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
