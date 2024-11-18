import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainSocial from './pages/mainSocial';
import MainEdu from './pages/mainEdu'; // MainEdu 추가
import MyProfile from './pages/myProfile';
import Dm from './pages/dm';
import Camera from './pages/camera';
import Rank from './pages/rank';
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
          name="MainEdu"
          component={MainEdu} // MainEdu 추가
          options={{headerShown: false}} // 필요 시 false로 설정
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
