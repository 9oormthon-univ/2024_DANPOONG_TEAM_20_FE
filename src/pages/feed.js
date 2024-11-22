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

  useEffect(() => {
    const fetchFeedDetails = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        Alert.alert('오류', '토큰이 없습니다.');
        return;
      }

      try {
        console.log(`API 호출 URL: https://mixmix2.store/api/feed/${feedId}`);
        console.log('Authorization 헤더:', `Bearer ${accessToken}`);

        const response = await fetch(
          `https://mixmix2.store/api/feed/${feedId}`, // feedId를 URL에 포함
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`, // 인증 토큰 추가
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setFeedData(data.data); // 피드 데이터 설정
          setComments(data.data.comments || []); // 댓글 데이터 설정
        } else {
          const errorData = await response.json();
          console.error('API 호출 실패:', errorData.message || response.status);
          Alert.alert(
            '오류',
            errorData.message || '피드 정보를 가져오는 데 실패했습니다.',
          );
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
        Alert.alert('오류', '네트워크 오류가 발생했습니다.');
      }
    };

    fetchFeedDetails();
  }, [feedId]);

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
            // 피드 콘텐츠 렌더링
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
            // 댓글 렌더링
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
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTime}>
                    {new Date(item.time).toLocaleString() || '방금 전'}
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
