import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Pressable } from "react-native";
import { initializeWebSocket, sendMessage } from "../utils/websocket";

const Dm = ({ route }) => {
  const { recipientId, recipientName } = route.params; // 카카오 사용자 ID 사용
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    // WebSocket 초기화
    const ws = initializeWebSocket("YourKakaoUserId"); // 자신의 카카오 사용자 ID

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    // 기존 메시지 불러오기
    fetch(`https://mixmix2.store/api/chat-rooms?recipientId=${recipientId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("메시지 로드 오류:", err));

    return () => ws.close(); // 컴포넌트 언마운트 시 WebSocket 닫기
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        sender: "YourKakaoUserId", // 현재 사용자 카카오 ID
        recipient: recipientId, // 상대방 카카오 ID
        content: messageInput,
        timestamp: new Date().toISOString(),
      };

      sendMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput(""); // 입력창 비우기
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.sender === "YourKakaoUserId" ? styles.myMessage : styles.theirMessage}>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="메시지를 입력하세요"
        />
        <Pressable style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
},
  myMessage: { 
    alignSelf: "flex-end", 
    padding: 10, 
    backgroundColor: "#d1f5d3", 
    marginVertical: 5, 
    borderRadius: 10 
},
  theirMessage: { 
    alignSelf: "flex-start", 
    padding: 10, 
    backgroundColor: "#f1f1f1", 
    marginVertical: 5, 
    borderRadius: 10 
},
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 10 
},
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10, 
    padding: 10 
},
  sendButton: { 
    marginLeft: 10, 
    backgroundColor: "#007BFF", 
    padding: 10, 
    borderRadius: 10 
},
  sendButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
},
});

export default Dm;
