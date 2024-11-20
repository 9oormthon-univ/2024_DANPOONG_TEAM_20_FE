import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // useNavigation 추가
import BackIcon from '../images/back.svg'; // 뒤로가기 아이콘
import NotificationIcon from '../images/notification.svg'; // 알림 아이콘
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header2 = () => {
  const navigation = useNavigation(); // navigation 객체 가져오기
  const name = 'nanami'; // 임시로 표시할 이름
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 프로필 편집 여부 상태

  useEffect(() => {
    loadUserInfo();
  }, []);
  const handleProfileEdit = () => {
    setIsEditing(true); // 프로필 편집 화면으로 전환
  };

  // 사용자 정보 불러오기
  const loadUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 아이콘 */}
      <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
        <BackIcon width={24} height={24} />
      </Pressable>

      {/* 가운데 이름 */}
      <Text style={styles.name}>
      {userInfo?.nickname || "사용자"} <Text style={styles.flag}>{userInfo?.nation || "🇰🇷" }</Text> 
      </Text>

      {/* 알림 아이콘 */}
      <Pressable style={styles.iconButton}>
        <NotificationIcon width={24} height={24} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iconButton: {
    padding: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    // fontWeight: 'bold',
    color: '#000',
  },
  flag: {
    fontSize: 16,
  },
});

export default Header2;
