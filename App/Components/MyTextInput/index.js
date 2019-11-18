/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, TextInput} from 'react-native';

import styles from './styles';

export default data => {
  return (
    // <View style={data.multiline ? styles.containerMultiline : styles.container}>
    <TextInput
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
    // </View>
  );
};
