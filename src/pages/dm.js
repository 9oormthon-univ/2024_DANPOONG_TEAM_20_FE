import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import NavBar from '../components/navBar';

const {width, height} = Dimensions.get('window');

const Dm = ({navigation}) => {
  // 더미 데이터
  const dmData = [
    {
      id: 1,
      memberImage: require('../images/dummy_profile1.jpg'),
      name: 'jamie 🇩🇪',
      message: '뭐해?',
      time: '3분 전',
      unreadNotification: 2,
    },
    {
      id: 2,
      memberImage: require('../images/dummy_profile2.jpg'),
      name: 'nammy 🇯🇵',
      message: '어제 그렇게 하기로 했어',
      time: '10분 전',
      unreadNotification: 2,
    },
    {
      id: 3,
      memberImage: require('../images/dummy_profile3.jpg'),
      name: 'sihyun 🇫🇷',
      message: '응 내일 봐!',
      time: '1시간 전',
      unreadNotification: 2,
    },
    {
      id: 4,
      memberImage: require('../images/dummy_profile4.jpg'),
      name: 'kibbeum 🇰🇷',
      message: '조심히 들어가',
      time: '4시간 전',
      unreadNotification: 0,
    },
    {
      id: 5,
      memberImage: require('../images/dummy_profile1.jpg'),
      name: 'nao 🇯🇵',
      message: '재밌겠다',
      time: '6시간 전',
      unreadNotification: 0,
    },
    {
      id: 6,
      memberImage: require('../images/dummy_profile2.jpg'),
      name: 'sanas 🇫🇷',
      message: '재밌겠다',
      time: '6시간 전',
      unreadNotification: 0,
    },
  ];

  const DmItem = ({memberImage, name, message, time, unreadNotification}) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('DmChat')}>
        <View style={styles.messageItem}>
          <Image source={memberImage} style={styles.avatar} />
          <View style={styles.textContent}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.message}>{message}</Text>
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 쪽지</Text>
      </View>
      <ScrollView contentContainerStyle={styles.messageListContainer}>
        {dmData.map(room => (
          <DmItem
            key={room.id}
            memberImage={room.memberImage}
            name={room.name}
            message={room.message}
            time={room.time}
            unreadNotification={room.unreadNotification}
          />
        ))}
      </ScrollView>
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  messageListContainer: {
    paddingHorizontal: width * 0.05,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.04,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
  },
  message: {
    fontSize: width * 0.035,
    color: '#666',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: width * 0.035,
    color: '#888',
  },
  unreadBadge: {
    marginTop: height * 0.005,
    backgroundColor: '#FD4632',
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
});

export default Dm;
