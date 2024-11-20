import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoIconBig from '../images/logo_text_big.svg';

const ProfileInfo = ({ route, navigation }) => {
  const { profileData } = route.params; // 카카오 프로필 데이터
  const [school, setSchool] = useState(profileData.school || ''); // 기존 school 데이터로 초기화
  const [country, setCountry] = useState(profileData.nation || ''); // 기존 nation 데이터로 초기화

  const handleSave = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('로그인이 필요합니다.');
      }
  
      // 서버로 추가 정보를 포함한 데이터 전송
      const response = await fetch('https://mixmix2.store/api/member/mypage/join', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          introduction: profileData.introduction || '',
          nationality: country,
          school: school,
          nickname: profileData.nickname,
        }),
      });
  
      // 상태 코드가 200이 아닌 경우
      if (!response.ok) {
        const errorBody = await response.json();
        console.error('서버 오류:', errorBody);  // 서버의 오류 내용을 확인
        throw new Error(`서버에 저장 실패: ${errorBody.message || '알 수 없는 오류'}`);
      }
  
      const responseBody = await response.json();
      console.log('프로필 저장 성공:', responseBody);
  
      Alert.alert('성공', '프로필 정보 저장완료.');
      navigation.replace('MainSocial'); // 저장 후 메인 화면으로 이동
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      Alert.alert('오류', error.message || '저장 중 오류');
    }
  };
  

  return (
    <View style={styles.container}>
        <LogoIconBig style={styles.logo}/>
        <View style={styles.inputContainer}>
            <Text style={styles.label}>학교명</Text>
            <TextInput 
            style={styles.input}
            placeholder="새로운 친구와 소통해봐요..."
            value={school}
            onChangeText={setSchool}
      />
      </View>

      <View style={styles.inputContainer}>
      <Text style={styles.label}>국가명</Text>
      <TextInput
        style={styles.input}
        placeholder="새로운 친구와 소통해봐요..."
        value={country}
        onChangeText={setCountry}
      />
      </View>
      <Pressable ressable onPress={() => navigation.navigate('MainSocial')}>
            <Text>임시</Text>
          </Pressable>

          {/* 수정 완료 버튼 */}
          <Pressable style={styles.editFin} onPress={handleSave}>
            <View style={styles.editFin2}>
            <Text style={styles.editFinText}>수정완료</Text>
            </View>
          </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    logo: {
        // alignItems: 'center',
        // justifyContent: "center",
        marginTop: 10,
        marginBottom: 60,
        transform: [{ scale: 0.8 }],
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  label: {
    textAlign: "left",
    marginBottom: 4,
    marginRight: 24,
    fontSize: 14,
    marginVertical: 10,
    fontFamily: "Pretendard-SemiBold",
    color: "#000",
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 283,
  },
  editFin: {
    width: 361,
    height: 52,
    backgroundColor: "#ff6152",
    borderRadius: 12,
    paddingHorizontal: 70,
    paddingVertical: 16,
    marginTop: "40%",
    marginHorizontal: 8,
},
editFin2: {
    position: "absolute",
    left: 155,
    top: 15,
},
editFinText: {
    fontFamily: "Pretendard-SemiBold",
    color: "#ffffff",
    fontSize: 16,
},
});

export default ProfileInfo;