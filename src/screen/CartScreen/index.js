import React, {useEffect, useContext, useState} from 'react';
import {ApplicationStyles, Images, Fonts, Colors, Metrics} from '../../themes';
import {
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native';
import Utilities from '../../utilities';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {updateProfile} from '../../flux/auth/actions';
import {getServices} from '../../flux/services/actions';
import {StoreContext} from '../../flux';
import CardItemCart from '../../components/CardItemCart';
import FieldCartConfig from '../../components/FieldCartConfig';
import {formatDate} from '../../helpers/MomentHelper';
import _ from 'lodash';
import ModalApp from '../../components/ModalApp';
import AppConfig from '../../config/AppConfig';
import {topicPush, getCoverage} from '../../flux/util/actions';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Loading from '../../components/Loading';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CartScreen = (props) => {
  const {setModalCart, setModalAddress} = props;
  const {state, serviceDispatch, authDispatch, utilDispatch} = useContext(
    StoreContext,
  );
  const {auth} = state;
  const {user} = auth;
  const [dateCalendar, setDateCalendar] = useState('');
  const [notes, setNotes] = useState('');
  const [modalNote, setModalNote] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  console.log('moment =>', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));

  // useEffect(() => {
  //   observeUser(authDispatch);
  // }, [authDispatch]);

  useEffect(() => {
    getServices(serviceDispatch);
  }, [serviceDispatch]);

  const updateNotes = async (notes) => {
    Keyboard.dismiss();
    try {
      updateProfile({...user.cart, notes}, 'cart', authDispatch);
      setModalNote(false);
    } catch (err) {
      console.log('updateNotes:error', err);
    }
  };

  const removeCartItem = async (id) => {
    let services = user.cart.services;

    const index = services ? services.findIndex((i) => i.id === id) : -1;

    if (index !== -1) {
      services = [...services.slice(0, index), ...services.slice(index + 1)];

      updateProfile({...user.cart, services}, 'cart', authDispatch);
    }
  };

  const sendOrder = (data) => {
    try {
      firestore()
        .collection('orders')
        .doc(data.id)
        .set(data)
        .then(function () {
          console.log('order:Created');

          let servicesPush = [];
          for (let i = 0; i < data.services.length; i++) {
            if (servicesPush.indexOf(data.services[i].name) === -1) {
              if (i === data.services.length - 1) {
                servicesPush = [
                  ...servicesPush,
                  ` y ${user.cart.services[i].name}`,
                ];
              } else {
                servicesPush = [
                  ...servicesPush,
                  ` ${user.cart.services[i].name}`,
                ];
              }
            }
          }

          let notification = {
            title: 'Nueva orden de servicio La Femme',
            body: `-Cuándo: ${moment(data.date, 'HH:HH').format(
              'LLL',
            )}.\n-Dónde: ${data.address.locality}-${
              data.address.neighborhood
            }.\n-Servicios: ${servicesPush.toString()}.`,
            content_available: true,
            priority: 'high',
          };

          let dataPush = null;

          topicPush('expert', notification, dataPush);

          try {
            updateProfile(
              {
                ...user.cart,
                date: null,
                address: null,
                notes: null,
                services: [],
                coupon: null,
              },
              'cart',
              authDispatch,
            );
          } catch (error) {
            console.lgo('error sendOrder =>', error);
          }
        })
        .catch(function (error) {
          console.error('Error saving order : ', error);
        });
    } catch (error) {
      console.log('sendOrder:error', error);
    }
    setModalCart(false);
  };

  useEffect(() => {
    getCoverage('Medellín', utilDispatch);
  }, [utilDispatch]);

  const handleConfirmDate = (date) => {
    const handleDate = moment(date).format('YYYY-MM-DD');
    const today = new Date();

    if (Date.parse(handleDate) > today) {
      setDateCalendar(handleDate);
      setDatePickerVisibility(false);
      setIsTimePickerVisible(true);
    } else {
      setDatePickerVisibility(false);
      Alert.alert('Ups', 'la fecha tiene que ser mayor ala fecha actual');
    }
  };

  const hideDatePicker = () => {
    setIsTimePickerVisible(false);
    setDatePickerVisibility(false);
  };
  const handleConfirmTime = async (hour) => {
    const dateTime = moment(hour).format('HH:mm:ss');
    console.log('date hour handleTime =>', dateTime);
    const date = `${dateCalendar} ${dateTime}`;

    await updateProfile({...user.cart, date}, 'cart', authDispatch);
  };

  let isCompleted =
    user.cart.address &&
    user.cart.date &&
    user.cart.services.length > 0 &&
    user.cart.notes;

  return (
    <View style={{height: 650}}>
      <Loading type={'client'} />

      <View style={styles.headerContainer}>
        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        <Image
          source={Images.billResume}
          style={{
            width: 30,
            height: 30,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Resumen del Servicio'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Agrega los servicios según el orden que deseas recibirlos.'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
      </View>
      <ScrollView>
        {user &&
          user.cart &&
          user.cart.services &&
          user.cart.services.map((item, index) => {
            return (
              <CardItemCart
                key={index}
                isCart={true}
                showExperts={false}
                data={item}
                removeItem={(id) => {
                  Alert.alert(
                    'Alerta',
                    'Realmente desea eliminar este item de tu lista.',
                    [
                      {
                        text: 'Eliminar',
                        onPress: () => {
                          removeCartItem(id);
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
                }}
              />
            );
          })}
        <TouchableOpacity
          onPress={() => setModalCart(false)}
          style={[
            styles.productContainer,
            {backgroundColor: Colors.client.primaryColor},
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {'+ Agregar servicios'}
          </Text>
        </TouchableOpacity>

        <View opacity={0.0} style={ApplicationStyles.separatorLine} />

        <View style={styles.totalContainer}>
          <Text
            style={Fonts.style.regular(
              Colors.client.primaryColor,
              Fonts.size.medium,
              'left',
            )}>
            {'Total Servicios:'}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.gray, Fonts.size.medium, 'left')}>
            {Utilities.formatCOP(_.sumBy(user.cart.services, 'totalServices'))}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text
            style={Fonts.style.regular(
              Colors.client.primaryColor,
              Fonts.size.medium,
              'left',
            )}>
            {'Total Adicionales:'}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.gray, Fonts.size.medium, 'left')}>
            {Utilities.formatCOP(_.sumBy(user.cart.services, 'totalAddons'))}
          </Text>
        </View>

        <View style={styles.totalContainer}>
          <Text
            style={Fonts.style.bold(
              Colors.client.primaryColor,
              Fonts.size.medium,
              'left',
            )}>
            {'Total:'}
          </Text>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
            {Utilities.formatCOP(_.sumBy(user.cart.services, 'total'))}
          </Text>
        </View>

        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        {user && user.cart && (
          <>
            <View style={styles.itemTitleContainer}>
              <Text
                style={Fonts.style.regular(
                  Colors.client.primaryColor,
                  Fonts.size.medium,
                  'left',
                )}>
                {'Ubicación del servicio'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setModalAddress(true)}>
              <FieldCartConfig
                key={'address'}
                value={user.cart.address ? user.cart.address : false}
                textActive={
                  user.cart.address && `${user.cart.address.formattedAddress}`
                }
                textSecondary={
                  user.cart.address && user.cart.address.addressDetail
                    ? `${user.cart.address.addressDetail}`
                    : ''
                }
                textInactive={'+ Agregar una dirección'}
                icon={
                  user.cart.address
                    ? AppConfig.locationIcon[user.cart.address.type]
                    : 'map-marker-alt'
                }
              />
            </TouchableOpacity>
            {/* date */}

            <View style={styles.itemTitleContainer}>
              <Text
                style={Fonts.style.regular(
                  Colors.client.primaryColor,
                  Fonts.size.medium,
                  'left',
                )}>
                {'Fecha y hora del servicio'}
                {'\n'}
                <Text
                  style={Fonts.style.regular(
                    Colors.gray,
                    Fonts.size.small,
                    'left',
                  )}>
                  {'Selecciona el dia que deseas el servicio.'}
                </Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
              <FieldCartConfig
                key={'date'}
                textSecondary={''}
                value={user.cart.date ? user.cart.date : false}
                textActive={`${formatDate(user.cart.date, 'dddd, LLL')}`}
                textInactive={'+ Selecciona la fecha del servicio'}
                icon={'calendar'}
              />
            </TouchableOpacity>
            <View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                is24Hour={true}
                isDarkModeEnabled={true}
                locale="es_ES"
                headerTextIOS="Elige un a Fecha de reserva"
                cancelTextIOS="Cancelar"
                confirmTextIOS="Confirmar"
              />

              <View
                opacity={0.0}
                style={{
                  position: 'absolute',

                  width: '100%',
                  height: '100%',
                  flex: 1,
                  backgroundColor: 'red',
                }}
              />
            </View>
            <View>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideDatePicker}
                is24Hour={false}
                form
                // isDarkModeEnabled={false}
                locale="es_co"
                format="HH:mm:ss"
                headerTextIOS="Elige un Hora de reserva"
              />

              <View
                opacity={0.0}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',

                  flex: 1,
                  backgroundColor: 'red',
                }}
              />
            </View>
            {/* endDate */}

            <View style={styles.itemTitleContainer}>
              <Text
                style={Fonts.style.regular(
                  Colors.client.primaryColor,
                  Fonts.size.medium,
                  'left',
                )}>
                {'Comentarios'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setModalNote(true)}>
              <FieldCartConfig
                key={'comments'}
                textSecondary={''}
                value={user.cart.notes ? user.cart.notes : false}
                textActive={user.cart.notes}
                textInactive={'+ Agregar notas o comentarios'}
                icon={'comment-alt'}
              />
            </TouchableOpacity>
          </>
        )}
        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
      </ScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={() => {
            let servicesType = [];
            for (let i = 0; i < user.cart.services.length; i++) {
              if (
                servicesType.indexOf(user.cart.services[i].servicesType) === -1
              ) {
                servicesType = [
                  ...servicesType,
                  user.cart.services[i].servicesType,
                ];
              }
            }

            let hoursServices = [];

            // for (user.cart.services)
            for (let i = 0; i < user.cart.services.length; i++) {
              if (i === 0) {
                hoursServices = [...hoursServices, user.cart.date];
              } else {
                hoursServices = [
                  ...hoursServices,
                  moment(user.cart.date, 'YYYY-MM-DD HH:mm')
                    .add(user.cart.services[i - 1].duration, 'minutes')
                    .format('YYYY-MM-DD HH:mm'),
                ];
              }
            }

            if (isCompleted) {
              console.log('isCompleted');
              let data = {
                id: Utilities.create_UUID(),
                experts: null,
                client: {
                  uid: user.uid,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phone: user.phone,
                  rating: user.rating,
                },
                createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                cartId: Utilities.create_CartId(),
                status: 0,
                hoursServices,
                date: `${user.cart.date}`,
                servicesType,
                ...user.cart,
              };
              sendOrder(data);
              console.log('data', data);
            } else {
              Alert.alert(
                'Ups...',
                'Completa todos los items de tu orden para continuar.',
              );
            }
          }}
          style={[
            styles.btnContainer,
            {
              backgroundColor: isCompleted
                ? Colors.client.primaryColor
                : Colors.gray,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {'Reservar'}
          </Text>
        </TouchableOpacity>
      </View>
      <ModalApp open={modalNote} setOpen={setModalNote}>
        <Icon
          name="comment-dots"
          size={50}
          color={Colors.client.primaryColor}
          style={styles.icon}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Añade una nota'}
        </Text>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: 30,
            marginVertical: 8,
            backgroundColor: Colors.light,
            height: 4,
            borderRadius: 2.5,
          }}
          onPress={() => setModalNote(false)}
        />

        <TextInput
          value={notes}
          onChangeText={(text) => setNotes(text)}
          placeholder={'Agrega notas o comentarios'}
          style={{
            width: '90%',
            padding: 20,
            marginVertical: 20,
            borderRadius: Metrics.borderRadius,
            height: 100,
            backgroundColor: Colors.textInputBg,
            alignSelf: 'center',
          }}
          multiline
          numberOfLines={20}
        />

        <TouchableOpacity
          onPress={() => {
            updateNotes(notes);
          }}
          style={[
            {
              flex: 0,
              borderRadius: Metrics.textInBr,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '90%',

              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: Colors.client.primaryColor,
              marginBottom: Metrics.addFooter + 10,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {'Agregar comentarios'}
          </Text>
        </TouchableOpacity>
      </ModalApp>
    </View>
  );
};

const styles = StyleSheet.create({
  itemTitleContainer: {
    marginVertical: 5,
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
  },

  totalContainer: {
    marginVertical: 0,
    alignSelf: 'center',
    width: Metrics.screenWidth * 0.9,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  productContainer: {
    flex: 0,
    marginVertical: 2.5,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  headerContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  footerContainer: {
    flex: 0,
    flexDirection: 'row',
    width: Metrics.screenWidth,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  btnContainer: {
    flex: 0,
    height: 60 + Metrics.addFooter,
    width: Metrics.screenWidth,
    alignSelf: 'center',
    borderTopLeftRadius: Metrics.borderRadius,
    borderTopRightRadius: Metrics.borderRadius,
    paddingBottom: Metrics.addFooter,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.client.primaryColor,
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
  icon: {
    alignSelf: 'center',
    marginTop: 40,
  },
});
export default CartScreen;
