import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
} from "react-native";

export default function MyProfile() {
  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>nanami</Text>
        <Image
          source={require("../images/notification.svg")} // 알림 아이콘
          style={styles.headerIcon}
        />
      </View>

      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <Text style={styles.universityName}>구름대학교</Text>
        <View style={styles.streak}>
          <Text style={styles.streakNumber}>178</Text>
          <Image style={styles.streakIcon} source={require("../images/Fire_fill.svg")} />
        </View>
        <Text style={styles.message}>저와 동네친구 할래요?</Text>
      </View>

      {/* 퀴즈 섹션 */}
      <View style={styles.quizSection}>
        <Text style={styles.quizTitle}>오늘의 퀴즈</Text>
        <Text style={styles.quizSubtitle}>오늘의 퀴즈 풀고 Streak 채워봐요</Text>
      </View>

      {/* 점수 섹션 */}
      <View style={styles.scoresSection}>
        <Text style={styles.score}>45</Text>
        <View style={styles.scoreBar}>
          <Text style={styles.scorePart}>51</Text>
          <Text style={styles.scoreLabel}>Edu</Text>
          <Text style={styles.scoreLabel}>Social</Text>
        </View>
      </View>

      {/* 캘린더 섹션 */}
      <View style={styles.calendarSection}>
        <View style={styles.weekDays}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <Text key={index} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.calendarDates}>
          {/* 날짜 데이터: 필요에 따라 동적으로 렌더링 */}
          {[...Array(31)].map((_, index) => (
            <View key={index} style={styles.date}>
              <Text style={styles.dateText}>{index + 1}</Text>
              {index < 25 && <Text style={styles.dateSubtext}>더미텍스트</Text>}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  flag: {
    fontSize: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#f0f0f0",
  },
  universityName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4500",
  },
  streakIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
  message: {
    fontSize: 16,
    color: "#333",
  },
  quizSection: {
    padding: 16,
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
    margin: 16,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quizSubtitle: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
  scoresSection: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff7e6",
  },
  score: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffa500",
  },
  scoreBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 8,
  },
  scorePart: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#888",
  },
  calendarSection: {
    padding: 16,
    backgroundColor: "#ffffff",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  calendarDates: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  date: {
    width: "12%",
    alignItems: "center",
    marginVertical: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateSubtext: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
  },
});
