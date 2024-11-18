import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/navBar';

const MainSocial = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        setIsLoggedIn(true);  // 로그인 상태
      } else {
        setIsLoggedIn(false); // 로그인되지 않음
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isLoggedIn ? (
          <Text style={styles.text}>상태 : 로그인o</Text>
        ) : (
          <Text style={styles.text}>상태 : 로그인x</Text>
        )}

        {/* 로그인되지 않은 경우만 Login 화면으로 이동 */}
        {!isLoggedIn && (
          <Pressable
            style={styles.tempButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.tempButtonText}>Go to Login</Text>
          </Pressable>
        )}
      </View>

      {/* 하단 NavBar에 navigation 전달 */}
      <NavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tempButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  tempButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MainSocial;
