import React from 'react';
import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import NavBackground from '../images/navBar_background.svg';
import ProfileIcon from '../images/navBar_profile.svg';
import CameraIcon from '../images/navBar_camera.svg';
import DmIcon from '../images/navBar_dm.svg';
import HomeIcon from '../images/navBar_home.svg';
import RankIcon from '../images/navBar_rank.svg';

const {width, height} = Dimensions.get('window');

const NavBar = ({navigation}) => {
  return (
    <View style={styles.box}>
      <View style={styles.element}>
        <View style={styles.overlapGroup}>
          <NavBackground style={styles.navBack} />
          {/* HomeIcon: MainSocial.js로 이동 */}
          <Pressable
            style={styles.home}
            onPress={() => navigation.navigate('MainSocial')}>
            <HomeIcon />
          </Pressable>
          {/* DmIcon: Dm.js로 이동 */}
          <Pressable
            style={styles.dm}
            onPress={() => navigation.navigate('Dm')}>
            <DmIcon />
          </Pressable>
          {/* CameraIcon: Camera.js로 이동 */}
          <Pressable
            style={styles.camera}
            onPress={() => navigation.navigate('Camera')}>
            <CameraIcon />
          </Pressable>
          {/* RankIcon: Rank.js로 이동 */}
          <Pressable
            style={styles.rank}
            onPress={() => navigation.navigate('Rank')}>
            <RankIcon />
          </Pressable>
          {/* ProfileIcon: MyProfile.js로 이동 */}
          <Pressable
            style={styles.profile}
            onPress={() => navigation.navigate('MyProfile')}>
            <ProfileIcon />
          </Pressable>
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