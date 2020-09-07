import {StyleSheet} from 'react-native';
import {Metrics} from '../../themes';

export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    position: 'absolute',
    zIndex: 1000,
    flex: 1,
  },
});
