import React from 'react';
import styles from './styles';
import {Colors} from '../../themes';
import Modal from 'react-native-modal';
import {View} from 'react-native';

export default (data) => {
  const {open, children, setOpen} = data;
  return (
    <Modal
      isVisible={open}
      onBackdropPress={() => setOpen(false)}
      backdropColor={Colors.pinkMask(0.75)}
      style={styles.Modal}>
      <View style={styles.icon} />
      <View style={styles.container}>{children}</View>
    </Modal>
  );
};
