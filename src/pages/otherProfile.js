import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Defs, ClipPath, Circle, Image as SvgImage} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import Header2 from '../components/header2';
import NavBar from '../components/navBar';
import LineProfile from '../images/lineProfile.svg';
import LineCalendar from '../images/lineCalendar.svg';

const {width, height} = Dimensions.get('window');

export default function OtherProfile({route}) {
  const navigation = useNavigation();
  const {memberId} = route.params; // 전달받은 memberId
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]); // 사용자 게시글 상태
  const [loading, setLoading] = useState(true);

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
        setUserInfo(data.data);
        setUserPosts(data.data.posts || []); // 게시글 데이터가 있다면 추가
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherProfile();
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              navigation.navigate('Dm', {memberId, memberName: userInfo.name});
            }}>
            <Text style={styles.messageButtonText}>쪽지 보내기</Text>
          </Pressable>
        </View>

        {/* 올린 게시글 섹션 */}
        <View style={styles.postsSection}>
          <View style={styles.postCategory}>
            <Text style={[styles.postLabel, {color: '#ff6152'}]}>Social</Text>
            <Text style={styles.postCount}>{userInfo.socialCount}</Text>
          </View>
          <LineProfile />
          <View style={styles.postCategory}>
            <Text style={[styles.postLabel, {color: '#ff6152'}]}>Study</Text>
            <Text style={styles.postCount}>{userInfo.studyCount}</Text>
          </View>
        </View>

        {/* 캘린더 섹션 */}
        <View style={styles.calendarSection}>
          <View style={styles.weekDays}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <Text key={index} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>
          <LineCalendar style={styles.lineCalendarLine} />
          <View style={styles.calendarDates}>
            {[...Array(31)].map((_, index) => (
              <View key={index} style={styles.date}>
                <Text style={styles.dateText}>{index + 1}</Text>
                {index < 30 && <Text style={styles.dateSubtext}></Text>}
              </View>
            ))}
          </View>
        </View>
        {/* 여백 추가 */}
        <View style={styles.bottomPadding} />
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
  scrollContent: {
    paddingBottom: height * 0.1, // 아래 여백 추가
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
    color: '#000',
  },
  profileSchool: {
    fontSize: 14,
    marginTop: 8,
    color: '#000',
  },
  profileIntro: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
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
    textAlign: 'center',
  },
  postsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    backgroundColor: '#ffffff',
  },
  postCategory: {
    alignItems: 'center',
  },
  postLabel: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  postCount: {
    fontSize: width * 0.05,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  calendarSection: {
    marginHorizontal: width * 0.04,
    borderRadius: width * 0.025,
    padding: height * 0.02,
    backgroundColor: '#222222',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: height * 0.01,
  },
  weekDay: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: width * 0.03,
  },
  calendarDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  date: {
    flex: 1,
    alignItems: 'center',
    marginVertical: height * 0.01,
    flexBasis: '14.28%',
    maxWidth: '14.28%',
  },
  dateText: {
    fontSize: width * 0.035,
    fontFamily: 'Pretendard-Medium',
    color: '#999999',
  },
  dateSubtext: {
    fontSize: width * 0.03,
    textAlign: 'center',
    color: '#777',
  },
  bottomPadding: {
    height: height * 0.1,
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
