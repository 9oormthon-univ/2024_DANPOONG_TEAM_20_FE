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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/navBar';
import Header from '../components/header';
import OptionIcon from '../images/option.svg';

const {width, height} = Dimensions.get('window');

const MainEdu = ({navigation, route}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [activeTags, setActiveTags] = useState([]); // 활성화된 태그 배열
  const [posts, setPosts] = useState([]); // 게시글 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const hashtags = ['#언어', '#전공', '#질문', '#구인']; // 해시태그 리스트

  // 로그인 상태 확인
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

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');

      try {
        const response = await fetch(
          'https://mixmix2.store/api/feed/all?keyword=STUDYy&nationality=kr&page=0&size=10',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Posts:', data.data.feedListResDto);

          // 게시글 데이터 매핑
          const feedDataWithProfiles = data.data.feedListResDto.map(feed => ({
            ...feed,
            memberImage: feed.memberImage || 'https://via.placeholder.com/40', // 기본 이미지
            memberName: feed.memberName || '익명', // 기본 이름
          }));

          setPosts(feedDataWithProfiles || []);
        } else {
          console.error('Failed to fetch posts:', response.status);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 새로운 게시글 추가
  useEffect(() => {
    if (route.params?.newPost) {
      setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
    }
  }, [route.params?.newPost]);

  // 태그 토글 기능
  const toggleTag = tag => {
    setActiveTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(activeTag => activeTag !== tag)
        : [...prevTags, tag],
    );
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6152" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />

      {/* 해시태그 버튼 영역 */}
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

      {/* 게시글 목록 */}
      <FlatList
        data={posts}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>게시글이 없습니다.</Text>
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.postContainer}>
            {/* 프로필 영역 */}
            <View style={styles.profileContainer}>
              <View style={styles.profileInfo}>
                <Pressable
                  onPress={() => {
                    console.log(
                      'Navigating to OtherProfile with userId:',
                      item.memberId,
                    ); // 디버깅용
                    navigation.navigate('OtherProfile', {
                      userId: item.memberId,
                    });
                  }}>
                  <Image
                    source={{
                      uri: item.memberImage || 'https://via.placeholder.com/40',
                    }}
                    style={styles.profileImage}
                  />
                </Pressable>
                <View style={styles.profileText}>
                  <Text style={styles.name}>
                    {item.memberName || '익명'}{' '}
                    <Text style={styles.flag}>{item.flag || ''}</Text>
                  </Text>
                  <Text style={styles.time}>{item.createdAt || '방금 전'}</Text>
                </View>
              </View>
              <Pressable style={styles.optionButton}>
                <OptionIcon width={width * 0.05} height={width * 0.05} />
              </Pressable>
            </View>

            {/* 콘텐츠 이미지 */}
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

            {/* 게시글 텍스트 */}
            <Pressable
              onPress={() =>
                navigation.navigate('Feed', {feedId: item.feedId})
              }>
              <Text style={styles.postText}>{item.contents}</Text>
            </Pressable>

            {/* 댓글 달기 */}
            <Pressable
              onPress={() =>
                navigation.navigate('Feed', {feedId: item.feedId})
              }>
              <Text style={styles.commentPlaceholder}>댓글 달기...</Text>
            </Pressable>
          </View>
        )}
      />

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
    alignItems: 'center', // 세로 중앙 정렬
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

export default MainEdu;
