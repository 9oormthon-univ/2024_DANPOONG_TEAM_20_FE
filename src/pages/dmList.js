import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
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
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.chatItem}
            onPress={() => navigation.navigate("Dm", { recipientId: item.id, recipientName: item.name })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  chatItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ccc" 
  },
  name: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  lastMessage: { 
    fontSize: 14, 
    color: "#777" 
  },
});

export default DmList;
