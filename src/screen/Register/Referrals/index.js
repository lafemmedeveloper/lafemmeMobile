import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from 'react-native';
import {
  ApplicationStyles,
  Colors,
  Fonts,
  Images,
  Metrics,
} from '../../../themes';
import {validateReferrals} from '../../../flux/auth/actions';
import Loading from '../../../components/Loading';
import CountryPicker from 'react-native-country-picker-modal';
import {useKeyboard} from '../../../hooks/useKeyboard';

const Referrals = ({setUserReferrals, handleRegister, close}) => {
  const initialState = {
    country: {
      cca2: 'CO',
      callingCode: '57',
    },
  };
  const [contact, setContact] = useState('');
  const [stateInitial, setValueState] = useState(initialState);
  const [keyboardHeight] = useKeyboard();

  const handleReferrals = async () => {
    if (contact === '') {
      return Alert.alert('Ups', 'el numero de tu referido es obligatorio');
    }

    let number = contact;
    if (!contact.includes('+57')) {
      number = `+57${contact}`;
    }
    const guest = await validateReferrals(number);
    if (!guest) {
      return Alert.alert(
        'Lo siento',
        'No encontramos referidos con ese numero de teléfono',
      );
    }

    setUserReferrals({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      uid: guest.uid,
      phone: guest.phone,
    });
    await handleRegister();
    close(false);
  };
  const _changeCountry = (country) => {
    setValueState({...stateInitial, country});
  };
  return (
    <>
      <Loading type={'client'} />
      <View>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.name}
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
          {'Tienes algún referido'}
        </Text>
        <Text
          style={Fonts.style.light(Colors.dark, Fonts.size.small, 'center')}>
          Ingresa el numero de teléfono de tu referido
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <CountryPicker
            closeable
            withFilter
            withFlagButton
            withCountryNameButton
            withFlag
            withCallingCode
            theme={{
              fontSize: Fonts.size.medium,
              filterPlaceholderTextColor: '#aaa',
            }}
            containerButtonStyle={{
              padding: 20,
              marginTop: 22,
              marginRight: 10,
              borderRadius: Metrics.borderRadius,
              backgroundColor: Colors.textInputBg,
              flexDirection: 'row',
            }}
            filterProps={{
              placeholder: 'Busca tu país',
            }}
            placeholder={`+ ${stateInitial.country.callingCode} `}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onSelect={(country) => _changeCountry(country)}
            cca2={stateInitial.country.cca2}
            translation={'spa'}
          />
          <TextInput
            keyboardType="numeric"
            value={contact}
            onChangeText={(text) => setContact(text)}
            placeholder={'300 55555'}
            style={{
              width: '70%',
              padding: 20,
              marginVertical: 20,
              borderRadius: Metrics.borderRadius,
              backgroundColor: Colors.textInputBg,
              alignSelf: 'center',
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => handleReferrals()}
          style={[
            {
              flex: 0,
              borderRadius: Metrics.textInBr,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '90%',
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: Colors.client.primaryColor,
              marginBottom: Metrics.addFooter + 10,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            Verificar referido
          </Text>
        </TouchableOpacity>
        <View style={{height: keyboardHeight}} />
      </View>
    </>
  );
};

export default Referrals;
