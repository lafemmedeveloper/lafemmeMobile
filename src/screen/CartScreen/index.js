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
  ActivityIndicator,
} from 'react-native';
import Utilities from '../../utilities';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {activeMessage, updateProfile} from '../../flux/auth/actions';
import {getServices} from '../../flux/services/actions';
import {StoreContext} from '../../flux';
import CardItemCart from '../../components/CardItemCart';
import FieldCartConfig from '../../components/FieldCartConfig';
import {formatDate} from '../../helpers/MomentHelper';
import _ from 'lodash';
import ModalApp from '../../components/ModalApp';
import AppConfig from '../../config/AppConfig';
import {topicPush, getCoverage, addCoupon} from '../../flux/util/actions';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Loading from '../../components/Loading';
import ModalCuopon from './ModalCuopon';
import utilities from '../../utilities';
import {useKeyboard} from '../../hooks/useKeyboard';

const CartScreen = (props) => {
  const {setModalCart, setModalAddress} = props;
  const {state, serviceDispatch, authDispatch, utilDispatch} = useContext(
    StoreContext,
  );
  const {auth} = state;
  const {user} = auth;
  const [notes, setNotes] = useState('');
  const [modalNote, setModalNote] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalCoupon, setModalCoupon] = useState(false);
  const [keyboardHeight] = useKeyboard();

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

  const sendOrder = async (data) => {
    await activeMessage(data.id, authDispatch);
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
            body: `-Cuándo: ${data.date}.\n-Dónde: ${data.address.locality}-${
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
            console.log('error sendOrder =>', error);
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

  const hideDatePicker = async () => {
    setDatePickerVisibility(false);
  };

  let isCompleted =
    user.cart.address && user.cart.date && user.cart.services.length > 0;

  const activeSendOrder = () => {
    let servicesType = [];
    for (let i = 0; i < user.cart.services.length; i++) {
      if (servicesType.indexOf(user.cart.services[i].servicesType) === -1) {
        servicesType = [...servicesType, user.cart.services[i].servicesType];
      }
    }

    let hoursServices = [];

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
        noteQualtification: '',
        fcmClient: user.fcm,
        fcmExpert: '',
        id: Utilities.create_UUID(),
        experts: null,
        client: {
          uid: user.uid,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          rating: user.rating,
          guest: user.guest,
          numberOfServices: user.numberOfServices,
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
    } else {
      Alert.alert(
        'Ups...',
        'Completa todos los items de tu orden para continuar.',
      );
    }
  };

  const removeItem = async (id) => {
    if (!user.cart.coupon) {
      const filterService = user.cart.services.filter((s) => s.id !== id);
      const emptyCart = {
        ...user.cart,
        services: [],
      };
      if (filterService !== 0) {
        await updateProfile(emptyCart, 'cart', authDispatch);
      }
    } else {
      //desactive coupon
      const math = user.cart.coupon.existence;
      await addCoupon(user.cart.coupon.id, math, utilDispatch);
      const filterService = user.cart.services.filter((s) => s.id !== id);
      const emptyCart = {
        ...user.cart,
        services: [],
        coupon: null,
      };
      if (filterService !== 0) {
        await updateProfile(emptyCart, 'cart', authDispatch);
      }
    }
  };

  const handleConfirmDate = async (date) => {
    const handleDate = moment(date).format('YYYY-MM-DD HH:mm');
    await updateProfile({...user.cart, date: handleDate}, 'cart', authDispatch);
    setDatePickerVisibility(false);
  };
  const activeCuopon = () => {
    if (user.cart.services.length > 0) {
      setModalCoupon(true);
    } else {
      Alert.alert('Ups', 'Necesitas primero agregar un servicio');
    }
  };

  const totalService =
    user.cart?.services.length > 0 ? _.sumBy(user.cart.services, 'total') : 0;
  return (
    <View style={{height: 650}}>
      <Loading type={'client'} />

      <View style={styles.headerContainer}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        <Image
          source={Images.billResume}
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
          {'Resumen del Servicio'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Agrega los servicios según el orden que deseas recibirlos.'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
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
                removeItem={removeItem}
              />
            );
          })}
        {user &&
          user.cart &&
          user.cart.services &&
          user.cart.services.length === 0 && (
            <TouchableOpacity
              onPress={() => setModalCart(false)}
              style={[
                styles.productContainer,
                {backgroundColor: Colors.client.primaryColor},
              ]}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'+ Agregar servicios'}
              </Text>
            </TouchableOpacity>
          )}

        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <View style={styles.totalContainer}>
          <Text
            style={Fonts.style.regular(
              Colors.client.primaryColor,
              Fonts.size.medium,
              'left',
            )}>
            {'Sub Total:'}
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
        {user.cart.coupon && (
          <View style={styles.totalContainer}>
            <Text
              style={Fonts.style.regular(
                Colors.client.primaryColor,
                Fonts.size.medium,
                'left',
              )}>
              Cupón:
            </Text>
            <Text style={Fonts.style.bold('red', Fonts.size.medium, 'left')}>
              -{' '}
              {user?.cart.coupon?.typeCoupon === 'percentage'
                ? `${user?.cart.coupon?.percentage}%`
                : utilities.formatCOP(user?.cart.coupon?.money)}
            </Text>
          </View>
        )}

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
            {user.cart.coupon
              ? user.cart.coupon.typeCoupon !== 'money'
                ? utilities.formatCOP(
                    (user.cart.coupon.percentage / 100) * totalService -
                      totalService,
                  )
                : utilities.formatCOP(totalService - user?.cart.coupon?.money)
              : utilities.formatCOP(totalService)}
          </Text>
        </View>

        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
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
                isDarkModeEnabled={false}
                mode="datetime"
                maximumDate={new Date(moment(new Date()).add(15, 'days'))}
                minimumDate={new Date()}
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                is24Hour={false}
                locale="es_ES"
                headerTextIOS="Elige una fecha de servicio"
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
                  backgroundColor: 'green',
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
                {'Comentarios (Opcional)'}
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
            <View style={styles.itemTitleContainer}>
              <Text
                style={Fonts.style.regular(
                  Colors.client.primaryColor,
                  Fonts.size.medium,
                  'left',
                )}>
                {!user?.cart.coupon
                  ? '¿Tienes algún cupón?'
                  : 'Usaste el cupón'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                !user?.cart.coupon
                  ? activeCuopon()
                  : Alert.alert('Ups', 'Solo se permite un cupón por servicio')
              }>
              <FieldCartConfig
                key={'cuopons'}
                textSecondary={''}
                value={user?.cart.coupon ? user?.cart.coupon.coupon : false}
                textActive={user?.cart.coupon?.coupon}
                textInactive={'+ Agrega un cupón'}
                icon={'barcode'}
              />
            </TouchableOpacity>
          </>
        )}
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      </ScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={() => activeSendOrder()}
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
        <Loading type={'client'} />

        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        <Image
          source={Images.note}
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
          {'Añade una nota '}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Agrega detalles de tu orden'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: 30,
            backgroundColor: Colors.light,

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
            borderRadius: Metrics.borderRadius,
            height: 100,
            backgroundColor: Colors.textInputBg,
            alignSelf: 'center',
          }}
          multiline
          numberOfLines={20}
        />

        <TouchableOpacity
          onPress={() => updateNotes(notes)}
          style={[
            styles.btnContainerNote,
            {
              backgroundColor: Colors.client.primaryColor,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {!state.auth.loading ? (
              'Agregar comentarios'
            ) : (
              <ActivityIndicator color={Colors.light} />
            )}
          </Text>
        </TouchableOpacity>
        <View style={{height: keyboardHeight}} />
      </ModalApp>

      <ModalApp open={modalCoupon} setOpen={setModalCoupon}>
        <ModalCuopon
          total={_.sumBy(user.cart.services, 'total')}
          type={
            user.cart.services.length > 0
              ? user.cart.services[0].servicesType
              : []
          }
          close={setModalCoupon}
        />
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
    height: 50 + Metrics.addFooter,
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
  btnContainerNote: {
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
});
export default CartScreen;
