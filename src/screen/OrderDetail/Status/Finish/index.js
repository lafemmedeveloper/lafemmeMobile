import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Finish = () => {
  return (
    <>
      <Text>Ordern finalizada</Text>
      <View style={styles.container}>
        <Text>hello finish</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default Finish;
