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
import Svg, {
  Defs,
  ClipPath,
  Path,
  Circle,
  Image as SvgImage,
} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import StreakIcon from '../images/Fire_fill.svg';
import BadgeIcon from '../images/badge1.svg';
import Header2 from '../components/header2';
import TodayQuizIcon from '../images/todayQuiz_icon.svg';
import LineProfile from '../images/lineProfile.svg';
import LineCalendar from '../images/lineCalendar.svg';
import ProfileEditIcon from '../images/profileEditIcon.svg';
import LineUnderCal from '../images/lineUnderCal.svg';
import NavBar from '../components/navBar';
import ProfileEdit from './profileEdit';

const {width, height} = Dimensions.get('window');

export default function MyProfile() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null); // 서버에서 가져온 데이터를 저장

  // 서버에서 데이터 가져오기
  const profileDetail = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://mixmix2.store/api/member/mypage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // 가져온 데이터를 상태에 저장
        console.log('userdata:', data);
        setUserInfo(data.data); // userInfo에 실제 프로필 데이터 저장
      } else {
        console.error('데이터 요청 실패', response.status);
      }
    } catch (error) {
      console.error('프로필 데이터 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    profileDetail();
    loadUserInfo(); // 데이터 가져오기 두 가지 함수를 동시에 실행
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  // 사용자 정보 불러오기
  const loadUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      console.log('userinfo:', storedUserInfo);
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo)); // userInfo 상태 업데이트
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('userInfo updated:', userInfo); // userInfo가 변경될 때마다 출력
  }, [userInfo]); // userInfo가 변경될 때마다 실행

  const handleProfileEdit = () => {
    setIsEditing(true); // 프로필 편집 화면으로 전환
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userInfo');
      const response = await fetch(
        'https://mixmix2.store/api/notifications/disconnect',
        {
          method: 'DELETE',
        },
      );
      const responseBody = await response.json();
      console.log('서버 응답:', responseBody);
      navigation.replace('Login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  if (isEditing) {
    return <ProfileEdit />; // ProfileEdit 컴포넌트 렌더링
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6152" />
      </View>
    );
  }

  // 사용자 정보가 없거나 서버 데이터가 아직 로드되지 않으면 반환하지 않음
  if (!userInfo || !userData) {
    return null; // 데이터를 기다리면서 로딩 화면만 표시
  }

  return (
    <View style={styles.container}>
      {/* 스크롤 가능한 영역 */}
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <Header2 />

        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.streak}>
            <StreakIcon style={styles.streakIcon} />
            <Text style={styles.streakNumber}>{userInfo.streak}</Text>
          </View>
          <Text style={styles.universityName}>{userInfo.school}</Text>

          {/* 프로필 이미지 */}
          <View style={styles.profileImageContainer}>
            <Svg width={144} height={144}>
              <Defs>
                <ClipPath id="mixmix">
                  <Circle cx="72" cy="72" r="72" />
                </ClipPath>
              </Defs>
              <SvgImage
                href={userInfo?.picture || 'https://via.placeholder.com/120'}
                width="100%"
                height="100%"
                clipPath="url(#mixmix)"
                preserveAspectRatio="xMidYMid slice"
              />
            </Svg>
            <BadgeIcon style={styles.badge} />
            <Pressable onPress={handleProfileEdit}>
              <ProfileEditIcon style={styles.editIcon} />
            </Pressable>
          </View>

          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{userInfo?.name || '사용자'}</Text>
            <Text style={styles.profileNation}>
              · {userInfo?.nationality || '국가 🇰🇷'}
            </Text>
          </View>
          <Text style={styles.message}>{userInfo.introduction}</Text>
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

        {/* 퀴즈 섹션 */}
        <View style={styles.quizSection}>
          <Pressable
            onPress={() => navigation.navigate('Quiz')} // Quiz로 이동
            style={styles.quizSectionPressable} // Pressable 스타일 추가
          >
            <TodayQuizIcon style={styles.quizIcon} />
            <View style={styles.textGroup}>
              <Text style={styles.quizTitle}>오늘의 퀴즈</Text>
              <Text style={styles.quizSubtitle}>
                오늘의 퀴즈 풀고 Streak 채워봐요
              </Text>
            </View>
          </Pressable>
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
                {index < 30 && (
                  <Text style={styles.dateSubtext}>더미 텍스트</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <LineUnderCal style={styles.lineUnderCal} />

        {/* 로그아웃 버튼 */}
        <View style={styles.accountContainer}>
          <Text style={styles.accountTitle}>내 계정</Text>
          <Text style={styles.accountEmail}>
            {userInfo?.email || '이메일 정보 없음'}
          </Text>

          <Pressable style={styles.logoutContainer} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 하단 네비게이션 */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.02,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: width * 0.04,
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },
  headerIcon: {
    width: width * 0.06,
    height: width * 0.06,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
    backgroundColor: '#fff',
  },
  universityName: {
    fontSize: width * 0.03,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: width * 0.04,
    borderRadius: width * 0.06,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    paddingVertical: height * 0.005,
    marginTop: height * 0.01,
  },
  streakNumber: {
    fontSize: width * 0.03,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    marginRight: width * 0.02,
  },
  streakIcon: {
    width: width * 0.05,
    height: width * 0.05,
    marginLeft: width * 0.01,
  },
  profileImageContainer: {
    position: 'relative',
    width: width * 0.4,
    height: height * 0.2,
    marginTop: height * 0.02,
  },
  badge: {
    position: 'absolute',
    marginTop: height * -0.01,
    left: width * 0.02,
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: height * 0.02,
    marginRight: width * 0.02,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.07,
  },
  profileName: {
    fontSize: width * 0.04,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  profileNation: {
    fontSize: width * 0.03,
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: width * 0.01,
    color: '#000',
  },
  message: {
    fontSize: width * 0.035,
    fontFamily: 'Pretendard-Regular',
    marginTop: height * 0.005,
    color: '#333',
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
  line: {
    width: width * 0.2,
    height: height * 0.002,
  },
  postLabel: {
    fontSize: width * 0.035,
    fontFamily: 'Pretendard-Medium',
    marginBottom: height * 0.01,
  },
  postCount: {
    fontSize: width * 0.05,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  quizSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.02,
    borderColor: '#d9d9d9',
    borderRadius: width * 0.02,
    borderWidth: 0.5,
    margin: height * 0.02,
    backgroundColor: '#fff',
  },
  quizSectionPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  quizIcon: {
    marginRight: width * 0.03,
  },
  textGroup: {
    flexDirection: 'column',
  },
  quizTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  quizSubtitle: {
    fontSize: width * 0.035,
    color: '#666',
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
  accountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    // flexDirection: "column",
  },
  accountTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: '#000',
  },
  accountEmail: {
    fontSize: 12,
    marginBottom: 10,
    color: '#000',
  },
  logoutText: {
    // textAlign: "right",
    // marginTop: -20,
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderColor: '#767676',
  },
  logoutContainer: {
    position: 'absolute',
    right: 0,
    marginTop: 20,
  },
  lineCalendarLine: {
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 4,
    justifyContent: 'center',
    position: 'absolute',
  },
  lineUnderCal: {
    marginVertical: 26,
  },
});
