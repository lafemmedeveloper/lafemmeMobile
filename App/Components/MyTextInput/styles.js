import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
export default StyleSheet.create({
  textInput: {
    width: '100%%',
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.textInputBg,
    height: 40,

    color: Colors.dark,
  },

  textInputMultiline: {
    width: '100%%',
    height: 100,
    marginVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'center',
    textAlignVertical: 'top',

    backgroundColor: Colors.textInputBg,

    borderRadius: Metrics.borderRadius,
  },
});
