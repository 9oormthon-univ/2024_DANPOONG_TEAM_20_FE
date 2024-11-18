import React from 'react';
import {Pressable, View, Image, StyleSheet, Text} from 'react-native';

const Login = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인 페이지</Text>
      <Pressable style={styles.loginButton}>
        <Image
          source={require('../images/kakao_login.png')}
          style={styles.image}
        />
      </Pressable>
      {/* 임시 버튼: MainSocial로 이동 */}
      <Pressable
        style={[styles.loginButton, styles.tempButton]}
        onPress={() => navigation.navigate('MainSocial')}>
        <Text style={styles.tempButtonText}>임시로 MainSocial 보기</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 50,
    resizeMode: 'contain',
  },
  tempButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  tempButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
