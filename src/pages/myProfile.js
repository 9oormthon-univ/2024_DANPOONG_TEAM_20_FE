import React from 'react';
import { SafeAreaView, StyleSheet, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/navBar';

const MyProfile = ({ navigation }) => {
  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      // 저장된 토큰 삭제
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      
      // 로그인 화면으로 이동
      navigation.replace('Login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>This is My Profile Page</Text>
      
      {/* 로그아웃 버튼 */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
      
      {/* NavBar */}
      <NavBar navigation={navigation} style={styles.navBar} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', //navBar 고정용
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginTop: 20,
  },
  logoutButton: {
    alignSelf: 'center', 
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default MyProfile;