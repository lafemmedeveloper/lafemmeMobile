import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {Colors, Metrics, Fonts} from '../../../themes';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import Icon from 'react-native-vector-icons/MaterialIcons';

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
    Keyboard.dismiss();
    if (value.length < 6) {
      Alert.alert('Ups', 'Es necesario el código');
    } else {
      handleVerifyCode();
    }
  };

  const resetcode = async () => {
    setValue('');
    setModalCode(false);
  };

  return (
    <>
      <SafeAreaView style={styles.root}>
        <Icon
          name="sms"
          size={50}
          color={Colors.client.primaryColor}
          style={styles.icon}
        />
        <Text style={styles.title}>
          Ingresa el código enviado al{'\n'}
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
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              Siguiente
            </Text>
            {activityLoading && (
              <ActivityIndicator size="small" color="white" />
            )}
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
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
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
  icon: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
});

export default InputCode;
