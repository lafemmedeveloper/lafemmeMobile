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

const UpdateEmail = (props) => {
  const {state} = useContext(StoreContext);

  const {dispatch, user} = props;
  const [email, setEmail] = useState('');

  const {auth} = state;
  const {loading} = auth;
  const updateEmail = async () => {
    if (email === '') {
      Alert.alert('Ups', 'Todos los campos son requeridos');
    } else {
      Keyboard.dismiss();
      await updateProfileItem({email}, user.uid, dispatch);
      setEmail('');
      Alert.alert('Que bien', 'Se actualizo tu correo satisfactoriamente');
    }
  };
  return (
    <View style={styles.container}>
      <MyTextInput
        pHolder={`${user.email}`}
        text={email}
        multiLine={false}
        onChangeText={(text) => setEmail(text)}
        secureText={false}
        textContent={'name'}
        autoCapitalize={'words'}
      />

      <TouchableOpacity
        onPress={() => updateEmail()}
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
export default UpdateEmail;
