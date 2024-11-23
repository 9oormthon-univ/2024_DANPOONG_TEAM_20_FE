import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import NavBar from '../components/navBar';
import RankBg from '../images/rank_bg.svg';
import Rank1 from '../images/rank_1.svg';
import Rank2 from '../images/rank_2.svg';
import Rank3 from '../images/rank_3.svg';
import StreakIcon from '../images/profile_streak.svg';

const {width, height} = Dimensions.get('window');

const Rank = ({navigation}) => {
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 데이터 가져오는 함수
  const getRankInfo = async () => {
    try {
      const response = await fetch('https://mixmix2.store/api/rankings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();

        const rankingData =
          responseData?.data?.rankingInfoResDto?.sort(
            (a, b) => a.streakRank - b.streakRank,
          ) || [];
        setRankData(rankingData); // 상태에 가공된 데이터를 저장
        console.log('Ranking Data:', rankingData);
      } else {
        console.error('데이터 요청 실패:', response.status);
      }
    } catch (error) {
      console.error('프로필 데이터 불러오기 오류:', error);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    getRankInfo();
  }, []);

  if (loading) {
    // 로딩 중일 때 표시
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: height * 0.3}}>
          데이터 로딩 중...
        </Text>
      </SafeAreaView>
    );
  }

  if (!rankData) {
    // 데이터가 없을 때 표시
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: height * 0.3}}>
          데이터를 불러오지 못했습니다.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Rank 배경 영역 */}
      <View style={styles.rankBgContainer}>
        <RankBg style={styles.rankBg} />
        <Text style={styles.title}>명예의 전당</Text>
        <Text style={styles.subtitle}>이번 달 Streak 순위</Text>
        <View style={styles.topThreeContainer}>
          {/* 2등 */}
          <View style={[styles.rankBox, styles.smallRankBox]}>
            <Rank2 style={styles.rankBadge} />
            <Image
              source={{uri: rankData[1]?.profileImage}}
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{rankData[1]?.name}</Text>
              <Text style={styles.flagText}>{rankData[1]?.nationality}</Text>
            </View>
            <View style={styles.streakContainer}>
              <StreakIcon width={16} height={16} />
              <Text style={styles.streakText}>{rankData[1]?.streak}</Text>
            </View>
          </View>

          {/* 1등 */}
          <View style={[styles.rankBox, styles.largeRankBox]}>
            <Rank1 style={styles.rankBadge} />
            <Image
              source={{uri: rankData[0]?.profileImage}}
              style={styles.profileImageLarge}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{rankData[0]?.name}</Text>
              <Text style={styles.flagText}>{rankData[0]?.nationality}</Text>
            </View>
            <View style={styles.streakContainer}>
              <StreakIcon width={18} height={18} />
              <Text style={styles.streakText}>{rankData[0]?.streak}</Text>
            </View>
          </View>

          {/* 3등 */}
          <View style={[styles.rankBox, styles.smallRankBox]}>
            <Rank3 style={styles.rankBadge} />
            <Image
              source={{uri: rankData[2]?.profileImage}}
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{rankData[2]?.name}</Text>
              <Text style={styles.flagText}>{rankData[2]?.nationality}</Text>
            </View>
            <View style={styles.streakContainer}>
              <StreakIcon width={16} height={16} />
              <Text style={styles.streakText}>{rankData[2]?.streak}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 스크롤 가능한 나머지 랭킹 */}
      <ScrollView style={styles.scrollContainer}>
        {rankData.slice(3).map((user, index) => (
          <View key={user.id} style={styles.row}>
            <Text style={styles.rank}>{(index + 4).toString()}</Text>
            <Image
              source={{uri: user.profileImage}}
              style={styles.profileImageRow}
            />
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{user.name}</Text>
                <Text style={styles.flagText}>{user.nationality}</Text>
              </View>
              <View style={styles.streakContainer}>
                <StreakIcon width={16} height={16} />
                <Text style={styles.streakText}>{user.streak}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 하단 네비게이션 바 */}
      <NavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rankBgContainer: {
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rankBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: height * 0.02,
    alignSelf: 'flex-start',
    marginLeft: width * 0.05,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: width * 0.05,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: height * 0.01,
  },
  rankBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 5,
    position: 'relative',
  },
  largeRankBox: {
    width: width * 0.3,
    marginHorizontal: width * 0.02,
  },
  smallRankBox: {
    width: width * 0.25,
    marginHorizontal: width * 0.01,
  },
  rankBadge: {
    position: 'absolute',
    top: -height * 0.02,
    left: width * 0.03, // 배지 위치를 약간 조정
    zIndex: 10, // 프로필 이미지보다 앞으로 오게 설정
  },

  profileImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    zIndex: 1, // 배지보다 뒤에 표시되도록 설정
  },

  profileImageLarge: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    zIndex: 1, // 배지보다 뒤에 표시되도록 설정
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  nameText: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginRight: width * 0.015,
  },
  flagText: {
    fontSize: width * 0.03,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  streakText: {
    marginLeft: 5,
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rank: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginRight: width * 0.05,
  },
  profileImageRow: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.05,
  },
});

export default Rank;
