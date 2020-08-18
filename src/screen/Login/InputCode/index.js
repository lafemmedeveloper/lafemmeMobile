import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Colors, Metrics, Fonts} from 'App/themes';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import auth from '@react-native-firebase/auth';
import styles from './styles';
import Countdown from 'react-countdown';

const CELL_COUNT = 6;

const InputCode = ({
  setValue,
  value,
  phone,
  setModalCode,
  handleVerifyCode,
  activityLoading,
}) => {
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const inputVerifyCode = () => {
    if (value.length < 6) {
      Alert.alert('Ups', 'es necesario el codigo');
    } else {
      handleVerifyCode();
    }
  };
  const renderer = ({minutes, seconds}) => {
    return (
      <>
        {seconds === 0 ? (
          <TouchableOpacity onPress={() => setModalCode(false)}>
            <Text
              style={{
                color: Colors.client.primaryColor,
                fontSize: 15,
                alignSelf: 'center',
                marginVertical: 20,
              }}>
              Reintentar
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => auth().signOut()}>
            <Text style={{fontSize: 15, alignSelf: 'center', marginTop: 20}}>
              Volver a intentarlo en {minutes}:{seconds}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>
        Tu Código de verificación para{' '}
        <Text style={{color: Colors.client.primaryColor, fontSize: 18}}>
          {phone}
        </Text>
      </Text>

      <View style={{marginVertical: 30}}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={{marginTop: 20}}>
        <TouchableOpacity
          onPress={() => inputVerifyCode()}
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
            Siguiente
          </Text>
          {activityLoading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
        <Countdown date={Date.now() + 1 * 60000} renderer={renderer} />
      </View>
    </SafeAreaView>
  );
};

export default InputCode;
