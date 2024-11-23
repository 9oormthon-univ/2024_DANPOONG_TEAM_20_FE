import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import NavBar from '../components/navBar';
import Header from '../components/header';
import OptionIcon from '../images/option.svg';

const {width, height} = Dimensions.get('window');

// 날짜 형식 함수
const formatDate = dateString => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 맞춤
  const day = String(date.getDate()).padStart(2, '0'); // 일을 2자리로 맞춤
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 분을 2자리로 맞춤
  const ampm = hours >= 12 ? 'PM' : 'AM'; // AM/PM 결정

  // 12시간제로 변환
  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, '0') : '12'; // 0시를 12로 표시

  return `${month}.${day} ${hours}:${minutes}${ampm}`;
};

const MainSocial = ({navigation, route}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const hashtags = ['#음식', '#K-POP', '#핫플', '#질문', '#구인'];

  useFocusEffect(
    React.useCallback(() => {
      setActiveTags([]);
    }, []),
  );

  useEffect(() => {
    if (route.params?.newPost) {
      setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
    }
  }, [route.params?.newPost]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');

      try {
        const response = await fetch(
          'https://mixmix2.store/api/feed/all?keyword=SOCIAL&nationality=kr&page=0&size=10',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log('A:', data.data.feedListResDto);

          const feedDataWithProfiles = data.data.feedListResDto.map(feed => ({
            ...feed,
            memberImage: feed.memberImage || 'https://via.placeholder.com/40',
            memberName: feed.memberName || '익명',
          }));

          setPosts(feedDataWithProfiles || []);
        } else {
          console.error('API 호출 실패:', response.status);
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
      }
    };

    fetchPosts();
  }, []);

  const toggleTag = tag => {
    setActiveTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(activeTag => activeTag !== tag)
        : [...prevTags, tag],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />

      <View style={styles.hashtagWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hashtagScrollContent}>
          {hashtags.map(tag => (
            <Pressable
              key={tag}
              style={[
                styles.hashtagButton,
                activeTags.includes(tag) && styles.activeHashtagButton,
              ]}
              onPress={() => toggleTag(tag)}>
              <Text
                style={[
                  styles.hashtagText,
                  activeTags.includes(tag) && styles.activeHashtagText,
                ]}>
                {tag}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.postsContainer}>
        {posts.length === 0 ? (
          <Text style={styles.emptyMessage}>게시글이 없습니다.</Text>
        ) : (
          posts.map(item => (
            <View key={item.id} style={styles.postContainer}>
              <View style={styles.profileContainer}>
                <View style={styles.profileInfo}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('OtherProfile', {
                        memberId: item.memberId,
                      })
                    }>
                    <Image
                      source={{
                        uri: item.memberImage,
                      }}
                      style={styles.profileImage}
                    />
                  </Pressable>

                  <View style={styles.profileText}>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('OtherProfile', {
                          userId: item.userId,
                        })
                      }>
                      <Text style={styles.name}>
                        {item.memberName || '익명'}{' '}
                        <Text style={styles.flag}>{item.flag || ''}</Text>
                      </Text>
                    </Pressable>
                    <Text style={styles.time}>
                      {item.createdAt ? formatDate(item.createdAt) : '방금 전'}
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  navigation.navigate('Feed', {feedId: item.feedId})
                }>
                <View style={styles.contentImageContainer}>
                  <Image
                    source={{uri: item.feedImage}}
                    style={styles.contentImage}
                  />
                </View>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate('Feed', {feedId: item.feedId})
                }>
                <Text style={styles.postText}>{item.contents}</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate('Feed', {feedId: item.feedId})
                }>
                <Text style={styles.commentPlaceholder}>댓글 달기...</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <NavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hashtagWrapper: {
    marginVertical: height * 0.01,
  },
  hashtagScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  hashtagButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: width * 0.05,
    backgroundColor: '#fff',
    marginRight: width * 0.02,
  },
  activeHashtagButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  hashtagText: {
    fontSize: width * 0.04,
    color: '#666',
  },
  activeHashtagText: {
    color: '#fff',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: height * 0.02,
    color: '#888',
    fontSize: width * 0.04,
  },
  postContainer: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    marginRight: width * 0.03,
  },
  profileText: {
    justifyContent: 'center',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  flag: {
    fontSize: width * 0.035,
  },
  time: {
    fontSize: width * 0.035,
    color: '#888',
  },
  contentImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    marginBottom: height * 0.015,
    borderRadius: width * 0.02,
    overflow: 'hidden',
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  optionButton: {
    marginRight: width * 0.02,
  },
  postText: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: height * 0.01,
  },
  commentPlaceholder: {
    fontSize: width * 0.04,
    color: '#888',
  },
});

export default MainSocial;
