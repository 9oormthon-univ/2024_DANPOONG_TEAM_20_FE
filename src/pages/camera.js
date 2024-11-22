import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  Alert,
  Dimensions,
  Text,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import BackIcon from '../images/back_white.svg';
import SwitchIcon from '../images/switch.svg';
import CameraIcon from '../images/camera.svg';

const {width, height} = Dimensions.get('window');

const CameraScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [cameraPosition, setCameraPosition] = useState('back');
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = cameraPosition === 'back' ? devices.back : devices.front;

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'authorized') {
        const newPermission = await Camera.requestCameraPermission();
        if (newPermission !== 'authorized') {
          Alert.alert('권한 필요', '카메라 사용 권한이 필요합니다.');
          navigation.goBack();
        }
      }
    };
    requestPermissions();
  }, [navigation]);

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced', // 사진 품질 설정
      });
      navigation.navigate('PhotoReview', {photo}); // PhotoReview로 사진 전달
    } catch (error) {
      Alert.alert('사진 촬영 실패', error.message);
    }
  };

  const toggleCamera = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 뒤로가기 버튼 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon width={24} height={24} />
        </Pressable>
      </View>

      {/* 카메라 화면 */}
      <View style={styles.cameraWrapper}>
        {device ? (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={isFocused}
            photo={true}
          />
        ) : (
          <View style={styles.noCamera}>
            <Text style={styles.noCameraText}>
              카메라를 사용할 수 없습니다.
            </Text>
          </View>
        )}
      </View>

      {/* 하단 버튼들 */}
      <View style={styles.buttonContainer}>
        <Pressable onPress={toggleCamera} style={styles.switchButton}>
          <SwitchIcon width={30} height={30} />
        </Pressable>
        <Pressable onPress={takePhoto} style={styles.captureButton}>
          <CameraIcon width={70} height={70} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  cameraWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width,
    height: width,
  },
  noCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCameraText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 10,
    alignSelf: 'center', // 가운데 정렬
  },
  switchButton: {
    position: 'absolute',
    right: width * 0.2, // 오른쪽으로 배치
    padding: 10,
  },
});

export default CameraScreen;
