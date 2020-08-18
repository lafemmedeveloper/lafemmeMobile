import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    paddingTop: 20,
  },
  Modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  icon: {
    backgroundColor: 'white',
    height: 7,
    width: 40,
    borderRadius: 4,
    zIndex: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
