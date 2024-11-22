import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import NavBackground from '../images/navBar_background.svg';
import HomeIcon from '../images/navBar_home.svg';
import HomeIconActive from '../images/navBar_home_active.svg';
import DmIcon from '../images/navBar_dm.svg';
import CameraIcon from '../images/navBar_camera.svg';
import RankIcon from '../images/navBar_rank.svg';
import RankIconActive from '../images/navBar_rank_active.svg';
import ProfileIcon from '../images/navBar_profile.svg';
import ProfileIconActive from '../images/navBar_profile_active.svg';

const {width, height} = Dimensions.get('window');

const tabs = [
  {
    name: 'Home',
    routes: ['MainSocial', 'MainEdu'],
    icon: HomeIcon,
    activeIcon: HomeIconActive,
  },
  {name: 'DmList', routes: ['DmList'], icon: DmIcon},
  {name: 'Camera', routes: ['Camera'], icon: CameraIcon},
  {name: 'Rank', routes: ['Rank'], icon: RankIcon, activeIcon: RankIconActive},
  {
    name: 'Profile',
    routes: ['MyProfile'],
    icon: ProfileIcon,
    activeIcon: ProfileIconActive,
  },
];

const NavBar = ({navigation}) => {
  const route = useRoute(); // 현재 활성화된 경로 정보 가져오기
  const [activeTab, setActiveTab] = useState('');

  useFocusEffect(() => {
    // 현재 경로에 해당하는 탭 찾기
    const active =
      tabs.find(tab => tab.routes.includes(route.name))?.name || '';
    setActiveTab(active); // 현재 활성화된 탭 업데이트
  });

  return (
    <View style={styles.box}>
      <View style={styles.element}>
        <View style={styles.overlapGroup}>
          <NavBackground style={styles.navBack} />
          {tabs.map(tab => (
            <Pressable
              key={tab.name}
              style={styles[tab.name.toLowerCase()]}
              onPress={() => {
                setActiveTab(tab.name);
                navigation.navigate(tab.routes[0]); // 첫 번째 경로로 이동
              }}>
              {activeTab === tab.name && tab.activeIcon ? (
                <tab.activeIcon />
              ) : (
                <tab.icon />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: height * 0.12,
    width: '100%',
  },
  element: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  overlapGroup: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  profile: {
    height: height * 0.03,
    width: height * 0.03,
    position: 'absolute',
    left: width * 0.85,
    top: height * 0.02,
  },
  home: {
    height: height * 0.03,
    width: height * 0.03,
    position: 'absolute',
    left: width * 0.1,
    top: height * 0.02,
  },
  camera: {
    height: height * 0.06,
    width: height * 0.06,
    position: 'absolute',
    left: width * 0.5 - height * 0.03,
    top: height * 0.01,
  },
  rank: {
    height: height * 0.03,
    width: height * 0.03,
    position: 'absolute',
    left: width * 0.68,
    top: height * 0.02,
  },
  dm: {
    height: height * 0.03,
    width: height * 0.03,
    position: 'absolute',
    left: width * 0.3,
    top: height * 0.02,
  },
  navBack: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default NavBar;
