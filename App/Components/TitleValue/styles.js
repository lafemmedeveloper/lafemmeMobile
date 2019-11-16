import {StyleSheet} from 'react-native';
import {Metrics} from '../../Themes';
export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    marginVertical: 2.5,
  },
});
