import React, {useState} from 'react';
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
import BackIcon from '../images/back.svg'; // 뒤로가기 아이콘 추가

const {width, height} = Dimensions.get('window'); // 화면 너비와 높이 가져오기

const Upload = ({route, navigation}) => {
  const [postText, setPostText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Social'); // 디폴트값 Social로 변경
  const [selectedTags, setSelectedTags] = useState([]);
  const {photo} = route.params; // PhotoReview에서 전달된 사진

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
    setSelectedTags([]); // 카테고리가 변경되면 선택된 해시태그 초기화
  };

  const handleShare = () => {
    const postData = {
      text: postText,
      category: selectedCategory,
      tags: selectedTags,
      photo: photo?.path,
    };

    // Social과 Edu에 따라 다른 화면으로 이동
    if (selectedCategory === 'Social') {
      navigation.navigate('MainSocial', {postData});
    } else if (selectedCategory === 'Edu') {
      navigation.navigate('MainEdu', {postData});
    } else {
      Alert.alert('알림', '올바른 카테고리를 선택하세요.');
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
                selectedTags.includes(tag) &&
                  (tag === '#질문' || tag === '#구인'
                    ? styles.specialSelectedHashtagButton
                    : styles.selectedHashtagButton),
              ]}
              onPress={() => toggleTag(tag)}>
              <Text
                style={[
                  styles.hashtagText,
                  selectedTags.includes(tag) &&
                    (tag === '#질문' || tag === '#구인'
                      ? styles.specialSelectedHashtagText
                      : styles.selectedHashtagText),
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
  // 기존 스타일 유지
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
  specialSelectedHashtagButton: {
    backgroundColor: '#767676',
    borderColor: 'transparent',
  },
  hashtagText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  selectedHashtagText: {
    color: '#fff',
  },
  specialSelectedHashtagText: {
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
