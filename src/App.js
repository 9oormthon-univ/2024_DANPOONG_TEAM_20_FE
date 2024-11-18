import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainSocial from './pages/mainSocial';
import MyProfile from './pages/myProfile';
import Dm from './pages/dm'; // Dm.js 임포트
import Camera from './pages/camera'; // Camera.js 임포트
import Rank from './pages/rank'; // Rank.js 임포트
import Login from './pages/login';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainSocial">
        <Stack.Screen
          name="MainSocial"
          component={MainSocial}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{title: 'My Profile'}}
        />
        <Stack.Screen
          name="Dm"
          component={Dm}
          options={{title: 'Direct Messages'}}
        />
        <Stack.Screen
          name="Camera"
          component={Camera}
          options={{title: 'Camera'}}
        />
        <Stack.Screen
          name="Rank"
          component={Rank}
          options={{title: 'Ranking'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
