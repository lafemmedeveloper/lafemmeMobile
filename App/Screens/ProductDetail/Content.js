/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Animated,
  Keyboard,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {Colors, Fonts, Images, Metrics, ApplicationStyles} from '../../Themes';

import Utilities from '../../Utilities';

import _ from 'lodash';

import styles from './styles';

import FastImage from 'react-native-fast-image';

import Modal from 'react-native-modal';
import MyTextInput from '../../Components/MyTextInput';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: '',
      showFinder: false,
      lat: '',
      long: '',
      showModalGuest: false,
      clients: 1,
      guestEmail: '',
      guestFirstName: '',
      guestLastName: '',
      guestPhone: '',
    };
  }

  goBack() {
    const {navigation} = this.props;
    navigation.goBack();
  }

  async addGuest(guestList) {
    const {user, updateProfile, setLoading} = this.props;
    setLoading(true);

    const {guest} = user;
    console.log(guestList, guest);

    let data = [...guest, guestList];
    console.log('addGuest:Data', data);

    await updateProfile(data, 'guest');

    Keyboard.dismiss();
    this.setState({
      guestEmail: '',
      guestFirstName: '',
      guestLastName: '',
      guestPhone: '',
    });
    setLoading(false);
  }

  async deleteGuest(guestId) {
    const {user, updateProfile} = this.props;
    const {guest} = user;
    console.log(guest);
    let data = [];
    const index = guest ? guest.findIndex(i => i.id === guestId) : -1;

    console.log(index);

    if (index !== -1) {
      data = [...guest.slice(0, index), ...guest.slice(index + 1)];
    }
    // let data = _.filter(guest, {id: guestId});

    console.log('deleteGuest:Data', data);

    await updateProfile(data, 'guest');
  }

  render() {
    const {navigation, user} = this.props;
    const {guests} = user;
    const {
      clients,
      guestEmail,
      guestFirstName,
      guestLastName,
      guestPhone,
      showModalGuest,
    } = this.state;

    const {product} = navigation.state.params;

    const {addOns} = product;
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: Colors.client.headerBackground},
        ]}>
        <ScrollView style={[ApplicationStyles.scrollCart, {}]} bounces={true}>
          <View //image
            style={[
              {
                zIndex: 1000,
                width: Metrics.screenWidth,
                height: Metrics.screenWidth / 2,
                resizeMode: 'cover',
                backgroundColor: Colors.client.headerBackground,
              },
              ApplicationStyles.shadownClient,
            ]}>
            <FastImage
              style={{
                // zIndex: 1000,
                width: Metrics.screenWidth,
                height: Metrics.screenWidth / 2,
                resizeMode: 'cover',
                position: 'absolute',
              }}
              source={{
                uri: product.imageUrl,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            <View
              style={{
                // zIndex: 2000,
                width: Metrics.screenWidth,
                height: Metrics.screenWidth / 2,
                resizeMode: 'cover',
                position: 'absolute',
                bottom: 10,
                justifyContent: 'flex-end',
                marginHorizontal: 10,
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  marginLeft: 10,
                  tintColor: Colors.light,
                }}
                source={Images.time}
              />
              <Text
                style={[
                  Fonts.style.bold(
                    Colors.light,
                    Fonts.size.medium,
                    'center',
                    1,
                  ),
                  {position: 'absolute', marginLeft: 35},
                ]}>
                {product.duration} min
              </Text>
            </View>
            <View
              style={{
                // zIndex: 2000,
                // position: 'absolute',
                height: 40 + Metrics.addHeader,
                paddingTop: Metrics.addHeader,
                // backgroundColor: Colors.client.headerBackground,
                width: Metrics.screenWidth,
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={() => this.goBack()}>
                <Image
                  style={{
                    // zIndex: 2100,
                    width: 20,
                    height: 20,
                    marginLeft: 20,
                    resizeMode: 'contain',
                    tintColor: Colors.light,
                  }}
                  source={Images.close}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: Metrics.screenWidth,
              alignSelf: 'center',
              backgroundColor: 'white',
            }}>
            <View style={{height: 20, zIndex: 999}} />
            <View //description
              style={{
                width: Metrics.screenWidth * 0.9,
                alignSelf: 'center',
                // backgroundColor: 'red'
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={Fonts.style.bold(
                    Colors.dark,
                    Fonts.size.h6,
                    'left',
                    1,
                  )}>
                  {product.name}{' '}
                </Text>
                <Text
                  style={Fonts.style.regular(
                    Colors.dark,
                    Fonts.size.h6,
                    'right',
                    1,
                  )}>
                  {Utilities.formatCOP(product.price)}
                </Text>
              </View>
              <Text
                style={Fonts.style.regular(
                  Colors.gray,
                  Fonts.size.small,
                  'left',
                  1,
                )}>
                {product.shortDescription}
              </Text>
              <View style={{height: 20}} />

              <View
                style={{
                  width: Metrics.screenWidth * 0.9,
                  alignSelf: 'center',
                  // height: 20,
                  marginVertical: 5,
                  flexDirection: 'row',
                }}>
                <View style={{flex: 6}}>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'left',
                      1,
                    )}>
                    {'Numero de Clientes'}
                  </Text>
                </View>
                <TouchableOpacity
                  // onPress={() => {
                  //   subClient(clients);
                  // }}
                  style={{flex: 0, alignItems: 'center'}}>
                  {/* <Icon name="minus-circle" size={20} color={Colors.client.primartColor} /> */}
                </TouchableOpacity>
                <View
                  style={{flex: 0, alignItems: 'center', marginHorizontal: 10}}>
                  <Text
                    style={Fonts.style.bold(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                      1,
                    )}>
                    {clients}{' '}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    // addClient(clients);
                    this.setState({showModalGuest: true});
                  }}
                  style={{flex: 0, alignItems: 'center'}}>
                  <Icon
                    name="plus-circle"
                    size={20}
                    color={Colors.client.primartColor}
                  />
                </TouchableOpacity>
              </View>
              {/* {guestItem(clients)} */}

              {clients && clients > 1 && (
                <View
                  style={{
                    width: Metrics.screenWidth * 0.9,
                    alignSelf: 'center',
                    // height: 20,
                    marginVertical: 5,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 6}}>
                    <Text
                      style={Fonts.style.regular(
                        Colors.gray,
                        Fonts.size.small,
                        'left',
                        1,
                      )}>
                      {'Numero de Expertos'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      subExperts(experts);
                    }}
                    style={{flex: 0, alignItems: 'center'}}>
                    <Icon
                      name="minus-circle"
                      size={20}
                      color={Colors.client.primartColor}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 0,
                      alignItems: 'center',
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={Fonts.style.bold(
                        Colors.dark,
                        Fonts.size.small,
                        'center',
                        1,
                      )}>
                      {experts}{' '}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      addExperts(experts);
                    }}
                    style={{flex: 0, alignItems: 'center'}}>
                    <Icon
                      name="plus-circle"
                      size={20}
                      color={Colors.client.primartColor}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <View style={{height: 20}}></View>
              {addOns && addOns.length > 0 && (
                <View //description
                  style={{
                    width: Metrics.screenWidth * 0.9,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={Fonts.style.bold(
                      Colors.dark,
                      Fonts.size.medium,
                      'left',
                      1,
                    )}>
                    {'Servicios Adicionales'}
                  </Text>
                </View>
              )}
              {/* <View style={{ marginHorizontal: 20, alignSelf: 'center' }}> */}
              {addOns &&
                addOns.length > 0 &&
                addOns.map((data, index) => {
                  return (
                    <TouchableOpacity key={index} onPress={() => this.goBack()}>
                      {index == 0 && <View style={{height: 20}}></View>}
                      {index != 0 && (
                        <View
                          opacity={0.25}
                          style={{
                            width: Metrics.screenWidth * 0.5,
                            alignSelf: 'center',
                            height: 0.5,
                            backgroundColor: Colors.dark,
                            marginBottom: 20,
                          }}></View>
                      )}
                      <View
                        style={{
                          flexDirection: 'row',
                          width: Metrics.screenWidth * 0.9,
                          // height: 50,
                          // backgroundColor: 'red'
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 0,
                            // width: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingRight: 10,
                            // height: 50,
                            // backgroundColor: 'blue'
                          }}>
                          <View
                            opacity={0.25}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              backgroundColor: Colors.gray,
                            }}></View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'column',
                            flex: 4,
                            // height: 50,
                            // backgroundColor: 'green'
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 4,
                              // height: 50,
                              // backgroundColor: 'purple'
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={Fonts.style.semiBold(
                                  Colors.dark,
                                  Fonts.size.medium,
                                  'center',
                                  1,
                                )}>
                                {data.name}{' '}
                                <Text
                                  style={Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.small,
                                    'center',
                                    1,
                                  )}>
                                  +{data.duration} min
                                </Text>
                              </Text>
                              <Text
                                style={Fonts.style.semiBold(
                                  Colors.dark,
                                  Fonts.size.small,
                                  'center',
                                  1,
                                )}>
                                +{Utilities.formatCOP(data.price)}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 4,
                            }}>
                            <Text
                              style={Fonts.style.regular(
                                Colors.gray,
                                Fonts.size.small,
                                'left',
                                1,
                              )}>
                              {data.description}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{height: 20}}></View>
                    </TouchableOpacity>
                  );
                })}
              <View style={{height: 10}}></View>
              {/* <View style={{ marginHorizontal: 20, alignSelf: 'center' }}> */}
              <Text
                style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'left', 1)}>
                {'Información adicional'}
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.gray,
                  Fonts.size.medium,
                  'left',
                  1,
                )}>
                {product.description}
              </Text>

              {/* </View> */}
              <View style={{height: 20}}></View>
            </View>
            <View style={{height: 160}}></View>
          </View>
        </ScrollView>
        <View
          style={[
            {
              position: 'absolute',
              height: 150,
              // backgroundColor: Colors.light,
              backgroundColor: Colors.client.headerBackground,
              width: Metrics.screenWidth,
              bottom: 0,
            },
            ApplicationStyles.shadownClientTop,
          ]}>
          <View
            style={[
              {
                height: 60,
                backgroundColor: Colors.light,
                width: Metrics.screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.small,
                'center',
                1,
              )}>
              {'SUBTOTAL'} $45.000
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.medium,
                'center',
                1,
              )}>
              {'80 min'}
            </Text>
          </View>
          <View
            style={[
              {
                // height: 90 + Metrics.addFooter,
                flex: 1,
                backgroundColor: Colors.client.headerBackground,
                width: Metrics.screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Metrics.addFooter,
              },
              ApplicationStyles.shadownClientTop,
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.h6,
                'center',
                1,
              )}>
              {'AGREGAR SERVICIO'}
            </Text>
          </View>
        </View>

        <Modal
          isVisible={showModalGuest}
          style={{
            justifyContent: 'flex-end',
            margin: 0,

            // ,height: Metrics.screenHeight * 0.7
            // top:100,
          }}
          backdropColor={'rgba(100,74, 87, 0.75)'}>
          <View
            style={{
              // flex: 1,
              // paddingTop: Metrics.addHeader,
              width: Metrics.screenWidth,
              height: Metrics.screenHeight * 0.85,
              backgroundColor: Colors.light,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({showModalGuest: false});
                // showModalGuest(false);
              }}>
              <Text>─</Text>
            </TouchableOpacity>

            <View>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                  1,
                )}>
                Agrega o selecciona un invitado a tu servicio
              </Text>
            </View>
            <MyTextInput
              pHolder={'Nombre'}
              text={guestFirstName}
              onChangeText={guestFirstName => this.setState({guestFirstName})}
              secureText={false}
              textContent={'name'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={'Apellido'}
              text={guestLastName}
              onChangeText={guestLastName => this.setState({guestLastName})}
              secureText={false}
              textContent={'familyName'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={'Email'}
              text={guestEmail}
              onChangeText={guestEmail => this.setState({guestEmail})}
              secureText={false}
              textContent={'emailAddress'}
              autoCapitalize={'none'}
            />
            <MyTextInput
              pHolder={'Teléfono (opcional)'}
              text={guestPhone}
              onChangeText={guestPhone => this.setState({guestPhone})}
              secureText={false}
              textContent={'telephoneNumber'}
              autoCapitalize={'none'}
            />
            <TouchableOpacity
              onPress={() => {
                if (guestEmail && guestFirstName && guestLastName) {
                  data = {
                    email: guestEmail,
                    firstName: guestFirstName,
                    id: Utilities.create_UUID(),
                    lastName: guestLastName,
                    phone: guestPhone,
                  };
                  this.addGuest(data);
                } else {
                  Alert.alert('Ups...', 'Completa los datos para continuar.');
                }
              }}
              style={{
                width: Metrics.screenWidth * 0.5,
                height: 40,
                marginVertical: 10,
                alignSelf: 'center',
                borderRadius: Metrics.borderRadius,
                backgroundColor: Colors.client.headerBackground,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                  1,
                )}>
                Agregar Invitado
              </Text>
            </TouchableOpacity>
            <SwipeListView
              data={user.guest}
              renderItem={data => (
                <TouchableOpacity
                  activeOpacity={1.0}
                  onPress={() => {
                    console.log('You touched me', data.item);

                    // setGuests([...guests, data.item.id]);
                  }}
                  style={{
                    alignItems: 'flex-start',
                    backgroundColor: Colors.light,
                    borderBottomColor: Colors.MyTextInputputBg,
                    borderBottomWidth: 1,
                    justifyContent: 'center',
                    height: 80,
                  }}>
                  <View style={{flexDirection: 'row'}} key={data.item.email}>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        marginHorizontal: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          backgroundColor: Colors.client.primartColor,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={Fonts.style.bold(
                            Colors.light,
                            Fonts.size.medium,
                            'center',
                            1,
                          )}>
                          {data.item.firstName[0]}
                          {data.item.lastName[0]}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,

                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={Fonts.style.bold(
                          Colors.dark,
                          Fonts.size.small,
                          'center',
                          1,
                        )}>
                        {data.item.firstName} {data.item.lastName}
                      </Text>
                      <Text
                        style={Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.small,
                          'center',
                          0,
                        )}>
                        {data.item.email}
                      </Text>
                      <Text
                        style={Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.small,
                          'center',
                          0,
                        )}>
                        {data.item.phone}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        width: 50,
                        height: 80,
                        flex: 0,
                        marginHorizontal: 10,
                        // backgroundColor: Colors.client.primartColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {guests &&
                      guests.findIndex(i => i === data.item.id) !== -1 ? (
                        <Icon
                          name="toggle-on"
                          size={25}
                          color={Colors.client.primartColor}
                        />
                      ) : (
                        <Icon name="toggle-off" size={25} color={Colors.gray} />
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              renderHiddenItem={(data, rowMap) => (
                <View
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    height: 80,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // padding: 15
                  }}>
                  <View
                    style={{
                      flex: 1,
                      height: 80,
                      backgroundColor: Colors.MyTextInputputBg,
                    }}></View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Alerta',
                        `Realmente desea eliminar a ${data.item.firstName} ${data.item.lastName} de tu lista de invitados.`,
                        [
                          {
                            text: 'Eliminar',
                            onPress: () => {
                              console.log('DeleteGuest', data.item.id);
                              this.deleteGuest(data.item.id);
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
                    style={{
                      flex: 0,
                      width: 50,
                      height: 80,
                      backgroundColor: Colors.MyTextInputputBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    // onPress={() => this.deleteRow(rowMap, data.item.key)}
                  >
                    <Animated.View style={[styles.trash, {}]}>
                      <Icon
                        name="trash-o"
                        size={25}
                        color={Colors.client.primartColor}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              )}
              leftOpenValue={0}
              rightOpenValue={-50}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={300}
              // onRowDidOpen={this.onRowDidOpen}
              // onSwipeValueChange={this.onSwipeValueChange}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
