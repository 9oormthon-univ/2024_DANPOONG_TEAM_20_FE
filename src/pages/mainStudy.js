import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import NavBar from '../components/navBar';
import Header from '../components/header';

// 로컬 이미지 불러오기
const dummy1 = require('../images/dummy1.png');
const dummy2 = require('../images/dummy2.png');
const dummy3 = require('../images/dummy3.png');
const dummy4 = require('../images/dummy4.png');
const dummy_profile1 = require('../images/dummy_profile1.jpg');
const dummy_profile2 = require('../images/dummy_profile2.jpg');
const dummy_profile3 = require('../images/dummy_profile3.jpg');
const dummy_profile4 = require('../images/dummy_profile4.jpg');

const {width, height} = Dimensions.get('window');

// 날짜 형식 함수
const formatDate = dateString => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, '0') : '12';

  return `${month}월 ${day}일 ${hours}:${minutes}${ampm}`;
};

const MainStudy = ({navigation, route}) => {
  const [posts, setPosts] = useState([
    {
      id: '1',
      memberImage: dummy_profile3,
      memberName: '최도현',
      createdAt: '2024-11-24T10:00:00Z',
      feedImage: dummy1,
      contents: '타입스크립트 재밌당',
      hashTags: ['#언어'],
    },
    {
      id: '2',
      memberImage: dummy_profile2,
      memberName: 'Jamie',
      createdAt: '2024-11-23T14:00:00Z',
      feedImage: dummy2,
      contents: 'Working on a writing assignment',
      hashTags: ['#전공'],
    },
    {
      id: '3',
      memberImage: dummy_profile1,
      memberName: '김지원',
      createdAt: '2024-11-22T16:00:00Z',
      feedImage: dummy3,
      contents: '대수2 질문 받아주실분 구해요ㅠㅠ',
      hashTags: ['#질문', '#구인'],
    },
    {
      id: '4',
      memberImage: dummy_profile4,
      memberName: 'Kevin',
      createdAt: '2024-11-21T18:00:00Z',
      feedImage: dummy4,
      contents: '대학영어 공부 팁 공유합니다~',
      hashTags: ['#언어'],
    },
  ]);
  const [filteredPosts, setFilteredPosts] = useState(posts); // 필터링된 게시글 상태
  const [activeTags, setActiveTags] = useState([]);
  const hashtags = ['#언어', '#전공', '#질문', '#구인']; // STUDY 해시태그

  useEffect(() => {
    if (route.params?.newPost) {
      setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
    }
  }, [route.params?.newPost]);

  // 해시태그 버튼 클릭 시 태그 활성화/비활성화
  const toggleTag = tag => {
    setActiveTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(activeTag => activeTag !== tag)
        : [...prevTags, tag],
    );
  };

  // activeTags 상태가 변경될 때 게시글 필터링
  useEffect(() => {
    if (activeTags.length === 0) {
      setFilteredPosts(posts); // 선택된 태그가 없으면 전체 게시글 표시
    } else {
      setFilteredPosts(
        posts.filter(post =>
          activeTags.some(tag => post.hashTags && post.hashTags.includes(tag)),
        ),
      );
    }
  }, [activeTags, posts]);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />

      {/* 해시태그 버튼 */}
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

      {/* 게시글 리스트 */}
      <ScrollView contentContainerStyle={styles.postsContainer}>
        {filteredPosts.length === 0 ? (
          <Text style={styles.emptyMessage}>
            해당 해시태그에 해당하는 게시글이 없습니다.
          </Text>
        ) : (
          filteredPosts.map(item => (
            <View key={item.id} style={styles.postContainer}>
              <View style={styles.profileContainer}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('OtherProfile', {
                      memberId: item.memberId,
                    })
                  }>
                  <Image
                    source={item.memberImage}
                    style={styles.profileImage}
                  />
                </Pressable>
                <View style={styles.profileText}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('OtherProfile', {
                        memberId: item.memberId,
                      })
                    }>
                    <Text style={styles.name}>{item.memberName || '익명'}</Text>
                  </Pressable>
                  <Text style={styles.time}>
                    {item.createdAt ? formatDate(item.createdAt) : '방금 전'}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() =>
                  navigation.navigate('Feed', {feedId: item.feedId})
                }>
                <Image source={item.feedImage} style={styles.contentImage} />
              </Pressable>
              <Text style={styles.postText}>{item.contents}</Text>
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
    color: '#000',
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
    marginBottom: height * 0.01,
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginRight: width * 0.03,
  },
  profileText: {
    justifyContent: 'center',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  time: {
    fontSize: width * 0.035,
    color: '#888',
  },
  contentImage: {
    width: '100%',
    height: height * 0.5,
    resizeMode: 'cover',
    borderRadius: width * 0.02,
    marginBottom: height * 0.015,
  },
  postText: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: height * 0.01,
  },
});

export default MainStudy;
