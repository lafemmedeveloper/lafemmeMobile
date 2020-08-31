import {StyleSheet} from 'react-native';
import {Colors} from '../../../themes';

export default StyleSheet.create({
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 25},
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 15,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: Colors.client.primaryColor,
    borderBottomWidth: 2,
  },
});
