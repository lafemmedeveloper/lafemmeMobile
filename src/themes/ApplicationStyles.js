import Metrics from './Metrics';
import Colors from './Colors';

const ApplicationStyles = {
  scrollHome: {
    width: Metrics.screenWidth,
    flex: 1,
  },

  loading: {
    backgroundColor: Colors.pinkMask(0.9),
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
  },
  bannerOrders: {
    alignSelf: 'center',
    marginTop: Metrics.addHeader,
    marginBottom: 5,
    flexDirection: 'row',
    width: Metrics.screenWidth * 0.95,
    paddingVertical: 10,
    flex: 0,
    marginVertical: 5,
    overflow: 'hidden',
    backgroundColor: Colors.textInputBg,
    borderRadius: Metrics.borderRadius,
  },

  bannerHistory: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: Metrics.screenWidth * 0.9,
    paddingVertical: 10,
    flex: 0,
    marginVertical: 5,
    overflow: 'hidden',
    backgroundColor: Colors.light,
    borderRadius: Metrics.borderRadius,
  },

  separatorLine: {
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: Colors.dark,
    marginVertical: 20,
  },
  separatorLineMini: {
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: Colors.dark,
    marginVertical: 10,
  },

  scrollHomeExpert: {
    width: Metrics.screenWidth * 0.95,
    alignSelf: 'center',
    marginBottom: 10,
    flex: 1,
    borderRadius: Metrics.borderRadius,
  },
  scrollCart: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  itemService: {
    borderRadius: Metrics.borderRadius,
    width: Metrics.screenWidth * 0.95,
    height: Metrics.screenWidth * 0.4,
    marginVertical: 5,
    alignSelf: 'center',
    backgroundColor: Colors.light,
  },

  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: Metrics.borderRadius,
  },

  itemTextContainer: {
    width: '100%',
    height: '100%',
    resizeMode: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default ApplicationStyles;
