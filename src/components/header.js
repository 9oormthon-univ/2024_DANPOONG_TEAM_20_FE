import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useRoute} from '@react-navigation/native';
import LogoIcon from '../images/logo_text.svg'; // 새로 만든 LogoIcon 컴포넌트
import NotificationIcon from '../images/notification.svg'; // 알림 아이콘

const Header = ({navigation}) => {
  const route = useRoute(); // 현재 활성화된 라우트 정보 가져오기
  const [activeTab, setActiveTab] = useState('Social'); // 기본 활성화 탭

  // 라우트가 변경될 때마다 activeTab 업데이트
  useEffect(() => {
    if (route.name === 'MainSocial') {
      setActiveTab('Social');
    } else if (route.name === 'MainEdu') {
      setActiveTab('Edu');
    }
  }, [route.name]);

  return (
    <View style={styles.headerContainer}>
      {/* 상단 로고와 알림 버튼 */}
      <View style={styles.topBar}>
        {/* 로고 추가 */}
        <LogoIcon width={120} height={24} />
        <Pressable style={styles.notification} onPress={() => navigation.navigate('Notification')}>
          <NotificationIcon width={24} height={24} />
        </Pressable>
      </View>

      {/* 아래 탭 네비게이션 */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'Social' && styles.activeTabSocial]}
          onPress={() => navigation.navigate('MainSocial')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Social' && styles.activeTabSocialText,
            ]}>
            Social
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'Edu' && styles.activeTabEdu]}
          onPress={() => navigation.navigate('MainEdu')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Edu' && styles.activeTabEduText,
            ]}>
            Edu
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notification: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabSocial: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF6152',
  },
  activeTabEdu: {
    borderBottomWidth: 3,
    borderBottomColor: '#7DC353',
  },
  tabText: {
    fontSize: 16,
    color: '#9e9e9e',
  },
  activeTabSocialText: {
    color: '#FF6152',
    fontWeight: 'bold',
  },
  activeTabEduText: {
    color: '#7DC353',
    fontWeight: 'bold',
  },
});

export default Header;
