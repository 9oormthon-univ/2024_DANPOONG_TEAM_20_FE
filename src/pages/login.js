import React, {useState} from 'react';
import {Pressable, View, Image, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '@react-native-seoul/kakao-login';

const Login = ({navigation}) => {
  const [result, setResult] = useState('');

  // 서버에서 accessToken과 refreshToken을 받아오는 함수
  const getTokens = async idToken => {
    try {
      const response = await fetch('https://mixmix2.store/api/kakao/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCode: idToken, // 카카오 로그인 후 받은 idToken을 전송
        }),
      });

      // 서버 응답이 성공적이지 않은 경우
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`서버 오류: ${errorBody.message || '알 수 없는 오류'}`);
      }

      // 서버에서 반환된 응답을 JSON으로 파싱
      const responseBody = await response.json();
      console.log('서버 응답:', responseBody); // 서버 응답 출력

      // 서버 응답에서 accessToken과 refreshToken을 추출
      const {accessToken, refreshToken} = responseBody.data;

      if (!accessToken || !refreshToken) {
        throw new Error(
          'access token 또는 refresh token이 서버 응답에 포함되지 않았습니다.',
        );
      }

      // accessToken과 refreshToken 반환
      return {accessToken, refreshToken};
    } catch (error) {
      console.error('API 호출 오류:', error);
      throw error;
    }
  };
  const getIdToken = async accessToken => {
    try {
      const response = await fetch(
        'https://mixmix2.store/api/oauth2/callback/kakao',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`, // accessToken을 Authorization 헤더에 포함
          },
        },
      );

      if (!response.ok) {
        throw new Error('idToken을 가져오는데 실패했습니다.');
      }

      const {idToken} = await response.json(); // 서버에서 반환한 idToken을 파싱
      console.log('idToken:', idToken);
      return idToken; // 받은 idToken을 반환
    } catch (error) {
      console.error('idToken 요청 오류:', error);
      throw error;
    }
  };

  const signInWithKakao = async () => {
    try {
      const token = await login(); // 카카오 로그인
      console.log('로그인 성공, 토큰: ', token);
      setResult(JSON.stringify(token)); // 결과 출력
      await AsyncStorage.setItem('kakaoToken', token.accessToken); // accessToken 저장

      // idToken을 사용하여 서버에서 accessToken과 refreshToken 받기
      const tokens = await getTokens(token.idToken);

      // AsyncStorage에 accessToken, refreshToken 저장
      if (tokens) {
        await AsyncStorage.setItem('accessToken', tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
        setResult(
          `accessToken: ${tokens.accessToken}, refreshToken: ${tokens.refreshToken}`,
        );
      }

      navigation.replace('MainSocial'); // 로그인 후 MainSocial 화면으로 이동
    } catch (err) {
      console.error('로그인 오류:', err);
      setResult('로그인 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인 페이지</Text>
      <Pressable style={styles.loginButton} onPress={signInWithKakao}>
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
        <Text>{result}</Text>
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
