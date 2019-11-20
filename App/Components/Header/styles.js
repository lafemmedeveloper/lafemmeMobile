import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,

    position: 'absolute',
    zIndex: 100,
    height: 60 + Metrics.addHeader,
    // height: Metrics.screenHeight * 0.15 + Metrics.addHeader,
    backgroundColor: '#F8F8F8',
  },

  // imageHeader: {
  //   width: Metrics.screenWidth,
  //   height: Metrics.screenHeight * 0.15 + Metrics.addHeader,
  //   position: 'absolute',
  //   resizeMode: 'cover',
  //   backgroundColor: 'transparent',
  //   tintColor: Colors.client.primartColor,
  // },

  imageHeaderExpert: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight * 0.1 + Metrics.addHeader,
    position: 'absolute',
    resizeMode: 'cover',
    backgroundColor: 'transparent',
    // tintColor: Colors.expert.primartColor,
  },
  addHeader: {
    width: Metrics.screenWidth,

    height: Metrics.addHeader,
    // backgroundColor: 'blue'
  },
  footerHeader: {
    width: Metrics.screenWidth,

    height: Metrics.screenHeight * 0.1,
    // backgroundColor: 'green'
  },
  content: {
    width: Metrics.screenWidth,
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.client.primartColor,
  },
  contentL: {
    width: Metrics.screenWidth * 0.15,
    flex: 0,
    // backgroundColor: 'brown'
  },
  contentC: {
    flex: 1,
    alignItems: 'center',
    //  backgroundColor: 'purple'
  },
  contentR: {
    width: Metrics.screenWidth * 0.15,
    flex: 0,
    // backgroundColor: 'red'
  },
});
