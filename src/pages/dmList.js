import * as React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import NavBar from '../components/navBar';

function DmHeader() {
  return (
      <View>
      <Text style={styles.title}>내 쪽지</Text>
    </View>
  );
}

// 더미데이터
const messageData = [
  {
    id: 1,
    profile: "https://via.placeholder.com/40",
    name: "julie",
    country: "🇩🇪",
    message: "뭐해?",
    time: "3분 전",
    unreadCount: 2
  },
  {
    id: 2,
    profile: "https://via.placeholder.com/40",
    name: "nammy",
    country: "🇯🇵",
    message: "어제 그렇게 했어",
    time: "10분 전",
    unreadCount: 2
  },
  {
    id: 3,
    profile: "https://via.placeholder.com/40",
    name: "sihyun",
    country: "🇰🇷",
    message: "응 내일 봐!",
    time: "1시간 전",
    unreadCount: 2
  },
  {
    id: 4,
    profile: "https://via.placeholder.com/40",
    name: "nammy",
    country: "🇳🇿",
    message: "어떻게 지내?",
    time: "1시간 전",
    unreadCount: 2
  },
  {
    id: 5,
    profile: "https://via.placeholder.com/40",
    name: "kibbeum",
    country: "🇰🇷",
    message: "조심히 들어가",
    time: "2시간 전",
    lastMessageTime: "4시간 전"
  },
  {
    id: 6,
    profile: "https://via.placeholder.com/40",
    name: "nao",
    country: "🇯🇵",
    message: "재밌겠다",
    time: "2시간 전",
    lastMessageTime: "6시간 전"
  },
  {
    id: 7,
    profile: "https://via.placeholder.com/40",
    name: "sanas",
    country: "🇬🇷",
    message: "재밌겠다",
    time: "3시간 전",
    lastMessageTime: "6시간 전"
  },
  {
    id: 8,
    profile: "https://via.placeholder.com/40",
    name: "tommy",
    country: "🇩🇪",
    message: "재밌겠다",
    time: "3시간 전",
    lastMessageTime: "6시간 전"
  }
];

function DmItem({ profile, name, country, message, time, unreadCount, lastMessageTime }) {
  return (
    <View style={styles.messageItem}>
      <View style={styles.messageContent}>
        <View style={styles.userInfo}>
          <Image
            resizeMode="contain"
            source={{ uri: profile }}
            style={styles.avatar}
          />
          <View style={styles.textContent}>
            <View style={styles.nameContainer}>
              <View style={styles.nameWrapper}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.country}>{country}</Text>
              </View>
            </View>
            <Text style={styles.message}>{message}</Text>
            {lastMessageTime && (
              <Text style={styles.lastMessageTime}>{lastMessageTime}</Text>
            )}
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{time}</Text>
          {unreadCount && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}


export default function DmList({ navigation }) {
  return (
    <View style={styles.container}>
      <DmHeader />
      <View style={styles.messageListContainer}>
        {messageData.map((message) => (
          <DmItem key={message.id} {...message} />
        ))}
      </View>
      <NavBar navigation={navigation} />
    </View>
    
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  // styles for DmHeader
  header: {
    width: "100%",
    paddingLeft: width * 0.05,
    paddingRight: width * 0.03,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.01,
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: Math.max(width * 0.04, 16), // 최소 16px 이상 유지
    marginTop: height * 0.02,
    textAlign: "center",

  },

  // styles for DmItem
  messageItem: {
    height: height * 0.09, // 상대적으로 9% 높이
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  messageContent: {
    width: "100%",
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    paddingBottom: height * 0.03,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.04,
    paddingBottom: height * 0.015,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    marginRight: width * 0.03,
    borderRadius: 999, // 원형 유지
  },
  textContent: {
    flexDirection: "column",
    justifyContent: "center",
    gap: height * 0.005,
    overflow: "hidden",
  },
  nameContainer: {
    flexDirection: "row",
    gap: width * 0.02,
    marginTop: height * 0.005,
  },
  nameWrapper: {
    flexDirection: "row",
    gap: width * 0.01,
  },
  name: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: Math.max(width * 0.04, 16),
  },
  country: {
    fontSize: Math.max(width * 0.03, 13),
    color: "rgba(0, 0, 0, 1)",
  },
  message: {
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: Math.max(width * 0.03, 13),
  },
  lastMessageTime: {
    fontSize: Math.max(width * 0.025, 11),
    color: "#a9a9a9",
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: Math.max(width * 0.03, 12),
    color: "#000",
  },
  unreadBadge: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FD4632",
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: width * 0.04,
  },
  unreadCount: {
    fontSize: Math.max(width * 0.025, 10),
    color: "#fff",
  },

  // styles for container
  container: {
    flexDirection: "column",
    gap: height * 0.01,
    alignItems: "stretch",
    paddingBottom: height * 0.02,
    paddingTop: height * 0.02,
  },
  messageListContainer: {
    flexDirection: "column",
    gap: height * 0.015,
    alignItems: "stretch",
    paddingBottom: height * 0.02,
    paddingTop: height * 0.02,
  },
});