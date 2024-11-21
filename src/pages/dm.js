import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Pressable } from "react-native";
import { initializeWebSocket, sendMessage } from "../utils/websocket";
import AsyncStorage from '@react-native-async-storage/async-storage'; // 추가: 사용자 정보 가져오기

const Dm = ({ route }) => {
  const { recipientName } = route?.params || {}; // 안전하게 파라미터 확인
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // 로그인된 사용자 정보 가져오기
  useEffect(() => {
    const getUserInfo = async () => {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo)); // 사용자 정보 설정
      } else {
        console.error("사용자 정보가 없습니다.");
      }
    };

    getUserInfo();
  }, []);

  // WebSocket 초기화 및 메시지 가져오기
  useEffect(() => {
    if (!userInfo || !recipientName) return; // 사용자 정보와 recipientName이 없으면 WebSocket 연결 안 함

    const ws = initializeWebSocket(userInfo.nickname); // 사용자의 카카오 닉네임을 ID로 사용
    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    // 기존 메시지 불러오기 (recipientName 사용)
    fetch(`https://mixmix2.store/api/chat-rooms?recipientName=${recipientName}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("메시지 로드 오류:", err));

    return () => ws.close(); // 컴포넌트 언마운트 시 WebSocket 연결 닫기
  }, [userInfo, recipientName]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        sender: userInfo?.nickname, // 현재 사용자 카카오 닉네임
        recipient: recipientName, // 수신자 이름
        content: messageInput,
        timestamp: new Date().toISOString(),
      };

      sendMessage(newMessage); // WebSocket을 통해 메시지 전송
      setMessages((prev) => [...prev, newMessage]); // 로컬에서 메시지 추가
      setMessageInput(""); // 입력 필드 초기화
    }
  };

  if (!recipientName) {
    return (
      <View style={styles.container}>
        <Text>수신자 이름이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={item.sender === userInfo?.nickname ? styles.myMessage : styles.theirMessage}
          >
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
    padding: 20,
  },
  myMessage: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "#d1f5d3",
    marginVertical: 5,
    borderRadius: 10,
  },
  theirMessage: {
    alignSelf: "flex-start",
    padding: 10,
    backgroundColor: "#f1f1f1",
    marginVertical: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Dm;
