import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainSocial from './pages/mainSocial';
import MainEdu from './pages/mainEdu';
import MyProfile from './pages/myProfile';
import Dm from './pages/dm';
import Camera from './pages/camera';
import Rank from './pages/rank';
import Login from './pages/login';
import Feed from './pages/feed';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 앱 시작 시 로그인 상태 확인
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!accessToken); // accessToken이 있으면 로그인 상태로 설정
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'MainSocial' : 'Login'}>
        <Stack.Screen
          name="MainSocial"
          component={MainSocial}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainEdu"
          component={MainEdu}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
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
