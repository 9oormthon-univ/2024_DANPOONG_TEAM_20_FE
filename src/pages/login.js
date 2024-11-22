import React, { useState } from 'react';
import { Pressable, View, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, getProfile } from '@react-native-seoul/kakao-login';
import LogoIconBig from '../images/logo_text_big.svg';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [result, setResult] = useState('');
  const navigation = useNavigation();

  // 로그인 처리
  const signInWithKakao = async () => {
    try {
      // 초기화 (저장된 모든 데이터 삭제)
      await AsyncStorage.removeItem('kakaoToken');
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userInfo');

      // 카카오 로그인
      const token = await login();
      console.log('로그인 성공, 토큰: ', token);
      setResult('로그인 성공, 토큰: ' + JSON.stringify(token));

      // 토큰 저장
      await AsyncStorage.setItem('kakaoToken', token.accessToken);

      // 사용자 프로필 정보 가져오기
      const userProfile = await getProfile();
      console.log('사용자 프로필:', userProfile);

      // 사용자 정보 저장
      const profileData = {
        email: userProfile.email || '',
        nickname: userProfile.nickname || '',
        profileImageUrl: userProfile.profileImageUrl || '',
        nation: 'kr',
        school: '구름대학교',
        introduction: '저희 동네친구 할래요?',
      };
      await AsyncStorage.setItem('userInfo', JSON.stringify(profileData));

      // 서버에서 accessToken과 refreshToken 받기
      const tokens = await getTokens(token.idToken);

      if (tokens) {
        await AsyncStorage.setItem('accessToken', tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
        setResult(
          `accessToken: ${tokens.accessToken}, refreshToken: ${tokens.refreshToken}`
        );

        // ProfileInfo 페이지로 프로필 데이터와 함께 이동
        navigation.navigate('ProfileInfo', { profileData });
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setResult('로그인 실패: ' + (err?.message || '알 수 없는 오류'));
      Alert.alert('로그인 실패', err?.message || '알 수 없는 오류');
    }
  };

  // 서버에서 accessToken과 refreshToken을 받아오는 함수
  const getTokens = async (idToken) => {
    try {
      const response = await fetch('https://mixmix2.store/api/kakao/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCode: idToken,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`서버 오류: ${errorBody.message || '알 수 없는 오류'}`);
      }

      const responseBody = await response.json();
      console.log('서버 응답:', responseBody);

      const { accessToken, refreshToken } = responseBody.data;

      if (!accessToken || !refreshToken) {
        throw new Error('access token / refresh token이 서버 응답에 없음');
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('API 호출 오류:', error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <LogoIconBig style={styles.logo} />
      <Pressable style={styles.loginButton} onPress={signInWithKakao}>
        <Image
          source={require('../images/kakao_login.png')}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 50,
    marginTop: 200,
    resizeMode: 'contain',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 130,
  },
});

export default Login;