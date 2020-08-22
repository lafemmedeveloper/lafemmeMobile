import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../themes';
export default StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  imageProduct: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.5,
    resizeMode: 'cover',
    position: 'absolute',
  },
  containerBack: {
    marginLeft: 20,
    backgroundColor: 'white',
    height: 30,
    width: 30,
    flex: 0,
    borderRadius: 15,
    justifyContent: 'center',
    marginTop: 20,
  },
  contImage: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.5,
    resizeMode: 'cover',
    position: 'absolute',
    bottom: 10,
    justifyContent: 'flex-end',
    marginHorizontal: 10,
  },
  header: {
    zIndex: 1000,
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.5,
    resizeMode: 'cover',
    backgroundColor: Colors.client.primaryColor,
  },
});
