import React from 'react';
import {Text} from 'react-native';
import {Colors, Fonts} from '../../../../themes';

const Cancelled = () => {
  return (
    <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
      {'Orden cancelada'}
    </Text>
  );
};

export default Cancelled;
