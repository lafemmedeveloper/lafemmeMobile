/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {TextInput} from 'react-native';

import styles from './styles';
import {Colors} from '../../Themes';

export default data => {
  return (
    <TextInput
      keyboardType={data.keyboardType}
      placeholderTextColor={Colors.gray}
      multiline={data.multiLine}
      autoCapitalize={data.autoCapitalize}
      textContentType={data.textContent}
      secureTextEntry={data.secureText}
      placeholder={data.pHolder}
      scrollEnabled={data.multiline}
      style={data.multiLine ? styles.textInputMultiline : styles.textInput}
      onChangeText={text => data.onChangeText(text)}
      value={data.text}
    />
  );
};
