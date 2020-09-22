import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts, Colors} from '../../../../../../themes';

const UploadPhoto = () => {
  return (
    <View style={styles.container}>
      <Icon
        name={'camera'}
        size={50}
        color={Colors.expert.primaryColor}
        style={styles.icon}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Sube tu foto'}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '90%',
    paddingTop: 20,
  },

  icon: {alignSelf: 'center', marginVertical: 20},
});
export default UploadPhoto;
