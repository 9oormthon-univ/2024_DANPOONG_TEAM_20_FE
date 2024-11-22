import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Modal} from 'react-native';

import BackIcon from '../images/back.svg';
import QuizDateIcon from '../images/quiz_date.svg';
import CorrectModal from '../components/CorrectModal';
import IncorrectModal from '../components/IncorrectModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const Quiz = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState(null); // 선택된 답변 상태
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [quiz, setQuiz] = useState(null);

  // 퀴즈 데이터 생성 요청 함수 (POST)
  const fetchQuiz = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://mixmix2.store/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}), 
      });

      if (!response.ok) {
        throw new Error('퀴즈를 가져오는 데 실패했습니다.');
      }

      const data = await response.json(); 
      setQuiz(data); // 퀴즈 데이터 상태에 저장
      console.log(quiz);
    } catch (error) {
      console.error('퀴즈를 가져오는 데 오류가 발생했습니다:', error);
    }
  };
  useEffect(() => {
    fetchQuiz();
  }, []);

  // 더미 퀴즈 데이터
  const currentQuiz = {
    date: '24.11.23',
    question:
      '이슬람 국가로 돼지고기 섭취가 불가능하고 수도가 ‘앙카라’인 ‘이 나라’는 어디일까요?',
    options: [
      {id: 1, text: '독일', flag: '🇩🇪'},
      {id: 2, text: '이탈리아', flag: '🇮🇹'},
      {id: 3, text: '터키', flag: '🇹🇷'}, // 정답
      {id: 4, text: '브라질', flag: '🇧🇷'},
    ],
    answer: '터키',
  };

  // 정답 제출 처리
  const handleSubmit = () => {
    if (selectedOption) {
      const isCorrectAnswer = selectedOption.id === quiz.answer;
      setIsCorrect(isCorrectAnswer);
      setShowModal(true); // 모달 표시
    } else {
      alert('답변을 선택해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate('MyProfile')}
          style={styles.backButton}>
          <BackIcon width={24} height={24} />
        </Pressable>
        <Text style={styles.headerTitle}>오늘의 퀴즈</Text>
      </View>

      {/* 날짜 및 아이콘 */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{currentQuiz.date}</Text>
        <QuizDateIcon style={styles.quizDateIcon} width={20} height={20} />
      </View>

      {/* 문제 텍스트 */}
      <ScrollView contentContainerStyle={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuiz.question}</Text>

        {/* 답변 옵션 */}
        {currentQuiz.options.map(option => (
          <Pressable
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption?.id === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option)}>
            <Text style={styles.optionFlag}>{option.flag}</Text>
            <Text style={styles.optionText}>{option.text}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 제출 버튼 */}
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>제출하기</Text>
      </Pressable>

      {/* 정답/오답 모달 */}
      {isCorrect !== null && (
        <Modal
          transparent
          visible={showModal}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}>
          {isCorrect ? (
            <CorrectModal
              onClose={() => setShowModal(false)}
              navigation={navigation}
            />
          ) : (
            <IncorrectModal onClose={() => setShowModal(false)} />
          )}
        </Modal>
      )}
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#F6F6F6',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    padding: 10,
  },

  headerTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#000',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  dateText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  quizDateIcon: {
    position: 'absolute',
    right: 20,
  },
  questionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  questionText: {
    fontSize: width * 0.048,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 30,
    color: '#000',
    paddingHorizontal: 28,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#F6F6F6',
    borderRadius: 25,
    width: '85%',
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 97, 82, 0.7)',
  },
  optionFlag: {
    fontSize: width * 0.05,
    marginRight: 8,
    color: '#000',
  },
  optionText: {
    fontSize: width * 0.04,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#FF6152',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
  },
  submitButtonText: {
    fontSize: width * 0.04,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Quiz;
