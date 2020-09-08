import React, {useContext} from 'react';
import {Colors} from '../../themes';
import Modal from 'react-native-modal';
import {View, StyleSheet} from 'react-native';
import {StoreContext} from '../../flux';

export default (data) => {
  const {open, children, setOpen} = data;
  const {state} = useContext(StoreContext);
  const {util} = state;
  const {deviceInfo} = util;

  const appType = deviceInfo;
  console.log('appType =>', appType);
  return (
    <Modal
      isVisible={open}
      onBackdropPress={() => setOpen(false)}
      backdropColor={
        appType.appType === 'expert'
          ? Colors.expert.primaryColor
          : Colors.pinkMask(0.75)
      }
      style={styles.Modal}>
      <View style={styles.musk} />
      <View style={styles.container}>{children}</View>
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
});
