import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';

const {width} = Dimensions.get('window');

const IncorrectModal = ({visible, onClose}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>아쉽지만 오답이에요</Text>
          <Text style={styles.subtitle}>오늘의 Streak가 채워졌어요</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              onClose(); // 모달 닫기
            }}>
            <Text style={styles.retryButtonText}>다시 도전하기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // 안드로이드 그림자
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  retryButton: {
    width: '90%',
    backgroundColor: '#FF6152',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: width * 0.045,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default IncorrectModal;
