import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// WebSocket 연결 및 메시지 전송 함수
const useWebSocket = roomId => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (roomId) {
      const socketInstance = new WebSocket(
        `wss://mixmix2.store/chat/${roomId}`,
      );
      socketInstance.onopen = () => {
        console.log('WebSocket 연결 성공');
      };
      socketInstance.onmessage = event => {
        const message = JSON.parse(event.data);
        setMessages(prevMessages => [...prevMessages, message]);
      };
      socketInstance.onerror = error => {
        console.error('WebSocket 오류:', error);
      };
      socketInstance.onclose = event => {
        console.log('WebSocket 연결 종료:', event);
      };

      setSocket(socketInstance);

      return () => {
        socketInstance.close();
      };
    }
  }, [roomId]);

  const sendMessage = (user, longValue, messageContent) => {
    if (socket && messageContent) {
      const formattedMessage = `${user}:${longValue}:${messageContent}`;
      socket.send(formattedMessage);
      setMessages(prevMessages => [
        ...prevMessages,
        {content: formattedMessage},
      ]);
    }
  };

  return {messages, sendMessage};
};

// 채팅 UI 컴포넌트
const DmChat = () => {
  const [roomId, setRoomId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [translatedMessage, setTranslatedMessage] = useState('');
  const {messages, sendMessage} = useWebSocket(roomId);

  // 번역 요청 함수
  const handleTranslate = async () => {
    if (!messageInput.trim()) return;

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://mixmix2.store/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: messageInput,
          targetLang: 'EN',
        }),
      });

      const result = await response.json();
      if (result.translations?.length > 0) {
        const translatedText = result.translations[0]?.text || '번역 결과 없음';
        setTranslatedMessage(translatedText);
      } else {
        console.log('번역 결과 없음');
      }
    } catch (error) {
      console.error('번역 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>채팅방</Text>

      {/* 채팅방 선택 */}
      <View style={styles.chatList}>
        <Button title="채팅방 2" onPress={() => setRoomId(2)} />
        <Button title="채팅방 3" onPress={() => setRoomId(3)} />
      </View>

      {/* 현재 채팅방 표시 */}
      {roomId && (
        <Text style={styles.roomIdText}>현재 채팅방 ID: {roomId}</Text>
      )}

      {/* 메시지 목록 */}
      <ScrollView style={styles.messagesContainer}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Text key={index} style={styles.messageText}>
              {msg.content}
            </Text>
          ))
        ) : (
          <Text style={styles.noMessages}>메시지가 없습니다</Text>
        )}
      </ScrollView>

      {/* 메시지 입력 폼 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="메시지를 입력하세요"
        />
        <Button
          title="전송"
          onPress={() => sendMessage('hyeon', 2, messageInput)}
        />
      </View>

      {/* 번역 버튼 */}
      <Button title="번역" onPress={handleTranslate} />

      {/* 번역된 메시지 표시 */}
      {translatedMessage && (
        <Text style={styles.translatedText}>
          번역된 메시지: {translatedMessage}
        </Text>
      )}
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roomIdText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 8,
  },
  noMessages: {
    fontSize: 16,
    color: '#aaa',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  translatedText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#333',
    marginTop: 10,
  },
});

export default DmChat;
