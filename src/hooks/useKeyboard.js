import {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardDidShow(e) {
    if (Platform.OS === 'ios') {
      setKeyboardHeight(e.endCoordinates.height);
    }
  }

  function onKeyboardDidHide() {
    if (Platform.OS === 'ios') {
      setKeyboardHeight(0);
    }
  }
  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardWillShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', onKeyboardDidHide);
    };
  }, []);

  return [keyboardHeight];
};
