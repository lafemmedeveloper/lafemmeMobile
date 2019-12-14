import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
export default StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: '#F8F8F8',
  },
  bannerExpert: {
    width: '95%',
    height: 80,
    marginTop: Metrics.addHeader,
    borderRadius: Metrics.borderRadius,
    backgroundColor: Colors.expert.primartColor,
    alignSelf: 'center',
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
