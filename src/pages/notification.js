import React from 'react';
import { View, StyleSheet, Text, Pressable, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../images/back.svg'; // 뒤로가기 아이콘
import NotificationDot from '../images/notificationDot.svg'; //헤더에 알림 옆에 동그란 점

const notificationData = {
  today: [
    {
      id: 1,
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/a034ac6e0a24ff5d45762e8dbaf2df30cb14c336271177d4ad367065e3a234c8?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b",
      username: "julie 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "3시간",
      postImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/6bdb9721d0dea0e4d45dfe6d0cc82c0e89fc50281f6f0cb9475dda0dc9cb1ee3?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b"
    }
  ],
  yesterday: [
    {
      id: 2,
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/7a17f4347ce1dcf87bca167f54b8e937b6ee4bcff3e159c0d798ccacf46bfb62?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b",
      username: "julie 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "19시간",
      postImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/54450de8839cdff4d66fe4ef39c146e6fb7b737ab8a9d165b67e278699ff821e?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b"
    }
  ],
  recentWeek: [
    {
      id: 3,
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/3b6983fcd3f8445069b7a6f3d4a65adab9c1d0f660502341c62cb2bdb4e48f6a?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b",
      username: "kibbeum 🇰🇷",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "2일",
      postImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/fd32b2fa08dd8112507cd25f0852ebed743a0e9307aaeebad89b3f5329c928e6?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b"
    },
    {
      id: 4,
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/b2698c6caf5e0bc0bf16100296bc2aa77d5ea2d7d78370cee62fae41ee357426?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b",
      username: "tommy 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "3일",
      postImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/80824de333c79be9b093c4cb2c1d678cb4153c0a57cffaa972bf3e9f3bd32206?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b"
    },
    {
      id: 5,
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/31afb2e571c893f66edc3e89f894b353e1be787702c1256538116b832b7ec59a?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b",
      username: "julie0201 🇩🇪",
      message: "님이 회원님의 게시물을 좋아합니다.",
      timeAgo: "3일",
      postImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/d1635d46970cfc187072e4a3fde6c7717b94296639dc04c76f5291aecb801394?placeholderIfAbsent=true&apiKey=45195689119146fb9f36ffe6a1d7e50b"
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
