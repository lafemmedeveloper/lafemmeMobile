import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Fonts, Colors} from '../../../themes';

const MenuTab = ({setDetail, detail}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={detail ? styles.btn : styles.btnSelectd}
        onPress={() => setDetail(false)}>
        <Text
          style={Fonts.style.bold(
            detail ? Colors.gray : Colors.dark,
            Fonts.size.medium,
          )}>
          Ruta
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={!detail ? styles.btn : styles.btnSelectd}
        onPress={() => setDetail(true)}>
        <Text
          style={Fonts.style.bold(
            !detail ? Colors.gray : Colors.dark,
            Fonts.size.medium,
          )}>
          Detalles
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  btnSelectd: {
    borderBottomWidth: 2,
    borderColor: Colors.expert.primaryColor,
    marginHorizontal: 10,
    alignItems: 'center',
    flex: 1,
  },
  btn: {
    borderBottomWidth: 0,
    marginHorizontal: 10,
    alignItems: 'center',
    flex: 1,
  },
});

export default MenuTab;
