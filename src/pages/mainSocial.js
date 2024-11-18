import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/navBar';
import Header from '../components/header';

const MainSocial = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [activeTag, setActiveTag] = useState('#전체'); // 활성화된 태그 상태
  const hashtags = ['#전체', '#음식', '#K-POP', '#핫플', '#질문', '#구인']; // 해시태그 리스트

  // 더미 데이터 (스크롤 영역)
  const data = [
    {
      id: '1',
      profileImage: 'https://via.placeholder.com/40',
      name: 'user1',
      flag: '🇰🇷',
      time: '5시간 전',
      contentImage: 'https://via.placeholder.com/300',
      text: '맛있는 음식 추천해주세요!',
      likes: 20,
      comments: 5,
    },
    {
      id: '2',
      profileImage: 'https://via.placeholder.com/40',
      name: 'user2',
      flag: '🇺🇸',
      time: '1시간 전',
      contentImage: 'https://via.placeholder.com/300',
      text: 'BTS 신곡 들어보셨나요?',
      likes: 50,
      comments: 15,
    },
  ];

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        setIsLoggedIn(true); // 로그인 상태
      } else {
        setIsLoggedIn(false); // 비로그인 상태
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header navigation={navigation} />

      {/* 해시태그 버튼 영역 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.hashtagScrollContainer}>
        {hashtags.map((tag, index) => (
          <Pressable
            key={tag}
            style={[
              styles.hashtagButton,
              activeTag === tag && styles.activeHashtagButton, // 활성화 스타일
              index === hashtags.length - 1 && styles.lastButtonMargin, // 마지막 버튼에만 스타일 추가
            ]}
            onPress={() => setActiveTag(tag)}>
            <Text
              style={[
                styles.hashtagText,
                activeTag === tag && styles.activeHashtagText,
              ]}>
              {tag}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 로그인 상태 메시지 */}
      <View style={styles.loginStatus}>
        {isLoggedIn ? (
          <Text style={styles.text}>상태 : 로그인o</Text>
        ) : (
          <Text style={styles.text}>상태 : 로그인x</Text>
        )}
      </View>

      {/* 스크롤 가능한 콘텐츠 */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            {/* 프로필 영역 */}
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: item.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.profileText}>
                <Text style={styles.name}>
                  {item.name} <Text style={styles.flag}>{item.flag}</Text>
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>

            {/* 콘텐츠 이미지 */}
            <View style={styles.contentImageContainer}>
              <Image
                source={{ uri: item.contentImage }}
                style={styles.contentImage}
              />
            </View>

            {/* 게시글 텍스트 */}
            <Text style={styles.postText}>{item.text}</Text>

            {/* 댓글 달기 */}
            <Pressable onPress={() => navigation.navigate('Feed')}>
              <Text style={styles.commentPlaceholder}>댓글 달기...</Text>
            </Pressable>
          </View>
        )}
      />

      {/* 하단 NavBar */}
      <NavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hashtagScrollContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 4, // 위아래 여백 추가
    minHeight: 40, // 최소 높이를 설정하여 너무 짧아지는 문제 해결
  },
  hashtagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  lastButtonMargin: {
    marginRight: 24, // 마지막 버튼에만 추가 여백
  },
  activeHashtagButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  hashtagText: {
    fontSize: 14,
    color: '#666',
  },
  activeHashtagText: {
    color: '#fff',
  },
  loginStatus: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  postContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profileText: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  flag: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  contentImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1, // 정사각형 비율
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  postText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  commentPlaceholder: {
    fontSize: 14,
    color: '#888',
  },
});

export default MainSocial;
