import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavBackground from '../images/navBar_background.svg';
import ProfileIcon from '../images/navBar_profile.svg';
import CameraIcon from '../images/navBar_camera.svg';
import DmIcon from '../images/navBar_dm.svg';
import HomeIcon from '../images/navBar_home.svg';
import RankIcon from '../images/navBar_rank.svg';

const NavBar = () => {
  return (
    <View style={styles.box}>
      <View style={styles.element}>
        <View style={styles.overlapGroup}>
          {/* SVG 파일을 컴포넌트로 사용 */}
          <NavBackground style={styles.navBack} />
          <ProfileIcon style={styles.profile} />
          <CameraIcon style={styles.camera} />
          <DmIcon style={styles.dm} />
          <HomeIcon style={styles.home} />
          <RankIcon style={styles.rank} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 92,
    width: 393,
  },
  element: {
    height: 92,
    position: 'absolute',
    top: 0,
    left: 0,
    width: 393,
  },
  overlapGroup: {
    backgroundSize: '100% 100%',
    height: 94,
    position: 'relative',
    top: -1,
    left: -1,
    width: 395,
  },
  profile: {
    height: 25,
    position: 'absolute',
    left: 332,
    top: 21,
    width: 21,
  },
  home: {
    height: 24,
    position: 'absolute',
    left: 42,
    top: 22,
    width: 22,
  },
  camera: {
    height: 45,
    position: 'absolute',
    left: 176,
    top: 10,
    width: 45,
  },
  rank: {
    height: 25,
    position: 'absolute',
    left: 264,
    top: 21,
    width: 25,
  },
  dm: {
    height: 25,
    position: 'absolute',
    left: 107,
    top: 22,
    width: 25,
  },
  navBack: {
    height: 94,
    left: 0,
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
  },  
});

export default NavBar;
