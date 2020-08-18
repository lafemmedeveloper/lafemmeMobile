import {StyleSheet} from 'react-native';
import {Metrics, Colors} from 'App/themes';
export default StyleSheet.create({
  itemProfile: {
    width: Metrics.screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  decorationLine: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 0,
    width: Metrics.screenWidth * 0.87,
    height: 0.5,
    backgroundColor: Colors.gray,
  },
  itemIcon: {
    width: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
