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
import NavBar from '../components/navBar';
import Header from '../components/header'; // Header 추가
import OptionIcon from '../images/option.svg'; // 더보기 아이콘

const {width, height} = Dimensions.get('window'); // 화면 크기 가져오기

const MainEdu = ({navigation, route}) => {
  const [activeTags, setActiveTags] = useState([]); // 활성화된 태그 배열
  const [posts, setPosts] = useState([]); // 게시글 데이터 상태
  const hashtags = ['#언어', '#전공', '#질문', '#구인']; // 해시태그 리스트

  // 상태를 AsyncStorage에 저장
  const saveActiveTags = async tags => {
    try {
      await AsyncStorage.setItem('eduActiveTags', JSON.stringify(tags));
    } catch (error) {
      console.error('태그 상태 저장 실패:', error);
    }
  };

  // AsyncStorage에서 상태 불러오기
  const loadActiveTags = async () => {
    try {
      const savedTags = await AsyncStorage.getItem('eduActiveTags');
      if (savedTags) {
        setActiveTags(JSON.parse(savedTags));
      }
    } catch (error) {
      console.error('태그 상태 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    loadActiveTags(); // 컴포넌트가 렌더링될 때 상태 불러오기
  }, []);

  // 새 게시글 추가
  useEffect(() => {
    if (route.params?.newPost) {
      setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
    }
  }, [route.params?.newPost]);

  const toggleTag = tag => {
    const updatedTags = activeTags.includes(tag)
      ? activeTags.filter(activeTag => activeTag !== tag) // 선택 해제
      : [...activeTags, tag]; // 선택 추가
    setActiveTags(updatedTags);
    saveActiveTags(updatedTags); // 상태 저장
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
                <Image
                  source={{
                    uri: item.profileImage || 'https://via.placeholder.com/40',
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.profileText}>
                  <Text style={styles.name}>
                    {item.name || '익명'}{' '}
                    <Text style={styles.flag}>{item.flag || ''}</Text>
                  </Text>
                  <Text style={styles.time}>{item.time || '방금 전'}</Text>
                </View>
              </View>
              <Pressable style={styles.optionButton}>
                <OptionIcon width={width * 0.05} height={width * 0.05} />
              </Pressable>
            </View>

            {/* 콘텐츠 이미지 */}
            <Pressable
              onPress={() => navigation.navigate('Feed', {post: item})}>
              <View style={styles.contentImageContainer}>
                <Image
                  source={{uri: item.contentImage}}
                  style={styles.contentImage}
                />
              </View>
            </Pressable>

            {/* 게시글 텍스트 */}
            <Pressable
              onPress={() => navigation.navigate('Feed', {post: item})}>
              <Text style={styles.postText}>{item.text}</Text>
            </Pressable>

            {/* 댓글 달기 */}
            <Pressable
              onPress={() => navigation.navigate('Feed', {post: item})}>
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
