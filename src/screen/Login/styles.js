import {Metrics, Colors} from '../../themes';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  containerItems: {
    flex: 1,
    paddingBottom: 10,
    alignItems: 'center',
  },

  loading: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: Metrics.screenWidth,
    zIndex: 2000,
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
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSocialContainer: {
    flexDirection: 'row',
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: Colors.pinkMask(0.25),

    justifyContent: 'center',
    alignItems: 'center',
  },
});
