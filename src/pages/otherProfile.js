import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Defs, ClipPath, Circle, Image as SvgImage} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import Header2 from '../components/header2';
import NavBar from '../components/navBar';

const {width, height} = Dimensions.get('window');

export default function OtherProfile({route}) {
  const navigation = useNavigation();
  const {memberId} = route.params; // `MainSocial`에서 전달된 userId
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]); // 게시글 데이터
  const [loading, setLoading] = useState(true);

  // 상대방 프로필 가져오기
  const fetchOtherProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(
        `https://mixmix2.store/api/member/mypage/${memberId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.data); // 서버에서 가져온 데이터를 userInfo에 저장
        console.log('Other user info:', data.data);
      } else {
        const errorData = await response.json();
        console.error(
          'Failed to fetch other profile:',
          response.status,
          errorData,
        );
      }
    } catch (error) {
      console.error('Error fetching other profile:', error);
    }
  };

  // 상대방 게시글 가져오기
  const fetchPosts = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(
        `https://mixmix2.store/api/member/posts/${memberId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.data || []); // 게시글 데이터 설정
        console.log('Posts:', data.data);
      } else {
        console.error('Failed to fetch posts:', response.status);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherProfile();
    fetchPosts(); // 프로필과 게시글 데이터 가져오기
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6152" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>프로필 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header2 />
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Svg width={144} height={144}>
              <Defs>
                <ClipPath id="profileClip">
                  <Circle cx="72" cy="72" r="72" />
                </ClipPath>
              </Defs>
              <SvgImage
                href={userInfo.picture || 'https://via.placeholder.com/144'}
                width="100%"
                height="100%"
                clipPath="url(#profileClip)"
                preserveAspectRatio="xMidYMid slice"
              />
            </Svg>
          </View>
          <Text style={styles.profileName}>{userInfo.name || '이름 없음'}</Text>
          <Text style={styles.profileSchool}>
            {userInfo.school || '학교 정보 없음'}
          </Text>
          <Text style={styles.profileIntro}>
            {userInfo.introduction || '자기소개가 없습니다.'}
          </Text>

          {/* "쪽지 보내기" 버튼 */}
          <Pressable
            style={styles.messageButton}
            onPress={() => {
              navigation.navigate('Dm', {memberId, memberName: userInfo.name}); // Dm.js로 이동 및 데이터 전달
            }}>
            <Text style={styles.messageButtonText}>쪽지 보내기</Text>
          </Pressable>
        </View>

        {/* 게시글 섹션 */}
        <View style={styles.postsSection}>
          <Text style={styles.postsTitle}>올린 게시글</Text>
          {posts.length === 0 ? (
            <Text style={styles.noPostsText}>게시글이 없습니다.</Text>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.postContainer}>
                  <Image
                    source={{
                      uri: item.image || 'https://via.placeholder.com/150',
                    }}
                    style={styles.postImage}
                  />
                  <Text style={styles.postContent}>{item.contents}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.navBarContainer}>
        <NavBar navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6152',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSchool: {
    fontSize: 16,
    color: '#666',
  },
  profileIntro: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  messageButton: {
    backgroundColor: '#fff7f6',
    borderWidth: 1,
    borderColor: '#ec5445',
    borderRadius: 15,
    height: 36,
    width: 106,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  messageButtonText: {
    color: '#ec5445',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  postsSection: {
    padding: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noPostsText: {
    fontSize: 14,
    color: '#888',
  },
  postContainer: {
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
