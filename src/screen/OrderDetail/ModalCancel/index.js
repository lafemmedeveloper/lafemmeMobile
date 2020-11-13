import React from 'react';
import {Image, Text, View, TouchableOpacity, Alert} from 'react-native';
import Loading from '../../../components/Loading';
import {updateOrder, updateStatus} from '../../../flux/util/actions';
import {ApplicationStyles, Colors, Fonts, Images} from '../../../themes';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ModalCancel = ({service, order, dispatch, menuIndex, close}) => {
  const handleCancel = async () => {
    await updateStatus(7, order, dispatch);
    close(false);
  };

  const handleOneCancel = async () => {
    let handleOrder = order;
    handleOrder.services[menuIndex].status = 7;
    await updateOrder(handleOrder, dispatch);
    close(false);
  };
  return (
    <>
      <View style={{marginBottom: 40}}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.cancel}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
            tintColor: Colors.client.primaryColor,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'¿Realmente deseas cancelar una orden?'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Elige que orden cancelar'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <View style={{marginHorizontal: 20, marginVertical: 20}}>
          <TouchableOpacity
            style={{justifyContent: 'space-between', flexDirection: 'row'}}
            onPress={() =>
              Alert.alert(
                'Confirmación',
                `¿Realmente desea cancelar el servicio de ${service.name}?`,
                [
                  {
                    text: 'SI',
                    onPress: () => {
                      handleOneCancel();
                    },
                  },
                  {
                    text: 'NO',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                ],
                {cancelable: true},
              )
            }>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'left',
              )}>
              Cancelar la orden actual de{' '}
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.medium,
                  'left',
                )}>
                {service.name} ?
              </Text>
            </Text>
            <Icon name="cancel" color={Colors.client.primaryColor} size={20} />
          </TouchableOpacity>
          <View opacity={0.25} style={ApplicationStyles.separatorLineMini} />

          <TouchableOpacity
            style={{justifyContent: 'space-between', flexDirection: 'row'}}
            onPress={() =>
              Alert.alert(
                'Confirmación',
                '¿Realmente desea cancelar todos los servicios?',
                [
                  {
                    text: 'SI',
                    onPress: () => {
                      handleCancel();
                    },
                  },
                  {
                    text: 'NO',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                ],
                {cancelable: true},
              )
            }>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'left',
              )}>
              Cancelar todas las ordenes?
            </Text>
            <Icon name="cancel" color={Colors.client.primaryColor} size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <Loading type="client" />
    </>
  );
};
export default ModalCancel;
