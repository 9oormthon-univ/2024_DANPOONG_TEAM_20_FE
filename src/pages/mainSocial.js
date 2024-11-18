import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Pressable} from 'react-native';
import NavBar from '../components/navBar';
import Header from '../components/header'; // Header 추가

const MainSocial = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header 추가 */}
      <Header navigation={navigation} />

      <View style={styles.content}>
        <Text style={styles.text}>This is the MainSocial</Text>
        {/* Login.js로 이동하는 임시 버튼 */}
        <Pressable
          style={styles.tempButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.tempButtonText}>Go to Login</Text>
        </Pressable>
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
