import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // useNavigation 추가

const Header2 = () => {
  const navigation = useNavigation(); // navigation 객체 가져오기

  return (
    <View style={styles.container}>
      {/* 가운데 이름 */}
      <Text style={styles.mypageText}>
        마이페이지
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iconButton: {
    padding: 8,
  },
  mypageText: {
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    color: '#000',
  },
  flag: {
    fontSize: 16,
  },
});

export default Header2;
