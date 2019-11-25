import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
export default StyleSheet.create({
  container: {
    flex: 0,
    // marginVertical: 5,
    // borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    //position: "absolute",
    width: '95%',
    // backgroundColor: Colors.textInputBg,
    // paddingHorizontal: 10
  },
  cancelBtn: {
    flex: 1,
    marginVertical: 20,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 0,
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
});
