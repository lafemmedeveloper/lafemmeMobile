import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fonts, Colors} from '../../../../themes';
const Finish = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'left')}>
          {'Orden finalizada'}
        </Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default Finish;
