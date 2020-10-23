import React from 'react';
import {Colors, Fonts} from '../../../../themes';
import Modal from 'react-native-modal';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ModalComponent = (data) => {
  const {open, children, setOpen, title, lastTitle, nameIcon, type} = data;

  return (
    <Modal
      isVisible={open}
      onBackdropPress={() => setOpen(false)}
      backdropColor={Colors.pinkMask(0.75)}
      style={styles.Modal}>
      <View style={styles.musk} />
      <View style={styles.container}>
        <Icon
          name={nameIcon}
          size={50}
          color={type ? Colors[type].primaryColor : Colors.client.primaryColor}
          style={styles.icon}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {title}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {lastTitle}
        </Text>

        {children}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    paddingTop: 20,
  },
  Modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  musk: {
    backgroundColor: Colors.lightGray,
    height: 5,
    width: 30,
    borderRadius: 4,
    zIndex: 10,
    alignSelf: 'center',
    marginBottom: -15,
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 10,
  },
});
export default ModalComponent;
