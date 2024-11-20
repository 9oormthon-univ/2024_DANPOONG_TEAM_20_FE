import React from 'react';
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

const dummyData = [
  {
    id: 1,
    name: 'nanami',
    streak: 178,
    flag: '🇯🇵',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: '천현주',
    streak: 155,
    flag: '🇰🇷',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'jamin',
    streak: 142,
    flag: '🇦🇺',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'amy',
    streak: 128,
    flag: '🇩🇪',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 5,
    name: 'seyong',
    streak: 118,
    flag: '🇰🇷',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 6,
    name: 'julie',
    streak: 115,
    flag: '🇦🇺',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 7,
    name: 'nanami',
    streak: 110,
    flag: '🇲🇽',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 8,
    name: 'mina',
    streak: 98,
    flag: '🇯🇵',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 9,
    name: 'haen',
    streak: 88,
    flag: '🇰🇷',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 10,
    name: 'leo',
    streak: 85,
    flag: '🇫🇷',
    image: 'https://via.placeholder.com/150',
  },
];

const Rank = ({navigation}) => {
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
              source={{uri: dummyData[1].image}}
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{dummyData[1].name}</Text>
              <Text style={styles.flagText}>{dummyData[1].flag}</Text>
            </View>
            <View style={styles.streakContainer}>
              <StreakIcon width={16} height={16} />
              <Text style={styles.streakText}>{dummyData[1].streak}</Text>
            </View>
          </View>

          {/* 1등 */}
          <View style={[styles.rankBox, styles.largeRankBox]}>
            <Rank1 style={styles.rankBadge} />
            <Image
              source={{uri: dummyData[0].image}}
              style={styles.profileImageLarge}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{dummyData[0].name}</Text>
              <Text style={styles.flagText}>{dummyData[0].flag}</Text>
            </View>
            <View style={styles.streakContainer}>
              <StreakIcon width={18} height={18} />
              <Text style={styles.streakText}>{dummyData[0].streak}</Text>
            </View>
          </View>

          {/* 3등 */}
          <View style={[styles.rankBox, styles.smallRankBox]}>
            <Rank3 style={styles.rankBadge} />
            <Image
              source={{uri: dummyData[2].image}}
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{dummyData[2].name}</Text>
              <Text style={styles.flagText}>{dummyData[2].flag}</Text>
            </View>
            <View style={styles.streakContainer}>
              <StreakIcon width={16} height={16} />
              <Text style={styles.streakText}>{dummyData[2].streak}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 스크롤 가능한 나머지 랭킹 */}
      <ScrollView style={styles.scrollContainer}>
        {dummyData.slice(3).map((user, index) => (
          <View key={user.id} style={styles.row}>
            <Text style={styles.rank}>{user.id}</Text>
            <Image source={{uri: user.image}} style={styles.profileImageRow} />
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{user.name}</Text>
                <Text style={styles.flagText}>{user.flag}</Text>
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
