import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Defs, ClipPath, Path, Image as SvgImage} from 'react-native-svg';
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

export default function MyProfile() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 프로필 편집 여부 상태

  useEffect(() => {
    loadUserInfo();
  }, []);
  const handleProfileEdit = () => {
    setIsEditing(true); // 프로필 편집 화면으로 전환
  };

  // 사용자 정보 불러오기
  const loadUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userInfo');
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
            <Text style={styles.streakNumber}>178</Text>
          </View>
          <Text style={styles.universityName}>{userInfo.university}</Text>

          {/* 프로필 이미지 */}
          <View style={styles.profileImageContainer}>
            <Svg width={155} height={150}>
              <Defs>
                <ClipPath id="mixmix">
                  <Path d="M77.5 23.3165C17.5702 -29.9316 -30.9666 17.0581 24.073 75C-30.9666 132.994 17.5702 179.984 77.5 126.684C137.43 179.932 185.967 132.942 130.927 75C185.967 17.006 137.43 -29.9838 77.5 23.3165Z" />
                </ClipPath>
              </Defs>
              <SvgImage
                href={
                  userInfo?.profileImageUrl || 'https://via.placeholder.com/120'
                }
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
            <Text style={styles.profileName}>
              {userInfo?.nickname || '사용자'}
            </Text>
            <Text style={styles.profileNation}>
              · {userInfo?.nation || '국가 🇰🇷'}
            </Text>
          </View>
          <Text style={styles.message}>{userInfo.introduction}</Text>
        </View>

        {/* 올린 게시글 섹션 */}
        <View style={styles.postsSection}>
          <View style={styles.postCategory}>
            <Text style={[styles.postLabel, {color: '#ff6152'}]}>Social</Text>
            <Text style={styles.postCount}>45</Text>
          </View>
          <LineProfile />
          <View style={styles.postCategory}>
            <Text style={[styles.postLabel, {color: '#7dc353'}]}>Edu</Text>
            <Text style={styles.postCount}>51</Text>
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
          <LineCalendar style={styles.lineCalendarLine1} />
          <LineCalendar style={styles.lineCalendarLine2} />
          <LineCalendar style={styles.lineCalendarLine3} />
          <LineCalendar style={styles.lineCalendarLine4} />
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
    // justifyContent: "space-between",
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  universityName: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    marginRight: 16,
    right: 0,
    borderRadius: 25,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    marginVertical: 8,
  },
  streakNumber: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    marginRight: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  streakIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
  profileImageContainer: {
    position: 'relative',
    width: 155,
    height: 150,
    marginTop: 16,
  },
  badge: {
    position: 'absolute',
    marginTop: -11,
    left: 9,
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 9,
    marginRight: -16,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    color: '#000',
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  profileNation: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: 4,
    color: '#000',
  },

  message: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    marginTop: 4,
    color: '#333',
  },
  postsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  postCategory: {
    alignItems: 'center',
  },
  line: {
    width: '20%',
    height: 2,
  },
  postLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 8,
  },
  postCount: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  quizSection: {
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 정렬
    alignItems: 'center', // 세로 정렬 가운데
    padding: 16,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    borderWidth: 0.5,
    margin: 16,
    backgroundColor: '#fff', // 배경색 추가
  },
  quizSectionPressable: {
    flexDirection: 'row', // Pressable 내부 아이콘과 텍스트를 가로로 정렬
    alignItems: 'center', // 세로 정렬 가운데
    width: '100%', // Pressable 영역 확장
  },
  quizIcon: {
    marginRight: 12, // 아이콘과 텍스트 사이 여백
  },
  textGroup: {
    flexDirection: 'column', // 텍스트는 세로로 쌓이도록 설정
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  calendarSection: {
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#222222',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    marginRight: 12,
  },
  calendarDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    // color: "#999999",
  },
  date: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 8,
    flexBasis: '14.28%',
    maxWidth: '14.28%',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#999999',
  },
  dateSubtext: {
    fontSize: 12,
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
  lineCalendarLine1: {
    marginTop: 110,
    position: 'absolute',
    alignItems: 'center',
    marginLeft: 4,
  },
  lineCalendarLine2: {
    marginTop: 180,
    position: 'absolute',
    alignItems: 'center',
    marginLeft: 4,
  },
  lineCalendarLine3: {
    marginTop: 250,
    position: 'absolute',
    alignItems: 'center',
    marginLeft: 4,
  },
  lineCalendarLine4: {
    marginTop: 320,
    position: 'absolute',
    alignItems: 'center',
    marginLeft: 4,
  },
  lineUnderCal: {
    marginVertical: 26,
  },
});
