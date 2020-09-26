import React, {useContext} from 'react';
import {Colors} from '../../themes';
import Modal from 'react-native-modal';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {StoreContext} from '../../flux';

export default ({open, children, setOpen}) => {
  const {state} = useContext(StoreContext);
  const {util} = state;
  const {deviceInfo} = util;

  const appType = deviceInfo;
  return (
    <>
      <Modal
        isVisible={open}
        onBackdropPress={() =>
          setOpen ? setOpen(false) : console.log('not close')
        }
        backdropColor={
          appType.appType === 'expert'
            ? Colors.expert.primaryColor
            : Colors.pinkMask(0.75)
        }
        style={styles.Modal}>
        <TouchableOpacity style={styles.musk} onPress={() => setOpen(false)} />
        <View style={styles.container}>{children}</View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    overflow: 'hidden',
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
    alignSelf: 'center',
    marginBottom: -15,
    top: 0,
    zIndex: 100,
  },
});
