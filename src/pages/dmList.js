import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DmList = () => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    fetch("https://mixmix2.store")
      .then((res) => res.json())
      .then((data) => setChatList(data))
      .catch((err) => console.error("로드 오류:", err));
  }, []);

  return (
    <View style={styles.container}>
      <MessageHeader />
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate("Dm", {
                recipientId: item.id,
                recipientName: item.name,
              })
            }
          >
            <MessageItem
              avatar={item.avatar}
              name={item.name}
              country={item.country}
              message={item.lastMessage}
              time={item.time}
              unreadCount={item.unreadCount}
            />
          </Pressable>
        )}
      />
    </View>
  );
};

const MessageItem = ({ avatar, name, country, message, time, unreadCount }) => {
  return (
    <View style={styles.messageItem}>
      <View style={styles.messageContent}>
        <View style={styles.userInfo}>
          <Image
            resizeMode="contain"
            source={{ uri: avatar }}
            style={styles.avatar}
          />
          <View style={styles.textContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.country}>{country}</Text>
            </View>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
        <View style={styles.timeSection}>
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
};

const MessageHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>채팅 목록</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  messageItem: {
    display: "flex",
    height: 77,
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  messageContent: {
    display: "flex",
    marginTop: 9,
    gap: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 14,
    width: "100%",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  textContent: {
    flex: 1,
    display: "flex",
    gap: 8,
    marginTop: 7,
  },
  nameContainer: {
    display: "flex",
    gap: 7,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 2,
  },
  name: {
    fontWeight: "600",
    color: "#1D1D1F",
  },
  country: {
    fontWeight: "400",
    fontSize: 12,
    color: "#63666A",
  },
  message: {
    fontWeight: "400",
    fontSize: 14,
    color: "#63666A",
  },
  timeSection: {
    display: "flex",
    gap: 4,
    justifyContent: "space-between",
  },
  time: {
    fontWeight: "400",
    fontSize: 14,
    color: "#8E8F90",
  },
  unreadBadge: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 7,
    backgroundColor: "#0061F2",
    width: 20,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
  },
  header: {
    display: "flex",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});

export default DmList;
