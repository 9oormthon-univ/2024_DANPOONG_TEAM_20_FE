import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// WebSocket 연결 및 메시지 수신 함수
const useWebSocket = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (roomId) {
      const socketInstance = new WebSocket(`wss://mixmix2.store/chat/${roomId}`);
      socketInstance.onopen = () => {
        console.log("WebSocket 연결 성공");
      };
      socketInstance.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      socketInstance.onerror = (error) => {
        console.error("WebSocket 오류:", error);
      };
      socketInstance.onclose = (event) => {
        console.log("WebSocket 연결 종료:", event);
      };

      setSocket(socketInstance);

      return () => {
        socketInstance.close();
      };
    }
  }, [roomId]);

  const sendMessage = (user, longValue, messageContent) => {
    if (socket && messageContent) {
      // 메시지 포맷: string long string
      const formattedMessage = `${user}:${longValue}:${messageContent}`;
  
      // 메시지를 문자열로 변환하여 전송
      socket.send(formattedMessage);
  
      // 로컬 상태에도 문자열로 저장
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: formattedMessage }
      ]);
    }
  };

  return { messages, sendMessage };
};

// 채팅방 목록 컴포넌트
const DmList = () => {
  const [roomId, setRoomId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [translatedMessage, setTranslatedMessage] = useState("");

  // WebSocket hook 사용
  const { messages, sendMessage } = useWebSocket(roomId);

  // POST 요청 함수
  const handlePostRequest = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      const response = await fetch("https://mixmix2.store/api/chat-rooms", {
        method: "POST",
        headers:  {
        "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          roomName: "test room",
          toMemberId: 1 ,
        }),
      });
      const data = await response.json();
      setResponseData(data);
      console.log("POST Response:", data);
    } catch (error) {
      console.error("POST Request Error:", error);
    }
  };
  // 번역 요청 함수
  const handleTranslate = async () => {
    if (!messageInput.trim()) return;
  
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log("Access Token:", accessToken);
      console.log("메세지인풋: ", messageInput);
  
      const response = await fetch("https://mixmix2.store/api/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: messageInput,
          targetLang: "KO",
        }),
      });
      console.log("응답 상태: ", response.status);  // 응답 상태 코드 확인
  
      const result = await response.json();
      console.log("번역 API 응답 데이터: ", result);  // 응답 데이터 로그
  
      if (result.translations && result.translations.length > 0) {
        setTranslatedMessage(result.translations[0].text); // 번역된 메시지 설정
      } else {
        console.log("번역 결과 없음");
      }
    } catch (error) {
      console.error("번역 오류:", error);
    }
  };  

  // GET 요청 함수
  const handleGetRequest = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch("https://mixmix2.store/api/chat-rooms", {
        method: "GET",
        headers:  {
        "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }});
      const data = await response.json();
      setResponseData(data);
      console.log("GET Response:", data);
    } catch (error) {
      console.error("GET Request Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>채팅방 API 요청</Text>

      {/* 채팅방 목록 */}
      <View style={styles.chatList}>
        <Button title="채팅방 2" onPress={() => setRoomId(2)} />
        <Button title="채팅방 3" onPress={() => setRoomId(3)} />
      </View>

      {/* 채팅방 ID 표시 */}
      {roomId && <Text style={styles.roomIdText}>현재 채팅방 ID: {roomId}</Text>}

      {/* 받은 메시지 목록 */}
      {messages.length > 0 && (
        <ScrollView style={styles.messagesContainer}>
          <Text style={styles.responseText}>받은 메시지:</Text>
          {messages.map((msg, index) => (
            <Text key={index} style={styles.messageText}>{msg.content}</Text>
          ))}
        </ScrollView>
      )}

      {/* 텍스트 입력창 */}
      <MessageInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        sendMessage={sendMessage}
      />
      {/* 번역 버튼 */}
      <Button title="번역" onPress={handleTranslate} />

      {/* 번역된 메시지 */}
      {translatedMessage ? (
        <Text style={styles.translatedText}>번역된 메시지: {translatedMessage}</Text>
      ) : null}

      {/* 응답 데이터 */}
      {responseData && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>응답 데이터:</Text>
          <Text style={styles.responseData}>{JSON.stringify(responseData, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

// 메시지 입력 컴포넌트
const MessageInput = ({ messageInput, setMessageInput, sendMessage }) => {
  const handleChange = (text) => setMessageInput(text);

  const handleSend = () => {
    // 예시로 사용자 이름 "hyeon", long 값 2, 그리고 입력된 메시지를 전송
    sendMessage("hyeon", 2, messageInput);
    setMessageInput(""); // 전송 후 입력창 비우기
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={messageInput}
        onChangeText={handleChange}
        placeholder="메시지를 입력하세요"
      />
      <Button title="전송" onPress={handleSend} />
    </View>
  );
};

// 스타일링
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chatList: {
    marginBottom: 20,
  },
  roomIdText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontWeight: "600",
  },
  messagesContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    maxHeight: 200,
    overflow: "scroll",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 10,
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    maxHeight: 200,
    overflow: "scroll",
  },
  responseText: {
    fontSize: 16,
    fontWeight: "600",
  },
  responseData: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
});

export default DmList;