import {Metrics, Colors, Fonts} from '../../Themes';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    // height: Metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerItems: {
    flex: 1,
    marginTop: Metrics.header,
    paddingBottom: 10,
    alignItems: 'center',
  },

  headerContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: Metrics.screenWidth,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 0,
    flexDirection: 'row',
    width: Metrics.screenWidth,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnRegisterLogin: {
    flex: 0,
    width: Metrics.screenWidth / 2,
    height: 40,
    marginVertical: Metrics.addFooter * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 0,
    height: 60,
    width: Metrics.screenWidth * 0.8,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: Metrics.addFooter * 2,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
});
