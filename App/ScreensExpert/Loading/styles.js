import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
export default StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.snow,
  },
  loading: {
    backgroundColor: Colors.loader,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
  },
});
