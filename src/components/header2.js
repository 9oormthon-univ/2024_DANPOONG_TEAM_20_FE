import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // useNavigation 추가
import BackIcon from '../images/back.svg'; // 뒤로가기 아이콘
import NotificationIcon from '../images/notification.svg'; // 알림 아이콘

const Header2 = () => {
  const navigation = useNavigation(); // navigation 객체 가져오기
  const name = 'nanami'; // 임시로 표시할 이름

  return (
    <View style={styles.container}>
      {/* 뒤로가기 아이콘 */}
      <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
        <BackIcon width={24} height={24} />
      </Pressable>

      {/* 가운데 이름 */}
      <Text style={styles.name}>
        {name} <Text style={styles.flag}>🇯🇵</Text> {/* 국기 아이콘 */}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  flag: {
    fontSize: 16,
  },
});

export default Header2;
