import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import BackIcon from '../images/back.svg'; // back.svg 가져오기
import TranIcon from '../images/tran.svg'; // tran.svg 가져오기
import TranBlackIcon from '../images/tran_black.svg'; // tran_black.svg 가져오기
import SendIcon from '../images/sendComment.svg'; // send.svg 가져오기

const {width, height} = Dimensions.get('window');

const DmChat = ({navigation}) => {
  // 더미 데이터
  const chatData = [
    {
      id: 1,
      isMe: false,
      text: '안녕! 나는 호주에서 왔어! 나도 혼자 홍대에 살고 있는데 같이 한 번 만나지 않을래?',
      time: '4시간 전',
      translated: true, // 번역 여부
    },
    {
      id: 2,
      isMe: true,
      text: '반가워요 ㅎㅎ 너무 좋죠!',
      time: '4시간 전',
      translated: true,
    },
    {
      id: 3,
      isMe: false,
      text: "I'm glad to see you.",
      time: '4시간 전',
      translated: false,
    },
    {
      id: 4,
      isMe: true,
      text: "Why don't we meet tomorrow?",
      time: '4시간 전',
      translated: false,
    },
    {
      id: 5,
      isMe: false,
      text: 'That sounds great!',
      time: '4시간 전',
      translated: false,
    },
    {
      id: 6,
      isMe: true,
      text: 'Good. See u tomorrow!!',
      time: '4시간 전',
      translated: false,
    },
  ];

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      // 메시지 전송 로직 (여기서는 더미 데이터를 사용)
      chatData.push({
        id: chatData.length + 1,
        isMe: true,
        text: message,
        time: '방금 전',
        translated: false,
      });
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={width * 0.06} height={width * 0.06} />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image
            source={require('../images/dummy_profile1.jpg')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>jamie</Text>
        </View>
      </View>

      {/* 채팅 내용 */}
      <ScrollView style={styles.chatContainer}>
        {chatData.map(chat => (
          <View
            key={chat.id}
            style={[
              styles.messageContainer,
              chat.isMe ? styles.myMessage : styles.otherMessage,
            ]}>
            <Text style={styles.messageText}>{chat.text}</Text>
            <View style={styles.messageInfo}>
              <Text style={styles.messageTime}>{chat.time}</Text>
              {chat.translated ? (
                <TranIcon width={width * 0.05} height={width * 0.05} />
              ) : (
                <TranBlackIcon width={width * 0.05} height={width * 0.05} />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 입력창 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="새로운 친구와 소통해봐요..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <SendIcon width={width * 0.15} height={width * 0.15} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.03,
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginRight: width * 0.03,
  },
  profileName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#000',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: width * 0.04,
  },
  messageContainer: {
    marginVertical: height * 0.01,
    maxWidth: '70%',
    padding: width * 0.03,
    borderRadius: width * 0.03,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: width * 0.04,
    color: '#000',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  messageTime: {
    fontSize: width * 0.03,
    color: '#aaa',
    marginRight: width * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: width * 0.02,
    padding: width * 0.03,
    fontSize: width * 0.04,
    marginRight: width * 0.03,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DmChat;
