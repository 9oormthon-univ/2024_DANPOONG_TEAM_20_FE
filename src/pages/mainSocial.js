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

const MainSocial = ({navigation, route}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const [posts, setPosts] = useState([]); // API에서 가져온 게시글
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
          setPosts(data.data.feedListResDto || []);
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

      <FlatList
        data={posts}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>게시글이 없습니다.</Text>
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.postContainer}>
            <View style={styles.profileContainer}>
              <View style={styles.profileInfo}>
                {/* 프로필 이미지 클릭 시 이동 */}
                <Pressable
                  onPress={
                    () =>
                      navigation.navigate('OtherProfile', {userId: item.userId}) // userId를 전달
                  }>
                  <Image
                    source={{
                      uri:
                        item.profileImage || 'https://via.placeholder.com/40',
                    }}
                    style={styles.profileImage}
                  />
                </Pressable>

                <View style={styles.profileText}>
                  {/* 이름 클릭 시 이동 */}
                  <Pressable
                    onPress={
                      () =>
                        navigation.navigate('OtherProfile', {
                          userId: item.userId,
                        }) // userId를 전달
                    }>
                    <Text style={styles.name}>
                      {item.name || '익명'}{' '}
                      <Text style={styles.flag}>{item.flag || ''}</Text>
                    </Text>
                  </Pressable>
                  <Text style={styles.time}>{item.createdAt || '방금 전'}</Text>
                </View>
              </View>

              <Pressable style={styles.optionButton}>
                <OptionIcon width={width * 0.05} height={width * 0.05} />
              </Pressable>
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
