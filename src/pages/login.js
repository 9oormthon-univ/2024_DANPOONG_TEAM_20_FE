import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Quiz = ({ navigation }) => {
  const [quiz, setQuiz] = useState(null); // 퀴즈 데이터를 저장할 상태
  const [selectedOption, setSelectedOption] = useState(null); // 선택된 답변
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태

  // 퀴즈 데이터 생성 요청 함수 (POST)
  const fetchQuiz = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://mixmix2.store/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 요청
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}), // 빈 객체를 JSON 형식으로 보냄
      });

      if (!response.ok) {
        throw new Error('퀴즈를 가져오는 데 실패했습니다.');
      }

      const data = await response.json(); // JSON 형태로 응답 받기
      setQuiz(data); // 퀴즈 데이터 상태에 저장

      // 퀴즈 데이터 로그 출력
      console.log('Fetched quiz:', data); // 이 부분을 추가하여 퀴즈 데이터 출력

    } catch (error) {
      console.error('퀴즈를 가져오는 데 오류가 발생했습니다:', error);
    }
  };

  // 컴포넌트가 마운트될 때 퀴즈 데이터 가져오기
  useEffect(() => {
    fetchQuiz(); // 페이지 진입 시 자동으로 퀴즈를 가져옴
  }, []);

  if (!quiz) {
    return <Text>퀴즈를 로딩 중...</Text>; // 퀴즈가 로딩 중이면 이 메시지 표시
  }

  // 정답 제출 처리
  const handleSubmit = async () => {
    if (selectedOption) {
      // 정답 처리 (POST 요청)
      if (selectedOption.text === quiz.answer) {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          const response = await fetch('https://mixmix2.store/api/quiz/correct-answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              // 필요한 데이터 추가 가능
            }),
          });

          if (!response.ok) {
            throw new Error('정답 제출에 실패했습니다.');
          }

          setIsCorrect(true);
        } catch (error) {
          console.error('정답 제출 오류:', error);
          setIsCorrect(false);
        }
      } else {
        // 오답 처리 (GET 요청)
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          const response = await fetch('https://mixmix2.store/api/quiz/incorrect-answer', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            }
          });

          if (!response.ok) {
            throw new Error('오답 제출에 실패했습니다.');
          }

          setIsCorrect(false);
        } catch (error) {
          console.error('오답 제출 오류:', error);
          setIsCorrect(false);
        }
      }

      setShowModal(true); // 모달 표시
    } else {
      alert('답변을 선택해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <Text style={styles.headerTitle}>오늘의 퀴즈</Text>

      {/* 문제 텍스트 */}
      <ScrollView contentContainerStyle={styles.questionContainer}>
        <Text style={styles.questionText}>{quiz.question}</Text>

        {/* 답변 옵션 */}
        {[{
          text: quiz.option1, id: 1
        }, {
          text: quiz.option2, id: 2
        }, {
          text: quiz.option3, id: 3
        }, {
          text: quiz.option4, id: 4
        }].map((option) => (
          <Pressable
            key={option.id}
            style={[styles.optionButton, selectedOption?.id === option.id && styles.selectedOption]}
            onPress={() => setSelectedOption(option)}
          >
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
        <Modal transparent visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
          {isCorrect ? (
            <Text>정답입니다!</Text> // 정답 모달 내용
          ) : (
            <Text>오답입니다.</Text> // 오답 모달 내용
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
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionButton: {
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
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#FF6152',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Quiz;
