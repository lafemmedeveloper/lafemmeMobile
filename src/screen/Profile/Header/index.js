import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ApplicationStyles, Fonts, Colors, Metrics} from '../../../themes';

export default ({title}) => {
  return (
    <View style={[styles.container, ApplicationStyles.shadowsClient]}>
      <View style={styles.addHeader} />
      <View style={styles.content}>
        <Text
          style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
          {title}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    paddingTop: 10,

    zIndex: 100,
    height: 60 + Metrics.addHeader,
    backgroundColor: Colors.light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addHeader: {
    width: Metrics.screenWidth,
    height: Metrics.addHeader,
  },

  content: {
    width: Metrics.screenWidth,
    flex: 1,
  },
});
