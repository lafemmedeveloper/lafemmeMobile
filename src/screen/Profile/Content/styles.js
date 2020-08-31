import {Metrics, Colors, Fonts} from '../../../themes';

export default {
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    paddingTop: Metrics.addHeader,
    flexDirection: 'column',
  },
  containerNoUSer: {
    flex: 1,
    width: Metrics.screenWidth,
    paddingTop: Metrics.addHeader,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },

  containerItems: {
    flex: 1,
    marginTop: Metrics.header,
    paddingBottom: 10,
    alignItems: 'center',
  },

  icon: {width: 20, height: 20, resizeMode: 'contain', marginRight: 20},
  headerContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: Colors.lightGray,
  },
  separator: {height: 20},
  profileContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    borderBottomWidth: 10,
    borderBottomColor: Colors.disabledBtn,
    justifyContent: 'center',
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
  loading: {
    backgroundColor: Colors.loader,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    zIndex: 2000,
  },
  logo: {
    width: Metrics.screenWidth * 0.4,
    height: Metrics.screenWidth * 0.4,
    resizeMode: 'contain',
    marginTop: 10,
  },
  selectorContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },

  welcome: {
    fontFamily: Fonts.type.base,
    color: Colors.dark,
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: Fonts.size.h6,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  descriptorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectorText: {
    marginHorizontal: 20,
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  btnText: {
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
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
    backgroundColor: Colors.client.secondaryColor,
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
  linearGradient: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
