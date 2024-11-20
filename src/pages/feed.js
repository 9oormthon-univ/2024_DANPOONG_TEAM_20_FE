import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import Header2 from '../components/header2';
import SendCommentIcon from '../images/sendComment.svg';
import SendDmIcon from '../images/sendDm.svg';
import OptionIcon from '../images/option.svg'; // Option 아이콘 추가

const Feed = () => {
  const feedData = {
    id: 'feed',
    type: 'feed',
    profileImage: 'https://via.placeholder.com/40',
    name: 'nanami',
    flag: '🇯🇵',
    time: '2시간 전',
    contentImage: 'https://via.placeholder.com/300',
    text: '어제 새로 산 카메라로 함께 사진 찍으며 놀아요',
  };

  const comments = [
    {
      id: '1',
      type: 'comment',
      profileImage: 'https://via.placeholder.com/40',
      name: 'karina',
      flag: '🇰🇷',
      time: '2시간 전',
      text: '저 함께 하고 싶어요',
    },
  ];

  // 피드 콘텐츠와 댓글을 합친 데이터
  const data = [feedData, ...comments];

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <Header2 />

      {/* 피드 콘텐츠와 댓글 리스트 */}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 80}} // 댓글 입력창 여백 추가
        renderItem={({item}) => {
          if (item.type === 'feed') {
            // 피드 콘텐츠 렌더링
            return (
              <View style={styles.feedContainer}>
                <View style={styles.profileContainer}>
                  {/* 프로필 정보 */}
                  <View style={styles.profileInfo}>
                    <Image
                      source={{uri: item.profileImage}}
                      style={styles.profileImage}
                    />
                    <View>
                      <Text style={styles.name}>
                        {item.name} <Text style={styles.flag}>{item.flag}</Text>
                      </Text>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </View>
                  {/* Option 아이콘 */}
                  <Pressable style={styles.optionButton}>
                    <OptionIcon width={18} height={18} />
                  </Pressable>
                </View>
                <Image
                  source={{uri: item.contentImage}}
                  style={styles.contentImage}
                />
                <Text style={styles.feedText}>{item.text}</Text>
              </View>
            );
          } else if (item.type === 'comment') {
            // 댓글 렌더링
            return (
              <View style={styles.commentContainer}>
                <Image
                  source={{uri: item.profileImage}}
                  style={styles.commentProfileImage}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentName}>
                    {item.name} <Text style={styles.flag}>{item.flag}</Text>
                  </Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTime}>{item.time}</Text>
                </View>
                <Pressable style={styles.sendDmButton}>
                  <SendDmIcon width={18} height={18} />
                </Pressable>
              </View>
            );
          }
        }}
      />

      {/* 댓글 입력창 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInputWithButton}
          placeholder="새로운 친구와 소통해보세요..."
          placeholderTextColor="#999"
        />
        <Pressable style={styles.sendCommentInsideButton}>
          <SendCommentIcon width={50} height={30} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Option 아이콘을 오른쪽으로 정렬
    marginBottom: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
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
  optionButton: {
    padding: 8,
  },
  contentImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  feedText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#888',
  },
  sendDmButton: {
    marginLeft: 8,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  commentInputWithButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 50,
    fontSize: 14,
    color: '#333',
  },
  sendCommentInsideButton: {
    position: 'absolute',
    right: 22,
    height: 30,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default Feed;