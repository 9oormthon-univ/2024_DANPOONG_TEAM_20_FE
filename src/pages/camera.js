import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useNavigation, useIsFocused} from '@react-navigation/native'; // useIsFocused 추가
import BackIcon from '../images/back_white.svg';
import SwitchIcon from '../images/switch.svg';
import CameraIcon from '../images/camera.svg';

const {width, height} = Dimensions.get('window'); // 화면 크기 가져오기

const CameraScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // 현재 화면 활성화 상태 감지
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back'); // 카메라 위치
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = cameraPosition === 'back' ? devices.back : devices.front;

  useEffect(() => {
    const checkPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'authorized') {
        const newCameraPermission = await Camera.requestCameraPermission();
        if (newCameraPermission !== 'authorized') {
          Alert.alert('권한 필요', '카메라 사용을 위해 권한이 필요합니다.');
          navigation.goBack();
        }
      }
    };
    checkPermissions();
  }, []);

  const takePhoto = async () => {
    // 더미 데이터
    const dummyPhoto = {
      path: 'path/to/dummy/photo.jpg', // 더미 이미지 경로
    };

    try {
      console.log('Navigating to PhotoReview with dummy data');
      navigation.navigate('PhotoReview', {photo: dummyPhoto});
    } catch (error) {
      Alert.alert('페이지 이동 실패', error.message);
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
        {device && (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={isFocused} // 화면이 포커스 상태일 때만 활성화
            photo={true}
            onInitialized={() => setIsCameraReady(true)}
            onError={error => {
              Alert.alert('에러', error.message);
              navigation.goBack();
            }}
          />
        )}
      </View>

      {/* 하단 버튼들 */}
      <View style={styles.buttonContainer}>
        {/* 촬영 버튼 */}
        {isCameraReady && (
          <Pressable onPress={takePhoto} style={styles.captureButton}>
            <CameraIcon width={70} height={70} />
          </Pressable>
        )}
        {/* 카메라 전환 버튼 */}
        <Pressable onPress={toggleCamera} style={styles.switchButton}>
          <SwitchIcon width={30} height={30} />
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
    width: width, // 화면 전체 너비
    height: width, // 정사각형 비율 유지
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.02, // 하단에 비례 위치
    flexDirection: 'row',
    justifyContent: 'space-evenly', // 버튼 간격 균등
    alignItems: 'center',
    width: '100%',
  },
  captureButton: {
    alignSelf: 'center', // 버튼을 중앙에 배치
    marginRight: width * 0.1,
  },
  switchButton: {
    position: 'absolute',
    marginLeft: width * 0.3,
  },
});

export default CameraScreen;
