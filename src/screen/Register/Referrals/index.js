import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts, Metrics} from '../../../themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Referrals = () => {
  return (
    <View>
      <Icon
        name="contacts"
        size={50}
        color={Colors.client.primaryColor}
        style={styles.icon}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Ingresa el numero de teléfono de tu referido para continuar'}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginHorizontal: 10,
          marginVertical: 20,
        }}>
        <TextInput
          keyboardType="numeric"
          value={'number'}
          onChangeText={(text) => console.log(text)}
          placeholder={'300 55555'}
          style={{
            width: '70%',
            padding: 20,
            borderRadius: Metrics.borderRadius,
            backgroundColor: Colors.textInputBg,
            alignSelf: 'center',
            marginLeft: 10,
          }}
        />

        <TouchableOpacity
          style={{
            width: '20%',
            borderRadius: Metrics.borderRadius,
            backgroundColor: Colors.textInputBg,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
            height: 60,
          }}>
          <Icon name="contacts" size={25} color={Colors.client.primaryColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
});

export default Referrals;
