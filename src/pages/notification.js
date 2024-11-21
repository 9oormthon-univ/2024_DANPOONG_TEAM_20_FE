import React from 'react';
import { View, StyleSheet, Text, Pressable, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../images/back.svg'; // 뒤로가기 아이콘
import NotificationDot from '../images/notificationDot.svg'; //헤더에 알림 옆에 동그란 점

const notificationData = {
  today: [
    {
      id: 1,
      avatar: "https://via.placeholder.com/40",
      username: "julie 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "3시간",
      postImage: "https://via.placeholder.com/40"
    }
  ],
  yesterday: [
    {
      id: 2,
      avatar: "https://via.placeholder.com/40",
      username: "julie 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "19시간",
      postImage: "https://via.placeholder.com/40"
    }
  ],
  recentWeek: [
    {
      id: 3,
      avatar: "https://via.placeholder.com/40",
      username: "kibbeum 🇰🇷",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "2일",
      postImage: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      avatar: "https://via.placeholder.com/40",
      username: "tommy 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "3일",
      postImage: "https://via.placeholder.com/40",
    },
    {
      id: 5,
      avatar: "https://via.placeholder.com/40",
      username: "julie0201 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "3일",
      postImage: "https://via.placeholder.com/40",
    }
  ]
};

const NotificationItem = ({ avatar, username, message, timeAgo, postImage }) => {
  return (
    <View style={styles.notificationContainer}>
      <Image
        resizeMode="contain"
        source={{ uri: avatar }}
        style={styles.avatarImage}
      />
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{username} {message}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{timeAgo}</Text>
        <Image
          resizeMode="contain"
          source={{ uri: postImage }}
          style={styles.postImage}
        />
      </View>
    </View>
  );
};


const NotificationSection = ({ title, notifications }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem {...item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};


const Notification = () => {
  const navigation = useNavigation(); // navigation 객체 가져오기

  return (
    <View style={styles.totalCon}>
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <BackIcon width={24} height={24} />
        </Pressable>
        <Text style={styles.notiText}>알림</Text>
        <NotificationDot style={styles.dot} />
      </View>

      <FlatList
        data={['today', 'yesterday', 'recentWeek']}
        renderItem={({ item }) => (
          <NotificationSection
            title={item === 'today' ? '오늘' : item === 'yesterday' ? '어제' : '최근 7일'}
            notifications={notificationData[item]}
          />
        )}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  totalCon: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  notiText: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 24,
    color: "#000",
    marginLeft: 16,
  },
  dot: {
    marginLeft: 4,
    marginBottom: 16,
    justifyContent: "center",
  },
  iconButton: {
    marginRight: 8,
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 18,
    color: "#000",
    marginLeft: 16,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    color: "#000",
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timeText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: "#888",
  },
  postImage: {
    width: 60,
    height: 60,
    marginTop: 8,
    borderRadius: 4,
  },
});

export default Notification;
