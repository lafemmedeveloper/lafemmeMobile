import {StyleSheet} from 'react-native';
import {Colors, Metrics} from 'App/themes';

export default StyleSheet.create({
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 20},
  containerTitle: {
    marginVertical: 20,
  },
  button: {
    flex: 0,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',

    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.client.primaryColor,
    marginBottom: Metrics.addFooter + 10,
  },
});
