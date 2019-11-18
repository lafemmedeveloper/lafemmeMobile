import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
export default StyleSheet.create({
  // container: {
  //   height: 40,
  //   marginVertical: 5,
  //   borderRadius: Metrics.textInBr,
  //   alignSelf: 'center',
  //   //position: "absolute",
  //   width: '100%',
  //   backgroundColor: Colors.textInputBg,
  //   paddingHorizontal: 10,
  // },
  textInput: {
    width: '100%%',
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    paddingHorizontal: 10,
    backgroundColor: Colors.textInputBg,
    height: 40,
  },
  // containerMultiline: {
  //   height: 80,
  //   width: Metrics.screenWidth * 0.8,
  //   borderRadius: Metrics.textInBr,
  //   alignSelf: 'center',
  //   width: '100%',
  //   backgroundColor: Colors.textInputBg,
  // },

  textInputMultiline: {
    width: '100%%',
    height: 100,
    paddingHorizontal: 10,
    alignSelf: 'center',
    textAlignVertical: 'top',

    backgroundColor: Colors.textInputBg,

    borderRadius: Metrics.borderRadius,
  },
});
