import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {Images, Colors, Fonts} from '../../../../themes';

const SerchExpert = () => {
  return (
    <View style={styles.container}>
      <View style={styles.conLottie}>
        <LottieView
          source={Images.serch}
          autoPlay
          loop
          style={{height: 200, width: 200}}
        />
      </View>

      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Buscando tu experto'}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conLottie: {
    position: 'absolute',
    zIndex: 10,

    top: -10,
  },
});
export default SerchExpert;
