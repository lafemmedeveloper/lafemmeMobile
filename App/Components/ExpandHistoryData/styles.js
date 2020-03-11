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

  contentContainer: {
    backgroundColor: Colors.light,
    // backgroundColor: 'red',
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    flexDirection: 'row',

    shadowColor: Colors.client.primaryColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.84,

    elevation: 2,
  },
});
