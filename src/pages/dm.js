import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/navBar';

function DmHeader() {
  return (
    <View>
      <Text style={styles.title}>내 쪽지</Text>
    </View>
  );
}

const Dm = ({navigation}) => {
  const [dmData, setDmData] = useState(null);

  const handleGetRequest = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://mixmix2.store/api/chat-rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDmData(data.data.chatRoomResDtos); // 가져온 데이터를 상태에 저장
        console.log('dmData:', data.data.chatRoomResDtos);
      } else {
        console.error('데이터 요청 실패', response.status);
      }
    } catch (error) {
      console.error('프로필 데이터 불러오기 오류:', error);
    }
  };

  useEffect(() => {
    handleGetRequest();
  }, []);

  return (
    <View style={styles.container}>
      <DmHeader />
      <View style={styles.messageListContainer}>
        {dmData ? (
          dmData.map(room => (
            <DmItem
              key={room.roomId}
              name={room.name}
              memberImage={room.memberImage}
              message={room.recentMessage || 'No recent messages'}
              time="Just now" // 시간을 placeholder로 설정
              unreadNotification={room.unreadNotification}
              roomId={room.roomId} // roomId 전달
              navigation={navigation} // navigation 전달
            />
          ))
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <NavBar navigation={navigation} />
    </View>
  );
};
function DmItem({
  memberImage,
  name,
  message,
  time,
  unreadNotification,
  roomId,
  navigation,
}) {
  const handlePress = () => {
    navigation.navigate('DmChat', {roomId}); // dmChat 화면으로 이동
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.messageItem}>
        <View style={styles.messageContent}>
          <View style={styles.userInfo}>
            <Image
              resizeMode="contain"
              source={{uri: memberImage}}
              style={styles.avatar}
            />
            <View style={styles.textContent}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{name}</Text>
              </View>
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{time}</Text>
            {unreadNotification > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{unreadNotification}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  // styles for DmHeader
  header: {
    width: '100%',
    paddingLeft: width * 0.05,
    paddingRight: width * 0.03,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.01,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  title: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: Math.max(width * 0.04, 16), // 최소 16px 이상 유지
    fontFamily: 'Pretendard-SemiBold',
    marginTop: height * 0.02,
    textAlign: 'center',
  },

  // styles for DmItem
  messageItem: {
    height: height * 0.09, // 상대적으로 9% 높이
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  messageContent: {
    width: '100%',
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    paddingBottom: height * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'column',
    justifyContent: 'center',
    gap: height * 0.005,
    overflow: 'hidden',
  },
  nameContainer: {
    flexDirection: 'row',
    gap: width * 0.02,
    marginTop: height * 0.005,
  },
  nameWrapper: {
    flexDirection: 'row',
    gap: width * 0.01,
  },
  name: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: Math.max(width * 0.04, 16),
    fontFamily: 'Pretendard-Medium',
  },
  country: {
    fontSize: Math.max(width * 0.03, 13),
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(0, 0, 0, 1)',
  },
  message: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: Math.max(width * 0.03, 13),
    fontFamily: 'Pretendard-Regular',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: Math.max(width * 0.03, 12),
    color: '#000',
  },
  unreadBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD4632',
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: width * 0.04,
  },
  unreadCount: {
    fontSize: Math.max(width * 0.025, 10),
    color: '#fff',
  },

  container: {
    flex: 1, // 전체 화면을 차지하도록 설정
    flexDirection: 'column',
    justifyContent: 'space-between', // 상단과 하단에 컴포넌트 배치
    backgroundColor: '#fff',
  },
  messageListContainer: {
    flex: 1, // 남은 공간을 채우도록 설정
    flexDirection: 'column',
    gap: height * 0.015,
    alignItems: 'stretch',
    paddingBottom: height * 0.02,
    paddingTop: height * 0.02,
  },
});

export default Dm;
