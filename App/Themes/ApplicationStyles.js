import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

const ApplicationStyles = {
  scrollHome: {
    marginTop: Metrics.screenWidth * 0.22,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    // backgroundColor: 'red'
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

  separatorLine: {
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: Colors.dark,
    marginBottom: 20,
  },

  scrollHomeExpert: {
    marginTop: Metrics.screenWidth * 0.22,
    width: Metrics.screenWidth * 0.95,
    alignSelf: 'center',
    marginBottom: 10,
    flex: 1,
    borderRadius: Metrics.borderRadius,
    // height: Metrics.screenHeight,
    backgroundColor: Colors.light,
  },
  scrollCart: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  itemService: {
    borderRadius: Metrics.borderRadius,
    width: Metrics.screenWidth * 0.95,
    height: Metrics.screenWidth * 0.4,
    marginVertical: 2.5,
    alignSelf: 'center',
    backgroundColor: Colors.light,
  },

  itemImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
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

  shadownClient: {
    // shadown
    shadowColor: Colors.client.primartColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  shadownExpert: {
    // shadown
    shadowColor: Colors.expert.primartColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  shadownClientTop: {
    // shadown
    shadowColor: Colors.client.primartColor,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  imageshadownClient: {
    // shadown
    shadowColor: Colors.client.primartColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
};

export default ApplicationStyles;
