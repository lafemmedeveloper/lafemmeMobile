import {StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../Themes';
export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth * 0.95,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: Metrics.screenWidth * 0.1,
    backgroundColor: Colors.client.primartColor,
  },
  counter: {
    backgroundColor: Colors.lightMask(0.25),
    width: Metrics.screenWidth * 0.05,
    height: Metrics.screenWidth * 0.05,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
  },

  title: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  price: {
    flex: 0,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
