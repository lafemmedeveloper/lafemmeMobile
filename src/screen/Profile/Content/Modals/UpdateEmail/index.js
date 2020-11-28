import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import MyTextInput from '../../../../../components/MyTextInput';
import {StoreContext} from '../../../../../flux';
import {updateProfileItem} from '../../../../../flux/auth/actions';
import {
  ApplicationStyles,
  Colors,
  Fonts,
  Images,
  Metrics,
} from '../../../../../themes';
import {useKeyboard} from '../../../../../hooks/useKeyboard';

const UpdateEmail = (props) => {
  const {state} = useContext(StoreContext);
  const {dispatch, user, setModalEmail} = props;
  const [email, setEmail] = useState(user ? user.email : '');
  const [keyboardHeight] = useKeyboard();

  const updateEmail = async () => {
    if (email === '') {
      Alert.alert('Ups', 'Todos los campos son requeridos');
    } else {
      try {
        Keyboard.dismiss();

        await updateProfileItem({email}, user.uid, dispatch);

        setEmail('');
        Alert.alert('Que bien', 'Se actualizo tu email satisfactoriamente', [
          {text: 'OK', onPress: () => setModalEmail(false)},
        ]);
      } catch (error) {
        console.log('error:register', error);
        if (
          error
            .toString()
            .includes('The email address is already in use by another account.')
        ) {
          Alert.alert(
            'Ups',
            'Este correo ya esta en uso, por favor intentalo con otro',
          );
        } else if (
          error.toString().includes('  The email address is badly formatted.')
        ) {
        } else {
          Alert.alert(
            'Ups...',
            'Tuvimos problemas con tu correo, por favor verifica que este bien escrito e intentalo de nuevo',
          );
        }
      }
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.email}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
            tintColor: Colors.client.primaryColor,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Actualizar usuario'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Cambia tu correo electrónico'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
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
            {!state.auth.loading ? (
              'Actualizar'
            ) : (
              <ActivityIndicator color={Colors.light} />
            )}
          </Text>
        </TouchableOpacity>
        <View style={{height: keyboardHeight}} />
      </View>
    </>
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
