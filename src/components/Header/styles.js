import {StyleSheet} from 'react-native';
import {Metrics, Colors} from 'App/themes';
export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,

    position: 'absolute',
    zIndex: 100,
    height: 60 + Metrics.addHeader,
    backgroundColor: Colors.backgroundColor,
  },

  imageHeaderExpert: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight * 0.1 + Metrics.addHeader,
    position: 'absolute',
    resizeMode: 'cover',
    backgroundColor: 'transparent',
  },
  addHeader: {
    width: Metrics.screenWidth,

    height: Metrics.addHeader,
    // backgroundColor: 'blue'
  },
  footerHeader: {
    width: Metrics.screenWidth,

    height: Metrics.screenHeight * 0.1,
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
    tintColor: Colors.client.primaryColor,
  },
  contentL: {
    width: Metrics.screenWidth * 0.15,
    flex: 0,
  },
  contentC: {
    flex: 1,
    alignItems: 'center',
  },
  contentR: {
    width: Metrics.screenWidth * 0.15,
    flex: 0,
  },
});
