import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Metrics, Colors, Fonts} from '../../../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Utilities from '../../../../utilities';

const HandleGuest = ({
  guest,
  guestList,
  selectGuest,
  deleteGuest,
  setGuestModal,
  product,
  loading,
}) => {
  return (
    <View>
      <Text
        style={Fonts.style.semiBold(Colors.dark, Fonts.size.medium, 'left', 1)}>
        {'Invitados'}
      </Text>
      {guest.map((data) => {
        return (
          <TouchableOpacity
            key={data.id}
            onPress={() => selectGuest(data)}
            style={{
              width: Metrics.screenWidth * 0.85,
              alignSelf: 'flex-end',
              marginVertical: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text>
              {guestList.findIndex((i) => i.id === data.id) !== -1 ? (
                <Icon
                  name="toggle-on"
                  size={20}
                  color={Colors.expert.primaryColor}
                />
              ) : (
                <Icon name="toggle-off" size={20} color={Colors.gray} />
              )}
            </Text>
            <View
              style={{
                flex: 1,

                marginHorizontal: 5,
              }}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'left',
                  0,
                )}>
                {data.firstName} {data.lastName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Alerta',
                  `Realmente desea eliminar a ${data.firstName} ${data.lastName} de tu lista de invitados.`,
                  [
                    {
                      text: 'Eliminar',
                      onPress: () => {
                        deleteGuest(data.id);
                      },
                    },
                    {
                      text: 'Cancelar',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                  ],
                  {cancelable: true},
                );
              }}>
              {loading ? (
                <ActivityIndicator
                  animating
                  color={Colors.expert.primaryColor}
                />
              ) : (
                <Icon name="minus-circle" size={20} color={Colors.gray} />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={() => {
          setGuestModal(true);
        }}
        style={{
          width: Metrics.screenWidth * 0.85,
          height: 30,
          alignSelf: 'flex-end',
          backgroundColor: Colors.expert.primaryColor,
          borderRadius: 10,
          marginVertical: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.small, 'center', 1)}>
          {'Agregar Invitado'}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          width: Metrics.screenWidth * 0.9,
          alignSelf: 'center',
          marginVertical: 5,
          flexDirection: 'row',
        }}>
        <View style={{flex: 6}}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left', 1)}>
            {'Numero de Clientes'} ({guestList.length + 1})
          </Text>
        </View>

        <View style={{flex: 0, alignItems: 'center'}}>
          <Text
            style={Fonts.style.bold(
              Colors.dark,
              Fonts.size.medium,
              'right',
              1,
            )}>
            {Utilities.formatCOP((guestList.length + 1) * product.price)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HandleGuest;
