import React, {useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Image,
} from 'react-native';

import {
  Colors,
  Metrics,
  Fonts,
  Images,
  ApplicationStyles,
} from '../../../themes';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useKeyboard} from '../../../hooks/useKeyboard';

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
  const [keyboardHeight] = useKeyboard();

  const inputVerifyCode = useCallback(() => {
    Keyboard.dismiss();
    if (value.length < 6) {
      Alert.alert('Ups', 'Es necesario el código');
    } else {
      handleVerifyCode();
    }
  }, [handleVerifyCode, value.length]);

  const resetcode = async () => {
    setValue('');
    setModalCode(false);
  };

  useEffect(() => {
    if (value.length === 6) {
      inputVerifyCode();
    }
  }, [inputVerifyCode, value]);
  return (
    <>
      <SafeAreaView style={styles.root}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.message}
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
          {'Verificación'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Ingresa el codigo enviado al \n'}

          <Text
            style={Fonts.style.light(
              Colors.client.primaryColor,
              Fonts.size.small,
              'center',
            )}>
            {phone}
          </Text>
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

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
                shadowColor: Colors.dark,
                shadowOffset: {
                  width: 2,
                  height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 1,

                elevation: 5,
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {activityLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                'Siguiente'
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => resetcode()}>
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 20,
                color: Colors.client.primaryColor,
              }}>
              Volver a intentar
            </Text>
          </TouchableOpacity>
          <View style={{height: keyboardHeight}} />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  root: {padding: 20, minHeight: 300},
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

export default InputCode;
