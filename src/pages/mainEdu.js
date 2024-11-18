import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import NavBar from '../components/navBar';
import Header from '../components/header'; // Header 추가
import LikeIcon from '../images/like.svg'; // 좋아요 아이콘
import CommentIcon from '../images/comment.svg'; // 댓글 아이콘
import OptionIcon from '../images/option.svg'; // 더보기 아이콘

const MainEdu = ({navigation}) => {
  const [activeTag, setActiveTag] = useState('#전체'); // 활성화된 태그 상태
  const hashtags = ['#전체', '#언어', '#전공', '#질문', '#구인']; // 해시태그 리스트

  // 더미 데이터 (스크롤 영역)
  const data = [
    {
      id: '1',
      profileImage: 'https://via.placeholder.com/40',
      name: 'moi',
      flag: '🇦🇺',
      time: '9시간 전',
      contentImage: 'https://via.placeholder.com/300',
      text: '한국어 공부 중ㅎㅎ 함께 할 사람 있나요?',
      likes: 115,
      comments: 75,
    },
    {
      id: '2',
      profileImage: 'https://via.placeholder.com/40',
      name: 'amy',
      flag: '🇺🇸',
      time: '2시간 전',
      contentImage: 'https://via.placeholder.com/300',
      text: 'React Native 배우기 시작했어요!',
      likes: 97,
      comments: 34,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header navigation={navigation} />

      {/* 해시태그 버튼 영역 */}
      <View style={styles.hashtagContainer}>
        {hashtags.map(tag => (
          <Pressable
            key={tag}
            style={[
              styles.hashtagButton,
              activeTag === tag && styles.activeHashtagButton, // 활성화 스타일
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
      </View>

      {/* 스크롤 가능한 콘텐츠 */}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.postContainer}>
            {/* 프로필 영역 */}
            <View style={styles.profileContainer}>
              <Image
                source={{uri: item.profileImage}}
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
                source={{uri: item.contentImage}}
                style={styles.contentImage}
              />
              {/* 이미지 위 좋아요, 댓글, 더보기 버튼 */}
              <View style={styles.imageOverlay}>
                <View style={styles.actionsContainer}>
                  <View style={styles.action}>
                    <LikeIcon width={20} height={20} />
                    <Text style={styles.actionText}>{item.likes}</Text>
                  </View>
                  <View style={styles.action}>
                    <CommentIcon width={20} height={20} />
                    <Text style={styles.actionText}>{item.comments}</Text>
                  </View>
                  <Pressable style={styles.optionButton}>
                    <OptionIcon width={20} height={20} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* 게시글 텍스트 */}
            <Text style={styles.postText}>{item.text}</Text>

            {/* 댓글 달기 */}
            <Text style={styles.commentPlaceholder}>댓글 달기...</Text>
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
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hashtagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
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
  imageOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionsContainer: {
    alignItems: 'center',
  },
  action: {
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  optionButton: {
    alignSelf: 'flex-end',
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

export default MainEdu;
