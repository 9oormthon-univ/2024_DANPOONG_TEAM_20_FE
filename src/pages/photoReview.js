import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Text,
} from 'react-native';
import BackIcon from '../images/back_white.svg'; // 뒤로가기 아이콘
import RetryIcon from '../images/retry.svg'; // 다시 찍기 아이콘 (텍스트 포함)
import NextIcon from '../images/next.svg'; // 다음 버튼 아이콘 (텍스트 포함)

const {width, height} = Dimensions.get('window'); // 화면 크기 가져오기

const PhotoReview = ({route, navigation}) => {
  const {photo} = route.params || {}; // 전달받은 photo 객체

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon width={width * 0.06} height={height * 0.04} />
        </Pressable>
      </View>

      {/* 전달된 사진 렌더링 */}
      <View style={styles.imageContainer}>
        {photo ? (
          <Image
            source={{uri: `file://${photo.path}`}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPhotoContainer}>
            <Text style={styles.noPhotoText}>촬영된 사진이 없습니다.</Text>
          </View>
        )}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.resetButton}
          onPress={() => navigation.navigate('Camera')}>
          {/* retry.svg 반응형 크기 적용 */}
          <RetryIcon width={width * 0.25} height={width * 0.25} />
        </Pressable>
        <Pressable
          style={styles.nextButton}
          onPress={() => navigation.navigate('Upload', {photo})}>
          {/* next.svg 반응형 크기 적용 */}
          <NextIcon width={width * 0.25} height={width * 0.25} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // 검은 배경
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    marginTop: height * 0.02,
  },
  backButton: {
    padding: 6,
    paddingBottom: height * 0.03,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  noPhotoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    color: '#999',
    fontSize: height * 0.02,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05, // 버튼 간격을 화면 너비에 비례하여 조정
    paddingBottom: height * 0.02,
  },
});

export default PhotoReview;
