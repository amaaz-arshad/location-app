import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Bhr from '../screens/Bhr';
import ChooseLocation from '../screens/ChooseLocation';
import Location from '../screens/Location';
import Map from '../screens/Map';
import Range from '../screens/Range';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const BhrStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bhr"
        component={Bhr}
        options={{title: 'BHR', headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="Location"
        component={Location}
        options={{headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
};

const MapStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={Map}
        options={{headerTitleAlign: 'center'}}
      />
      <Drawer.Screen
        name="ChooseLocation"
        component={ChooseLocation}
        options={{title: 'Choose Location', headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
};

function Navigation(): JSX.Element {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="BhrStack"
          component={BhrStack}
          options={{headerShown: false, title: 'BHR'}}
        />
        <Drawer.Screen
          name="MapStack"
          component={MapStack}
          options={{headerShown: false, title: 'Map'}}
        />
        <Drawer.Screen name="Range" component={Range} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
