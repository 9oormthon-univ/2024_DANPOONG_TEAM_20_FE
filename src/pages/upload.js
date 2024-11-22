import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 사용자 이메일 가져오기
import BackIcon from '../images/back.svg';

const {width, height} = Dimensions.get('window'); // 화면 너비와 높이 가져오기

const Upload = ({route, navigation}) => {
  const [postText, setPostText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Social'); // 기본 카테고리 설정
  const [selectedTags, setSelectedTags] = useState([]);
  const [userEmail, setUserEmail] = useState(''); // 사용자 이메일 저장 상태
  const {photo} = route.params; // PhotoReview에서 전달된 사진

  // 초기 이메일 가져오기
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const parsedInfo = JSON.parse(userInfo);
          setUserEmail(parsedInfo.email || ''); // 이메일 설정
        } else {
          Alert.alert('오류', '사용자 이메일을 확인할 수 없습니다.');
        }
      } catch (error) {
        console.error('이메일 가져오기 실패:', error);
      }
    };

    fetchUserEmail();
  }, []);

  const hashtagsByCategory = {
    Social: ['#음식', '#K-POP', '#핫플', '#질문', '#구인'],
    Edu: ['#언어', '#전공', '#질문', '#구인'],
  };

  const currentHashtags = hashtagsByCategory[selectedCategory] || [];

  const toggleTag = tag => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag],
    );
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category);
    setSelectedTags([]); // 카테고리 변경 시 해시태그 초기화
  };

  const handleShare = async () => {
    if (!userEmail) {
      Alert.alert('오류', '사용자 이메일을 확인할 수 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append(
      'feedSaveReqDto',
      JSON.stringify({
        contents: postText,
        hashTags: selectedTags.join(', '),
        feedType: selectedCategory.toUpperCase(),
      }),
    );

    // 파일 확장자 동적 처리
    const fileType = photo.path.split('.').pop(); // 파일 확장자 추출
    formData.append('feedImage', {
      uri: photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
    

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log("Photo Path:", photo.path);
      const response = await fetch('https://mixmix2.store/api/feed', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json(); // 서버 응답 데이터 가져오기
        Alert.alert('성공', '피드가 성공적으로 업로드되었습니다.');
        navigation.navigate(
          selectedCategory === 'Social' ? 'MainSocial' : 'MainEdu',
          {
            newPost: responseData.data, // 업로드한 게시글 데이터 전달
          },
        );
      } else {
        const errorData = await response.json();
        console.error('API 오류:', errorData);
        Alert.alert('오류', '피드 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      Alert.alert('오류', '네트워크 문제로 업로드에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon width={width * 0.06} height={width * 0.06} />
        </Pressable>
        <Text style={styles.headerTitle}>새 게시물</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{
            uri: `file://${photo.path}`,
          }}
          style={styles.uploadedImage}
        />

        <TextInput
          style={styles.postInput}
          placeholder="지금 생각을 공유해보세요..."
          placeholderTextColor="#999"
          multiline
          value={postText}
          onChangeText={setPostText}
        />

        <Text style={styles.sectionTitle}>카테고리</Text>
        <View style={styles.categoryContainer}>
          {Object.keys(hashtagsByCategory).map(category => (
            <Pressable
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategoryChange(category)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>해시태그</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hashtagScrollContainer}>
          {currentHashtags.map(tag => (
            <Pressable
              key={tag}
              style={[
                styles.hashtagButton,
                selectedTags.includes(tag) && styles.selectedHashtagButton,
              ]}
              onPress={() => toggleTag(tag)}>
              <Text
                style={[
                  styles.hashtagText,
                  selectedTags.includes(tag) && styles.selectedHashtagText,
                ]}>
                {tag}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      <Pressable style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>공유</Text>
      </Pressable>
    </SafeAreaView>
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
    justifyContent: 'center',
    paddingHorizontal: width * 0.04,
    height: height * 0.08,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    position: 'absolute',
    left: width * 0.04,
    top: height * 0.02,
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  scrollContent: {
    padding: width * 0.04,
    paddingBottom: height * 0.12,
  },
  uploadedImage: {
    width: '100%',
    height: height * 0.3,
    borderRadius: 8,
    marginBottom: height * 0.02,
  },
  postInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: width * 0.04,
    fontSize: width * 0.04,
    color: '#333',
    textAlignVertical: 'top',
    height: height * 0.15,
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  categoryButton: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: width * 0.02,
  },
  selectedCategoryButton: {
    backgroundColor: '#FF6152',
    borderColor: '#FF6152',
  },
  categoryText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  hashtagScrollContainer: {
    flexDirection: 'row',
    paddingVertical: height * 0.01,
  },
  hashtagButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: width * 0.02,
  },
  selectedHashtagButton: {
    backgroundColor: '#FF6152',
    borderColor: '#FF6152',
  },
  hashtagText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  selectedHashtagText: {
    color: '#fff',
  },
  shareButton: {
    position: 'absolute',
    bottom: height * 0.02,
    left: width * 0.04,
    right: width * 0.04,
    backgroundColor: '#FF6152',
    paddingVertical: height * 0.02,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default Upload;
