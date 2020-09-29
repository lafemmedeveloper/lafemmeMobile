import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import MyTextInput from '../../../../../components/MyTextInput';
import {StoreContext} from '../../../../../flux';
import {updateProfileItem} from '../../../../../flux/auth/actions';
import {Colors, Fonts, Metrics} from '../../../../../themes';

const UpdateName = (props) => {
  const {state, authDispatch} = useContext(StoreContext);

  const {user} = props;
  const {auth} = state;
  const {loading} = auth;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const updateName = async () => {
    if (firstName === '' || lastName === '') {
      Alert.alert('Ups', 'Todos los campos son requeridos');
    } else {
      Keyboard.dismiss();
      await updateProfileItem({firstName, lastName}, user.uid, authDispatch);
      setFirstName('');
      setLastName('');
      Alert.alert('Que bien', 'Se actualizo tu nombre satisfactoriamente');
    }
  };
  return (
    <View style={styles.container}>
      <MyTextInput
        pHolder={`${user.firstName}`}
        text={firstName}
        multiLine={false}
        onChangeText={(text) => setFirstName(text)}
        secureText={false}
        textContent={'name'}
        autoCapitalize={'words'}
      />
      <MyTextInput
        pHolder={`${user.lastName}`}
        text={lastName}
        multiLine={false}
        onChangeText={(text) => setLastName(text)}
        secureText={false}
        textContent={'name'}
        autoCapitalize={'words'}
      />
      <TouchableOpacity
        onPress={() => updateName()}
        style={[
          styles.btnContainer,
          {
            backgroundColor: Colors.client.primaryColor,
          },
        ]}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          {!loading ? 'Actualizar' : <ActivityIndicator color={Colors.light} />}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Metrics.contentWidth,
    alignSelf: 'center',
    marginVertical: 20,
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

export default UpdateName;
