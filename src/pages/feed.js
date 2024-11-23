import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header2 from '../components/header2';
import SendCommentIcon from '../images/sendComment.svg';
import SendDmIcon from '../images/sendDm.svg';
import OptionIcon from '../images/option.svg';

const Feed = ({route}) => {
  const {feedId} = route.params; // MainSocial에서 전달받은 feedId
  const [feedData, setFeedData] = useState(null); // 피드 데이터
  const [comments, setComments] = useState([]); // 댓글 리스트
  const [commentText, setCommentText] = useState(''); // 댓글 입력 값

  useEffect(() => {
    const fetchFeedDetails = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        Alert.alert('오류', '토큰이 없습니다.');
        return;
      }

      try {
        const response = await fetch(
          `https://mixmix2.store/api/feed/${feedId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setFeedData(data.data); // 피드 데이터 설정
          setComments(data.data.comments || []); // 댓글 데이터 설정
        } else {
          const errorData = await response.json();
          Alert.alert(
            '오류',
            errorData.message || '피드 정보를 가져오는 데 실패했습니다.',
          );
        }
      } catch (error) {
        Alert.alert('오류', '네트워크 오류가 발생했습니다.');
      }
    };

    fetchFeedDetails();
  }, [feedId]);
  const handleSendComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('오류', '댓글 내용을 입력해주세요.');
      return;
    }

    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!accessToken) {
      Alert.alert('오류', '토큰이 없습니다.');
      return;
    }

    try {
      console.log('Access Token:', accessToken);

      // 요청 바디 로그 출력
      const requestBody = {
        contents: commentText,
        feedId: feedId,
      };
      console.log('Request Body:', JSON.stringify(requestBody, null, 2)); // JSON으로 보기 좋게 출력

      const response = await fetch('https://mixmix2.store/api/comments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response Status:', response.status);

      // 응답 처리
      const responseData = await response.json(); // 응답을 JSON으로 읽음
      console.log('Response Data:', responseData);

      if (response.ok) {
        console.log('New Comment:', responseData);
        setComments(prevComments => [responseData.data, ...prevComments]); // 댓글 리스트에 새 댓글 추가
        setCommentText(''); // 입력 필드 초기화
      } else {
        Alert.alert(
          '오류',
          responseData.message || '댓글 작성에 실패했습니다.',
        );
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };

  // 피드 콘텐츠와 댓글을 합친 데이터
  const data = feedData ? [feedData, ...comments] : [];

  return (
    <SafeAreaView style={styles.container}>
      <Header2 />

      <FlatList
        data={data}
        keyExtractor={item => item.feedId?.toString() || item.id?.toString()}
        contentContainerStyle={{paddingBottom: 80}}
        renderItem={({item}) => {
          if (item.feedId) {
            return (
              <View style={styles.feedContainer}>
                <View style={styles.profileContainer}>
                  <View style={styles.profileInfo}>
                    <Image
                      source={{
                        uri:
                          item.profileImage || 'https://via.placeholder.com/40',
                      }}
                      style={styles.profileImage}
                    />
                    <View>
                      <Text style={styles.name}>
                        {item.name || '익명'}{' '}
                        <Text style={styles.flag}>{item.flag || ''}</Text>
                      </Text>
                      <Text style={styles.time}>
                        {new Date(item.createdAt).toLocaleString() || '방금 전'}
                      </Text>
                    </View>
                  </View>
                  <Pressable style={styles.optionButton}>
                    <OptionIcon width={18} height={18} />
                  </Pressable>
                </View>
                <Image
                  source={{
                    uri: item.feedImage || 'https://via.placeholder.com/300',
                  }}
                  style={styles.contentImage}
                />
                <Text style={styles.feedText}>{item.contents}</Text>
              </View>
            );
          } else {
            return (
              <View style={styles.commentContainer}>
                <Image
                  source={{
                    uri: item.profileImage || 'https://via.placeholder.com/40',
                  }}
                  style={styles.commentProfileImage}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentName}>
                    {item.name || '익명'}{' '}
                    <Text style={styles.flag}>{item.flag || ''}</Text>
                  </Text>
                  <Text style={styles.commentText}>{item.contents}</Text>
                  <Text style={styles.commentTime}>
                    {new Date(item.createdAt).toLocaleString() || '방금 전'}
                  </Text>
                </View>
                <Pressable style={styles.sendDmButton}>
                  <SendDmIcon width={18} height={18} />
                </Pressable>
              </View>
            );
          }
        }}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInputWithButton}
          value={commentText}
          onChangeText={setCommentText}
          placeholder="새로운 친구와 소통해보세요..."
          placeholderTextColor="#999"
        />
        <Pressable
          style={styles.sendCommentInsideButton}
          onPress={handleSendComment}>
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
    justifyContent: 'space-between',
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
