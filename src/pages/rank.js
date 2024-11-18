import React from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';

const Rank = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>This is Rank Page</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Rank;
