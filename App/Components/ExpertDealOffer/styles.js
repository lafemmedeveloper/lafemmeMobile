import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
import metrics from '../../Themes/Metrics';
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

  containerBottom: {
    flex: 0,
    marginVertical: 5,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',


    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mapView: {
    width: '100%',
    height: 120,
    borderRadius: Metrics.borderRadius,
    marginTop: 10,
  },
  contentText: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  starts: {
    width: 100,
    alignSelf: 'center',
    marginVertical: 5,
  },
  swipe: {flex: 0, marginTop: 10},
  cellContainer: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
    // backgroundColor: 'red',
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    // flexDirection: 'row',


  },

  contentContainer: {flexDirection: 'row'},
});
