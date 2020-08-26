import React from 'react';
import {ApplicationStyles, Images, Fonts, Colors, Metrics} from '../../themes';
import {
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Utilities from '../../utilities';
import moment from 'moment';

const CartScreen = () => {
  return (
    <View style={styles.container}>
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
          {'Agrega los servicios segun el orden que deseas recibirlos.'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
      </View>
      <ScrollView style={styles.contentContainer}>
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
                          console.log('removeItem', id);
                          this.removeCartItem(id);
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
          onPress={() => {
            this.props.closeModal();
          }}
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
                {'Ubicacion del servicio'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.modalAddress();
              }}>
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
            <View>
              <FieldCartConfig
                key={'date'}
                textSecondary={''}
                value={user.cart.date ? user.cart.date : false}
                textActive={`${formatDate(user.cart.date, 'dddd, LLL')}`}
                textInactive={'+ Selecciona la fecha del servicio'}
                icon={'calendar'}
              />

              <View
                opacity={0.0}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  backgroundColor: 'red',
                }}>
                <DatePicker
                  date={user.cart.date}
                  locale={'es'}
                  showIcon={false}
                  confirmBtnText={'Confirmar'}
                  cancelBtnText={'Cancelar'}
                  minDate={moment(new Date())
                    .add(1, 'hour')
                    .format('YYYY-MM-DD HH:mm')}
                  maxDate={moment(new Date())
                    .add(30, 'days')
                    .format('YYYY-MM-DD  HH:mm')}
                  placeholder={'text'}
                  mode={'datetime'}
                  format={'YYYY-MM-DD HH:mm'}
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                      right: 30,
                    },
                    dateText: {
                      marginTop: 10,
                      color: 'red',
                      fontSize: 16,
                      fontFamily: Fonts.type.regular,
                    },
                    placeholderText: {
                      color: 'blue',
                      fontSize: 16,
                      width: '100%',
                      fontFamily: Fonts.type.regular,
                      justifyContent: 'center',
                      flex: 1,
                      textAlign: 'center',
                      flexDirection: 'row',
                      marginTop: 9,
                      left: 20,
                    },
                  }}
                  onDateChange={(date) => {
                    console.log('send', date);
                    this.updateDate(date);
                  }}
                  placeholderTextColor={'purple'}
                  underlineColorAndroid={'rgba(0,0,0,0)'}
                  is24Hour={true}
                  androidMode="spinner"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
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
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  notes: user.cart.notes ? user.cart.notes : '',
                  modalNotes: true,
                });
              }}>
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

            console.log('hoursServices', hoursServices);
            if (isCompleted) {
              console.log('isCompleted');
              let data = {
                client: {
                  uid: user.uid,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phone: user.phone,
                  rating: user.rating,
                },
                createDate: firestore.FieldValue.serverTimestamp(),
                cartId: Utilities.create_CARTID(),
                status: 0,
                hoursServices,
                date: `${user.cart.date}`,
                servicesType,
                ...user.cart,
              };
              this.sendOrder(data);
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

      <Modal // notes
        isVisible={modalNotes}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        backdropColor={Colors.pinkMask(0.8)}
        onBackdropPress={() => {
          this.setState({modalNotes: false});
        }}>
        <KeyboardAvoidingView behavior={'padding'} enabled style={{flex: 0}}>
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
            onPress={() => {
              this.setState({
                modalAddress: false,
              });
            }}
          />
          <View
            style={{
              // paddingTop: Metrics.addHeader,
              alignSelf: 'center',
              width: Metrics.screenWidth,

              backgroundColor: Colors.light,
              backdropColor: 'red',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}>
            <TextInput
              value={notes}
              onChangeText={(text) => this.setState({notes: text})}
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
                this.updateNotes(notes);
              }}
              style={[
                {
                  flex: 0,
                  // marginVertical: 2.5,
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
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Agregar comentarios'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  contentContainer: {
    flex: 1,
    width: Metrics.screenWidth,
  },
  footerContainer: {
    flex: 0,
    flexDirection: 'row',
    width: Metrics.screenWidth,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loading: {
    backgroundColor: Colors.loader,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    zIndex: 2000,
  },
  logo: {
    width: Metrics.screenWidth * 0.4,
    height: Metrics.screenWidth * 0.4,
    resizeMode: 'contain',
    marginTop: 10,
  },
  selectorContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },

  welcome: {
    fontFamily: Fonts.type.base,
    color: Colors.dark,
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: Fonts.size.h6,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  descriptorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectorText: {
    marginHorizontal: 20,
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  btnText: {
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  btnRegisterLogin: {
    flex: 0,
    width: Metrics.screenWidth / 2,
    height: 40,
    marginVertical: Metrics.addFooter * 2,
    justifyContent: 'center',
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
  linearGradient: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CartScreen;
