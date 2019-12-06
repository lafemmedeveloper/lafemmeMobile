import { StyleSheet } from 'react-native';
import { Metrics, Colors } from '../../Themes';
export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    position: 'absolute',
    height: Metrics.screenHeight * 0.2
    // backgroundColor: 'red'
  },
  addHeader: {
    width: Metrics.screenWidth,

    height: Metrics.addHeader
    // backgroundColor: 'blue'
  },
  footerHeader: {
    width: Metrics.screenWidth,

    height: Metrics.screenHeight * 0.1
    // backgroundColor: 'green'
  },
  content: {
    width: Metrics.screenWidth,
    flex: 1,
    flexDirection: 'row'
  },
  icon: { width: 20, height: 20, resizeMode: 'contain' },
  contentL: {
    width: Metrics.screenWidth * 0.15,
    flex: 0
    // backgroundColor: 'brown'
  },
  contentC: {
    flex: 1
    //  backgroundColor: 'purple'
  },
  contentR: {
    width: Metrics.screenWidth * 0.15,
    flex: 0
    // backgroundColor: 'red'
  }
});
