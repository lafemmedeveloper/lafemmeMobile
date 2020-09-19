import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import ModalApp from '../../../../components/ModalApp';
import {Colors, Fonts} from '../../../../themes';
import ModalQualtification from './ModalQualtification';

const Qualification = (props) => {
  const {expert, id} = props;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <View style={styles.container}>
        <Text
          style={Fonts.style.regular(
            Colors.lightGray,
            Fonts.size.input,
            'left',
          )}>
          {'Buscando experto'}
        </Text>
        <Text
          style={[
            Fonts.style.regular(Colors.lightGray, Fonts.size.h6, 'left'),
            {marginTop: 10},
          ]}>
          {'Preparando tu orden'}
        </Text>

        <Text
          style={[
            Fonts.style.regular(Colors.lightGray, Fonts.size.regular, 'left'),
            {marginTop: 10},
          ]}>
          {'Tu experto va en camino'}
        </Text>
        <Text
          style={[
            Fonts.style.bold(
              Colors.client.primaryColor,
              Fonts.size.regular,
              'center',
            ),
            {marginTop: 10},
          ]}>
          {'Servicio finalizado'}
        </Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => setModalOpen(true)}>
        <Text
          style={[Fonts.style.bold(Colors.light, Fonts.size.input, 'center')]}>
          {'Califica tu servicio'}
        </Text>
      </TouchableOpacity>
      <ModalApp open={modalOpen} setOpen={setModalOpen}>
        <ModalQualtification
          expert={expert}
          orderId={id}
          close={setModalOpen}
        />
      </ModalApp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: Colors.client.primaryColor,
    width: '90%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
export default Qualification;
