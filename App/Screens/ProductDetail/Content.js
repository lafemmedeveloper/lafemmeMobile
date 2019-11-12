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
  KeyboardAvoidingView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {Colors, Fonts, Images, Metrics, ApplicationStyles} from '../../Themes';

import Utilities from '../../Utilities';

import _ from 'lodash';

import styles from './styles';

import FastImage from 'react-native-fast-image';

import Modal from 'react-native-modal';
import MyTextInput from '../../Components/MyTextInput';
import Loading from '../../Components/Loading';
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
      experts: 1,
      guestEmail: '',
      guestFirstName: '',
      guestLastName: '',
      guestPhone: '',
      guestList: [],
      addonsList: [],
      addonsGuest: [],
      addonsSum: 0,
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
    // console.log('addGuest:Data', data);

    await updateProfile(data, 'guest');

    Keyboard.dismiss();
    this.setState({
      guestEmail: '',
      guestFirstName: '',
      guestLastName: '',
      guestPhone: '',
      showModalGuest: false,
    });
    setLoading(false);
  }

  async deleteGuest(guestId) {
    const {user, updateProfile, setLoading} = this.props;

    const {guest} = user;
    setLoading(true);

    let data = [];
    const index = guest ? guest.findIndex(i => i.id === guestId) : -1;

    console.log(index);

    if (index !== -1) {
      data = [...guest.slice(0, index), ...guest.slice(index + 1)];
      // console.log('deleteGuest:Data', data);

      await updateProfile(data, 'guest');
      setLoading(false);
    }
  }

  async selectGuest(item) {
    console.log('You touched me', item.id);
    const {guestList} = this.state;
    let data = guestList;
    const index = guestList ? guestList.findIndex(i => i.id === item.id) : -1;

    if (index !== -1) {
      data = [...guestList.slice(0, index), ...guestList.slice(index + 1)];
    } else {
      data = guestList && guestList ? [...guestList, item] : [item];
    }

    this.setState({guestList: data});
  }

  async selectAddons(item) {
    console.log('You touched me', item.id);
    const {addonsList} = this.state;
    let data = addonsList;
    const index = addonsList ? addonsList.findIndex(i => i.id === item.id) : -1;

    if (index !== -1) {
      data = [...addonsList.slice(0, index), ...addonsList.slice(index + 1)];
    } else {
      data = addonsList && addonsList ? [...addonsList, item] : [item];
    }

    this.setState({addonsList: data}, () => {
      console.log('=> addonlist', this.state.addonsList);
    });
  }

  selectAddonGuest(addonSelected, guest, indexItem) {
    console.log('=> 0 indexItem', indexItem);
    console.log('=> 1 addonSelected', addonSelected);
    console.log('=> 2 guest', guest);

    const {addonsGuest} = this.state;
    let item = {
      addonId: addonSelected.id,
      addOnPrice: addonSelected.price,
      guestId: guest.id,
    };

    let data = addonsGuest;
    console.log('=> 3 pre:item', item);

    const indexAddonId = addonsGuest
      ? addonsGuest.findIndex(i => i.addonId === addonSelected.id)
      : -1;

    const indexGuestId = addonsGuest
      ? addonsGuest.findIndex(i => i.guestId === guest.id)
      : -1;

    console.log('indexAddonId', indexAddonId, 'indexGuestId', indexGuestId);
    if (indexAddonId !== -1 && indexGuestId !== -1) {
      data = [
        ...addonsGuest.slice(0, indexItem),
        ...addonsGuest.slice(indexItem + 1),
      ];
    } else {
      data = addonsGuest ? [...addonsGuest, item] : [item];
    }
    console.log('=> 4 post:data', data);

    var addonsSum = _.sumBy(data, 'addOnPrice');

    console.log('addonsSum', addonsSum);

    this.setState({addonsGuest: data, addonsSum}, () => {
      console.log('=> addonsGuest', this.state.addonsGuest);
    });
  }

  addExperts(value) {
    const {experts, guestList} = this.state;
    if (experts <= guestList.length) {
      this.setState({experts: value + 1});
    }
  }

  subExperts(value) {
    const {experts} = this.state;
    if (experts > 1) {
      this.setState({experts: value - 1});
    }
  }

  render() {
    const {navigation, user} = this.props;
    const {guest} = user;
    const {
      clients,
      experts,
      guestEmail,
      guestFirstName,
      guestLastName,
      guestPhone,
      showModalGuest,
      guestList,
      addonsList,
      addonsGuest,
      addonsSum,
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
                  {Utilities.formatCOP(product.price)}{' '}
                  <Text
                    style={Fonts.style.regular(
                      Colors.gray,
                      Fonts.size.small,
                      'right',
                      1,
                    )}>
                    c/u
                  </Text>
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

              <View opacity={0.25} style={ApplicationStyles.separatorLine} />

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
                    style={Fonts.style.bold(
                      Colors.dark,
                      Fonts.size.small,
                      'left',
                      1,
                    )}>
                    {'Numero de Clientes'} ({guestList.length + 1})
                  </Text>
                </View>
                <TouchableOpacity
                  // onPress={() => {
                  //   subClient(clients);
                  // }}
                  style={{flex: 0, alignItems: 'center'}}>
                  {/* <Icon name="minus-circle" size={20} color={Colors.client.primartColor} /> */}
                </TouchableOpacity>
                <View style={{flex: 0, alignItems: 'center'}}>
                  <Text
                    style={Fonts.style.bold(
                      Colors.dark,
                      Fonts.size.small,
                      'right',
                      1,
                    )}>
                    {Utilities.formatCOP(
                      product.price * (guestList.length + 1),
                    )}
                  </Text>
                </View>
              </View>
              {/* {guestItem(clients)} */}

              {/* {guestList.map((data, index) => { */}

              <View
                style={{
                  width: Metrics.screenWidth * 0.9,
                  alignSelf: 'flex-end',
                  marginVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>
                  <Icon
                    name="toggle-on"
                    size={25}
                    color={Colors.client.primartColor}
                  />
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
                      1,
                    )}>
                    {user.firstName} {user.lastName} (yo)
                  </Text>
                </View>
              </View>

              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'left',
                  1,
                )}>
                {'Invitados'}
              </Text>

              {guest.map((data, index) => {
                return (
                  <TouchableOpacity
                    key={data.id}
                    onPress={() => {
                      // console.log('data', data);

                      this.selectGuest(data);
                    }}
                    style={{
                      width: Metrics.screenWidth * 0.85,
                      alignSelf: 'flex-end',
                      marginVertical: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>
                      {guestList.findIndex(i => i.id === data.id) !== -1 ? (
                        <Icon
                          name="toggle-on"
                          size={20}
                          color={Colors.client.primartColor}
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
                          1,
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
                                console.log('DeleteGuest', data.id);
                                this.deleteGuest(data.id);
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
                      <Icon name="minus-circle" size={20} color={Colors.gray} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() => {
                  this.setState({showModalGuest: true});
                }}
                style={{
                  width: Metrics.screenWidth * 0.85,
                  height: 30,
                  alignSelf: 'flex-end',
                  backgroundColor: Colors.client.headerBackground,
                  borderRadius: 10,
                  marginVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={Fonts.style.bold(
                    Colors.light,
                    Fonts.size.small,
                    'center',
                    1,
                  )}>
                  {'Agregar Invitado'}
                </Text>
              </TouchableOpacity>

              {/* {guestList.length >= 1 && ( */}
              <>
                <View style={{height: 20}} />
                <View opacity={0.25} style={ApplicationStyles.separatorLine} />

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
                      style={Fonts.style.bold(
                        Colors.dark,
                        Fonts.size.small,
                        'left',
                        1,
                      )}>
                      {'Numero de Expertos'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.subExperts(experts);
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
                      this.addExperts(experts);
                    }}
                    style={{flex: 0, alignItems: 'center'}}>
                    <Icon
                      name="plus-circle"
                      size={20}
                      color={Colors.client.primartColor}
                    />
                  </TouchableOpacity>
                </View>
              </>
              {/* )} */}
              <View style={{height: 20}} />

              <View opacity={0.25} style={ApplicationStyles.separatorLine} />

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
                    <View key={index}>
                      {index === 0 && <View style={{height: 20}} />}
                      {index !== 0 && (
                        <View
                          opacity={0.25}
                          style={{
                            width: Metrics.screenWidth * 0.5,
                            alignSelf: 'center',
                            height: 0.5,
                            backgroundColor: Colors.dark,
                            marginBottom: 20,
                          }}
                        />
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
                          <TouchableOpacity
                            onPress={() => {
                              console.log(data);
                              this.selectAddons(data);
                            }}>
                            <Text>
                              {addonsList.findIndex(i => i.id === data.id) !==
                              -1 ? (
                                <Icon
                                  name="toggle-on"
                                  size={25}
                                  color={Colors.client.primartColor}
                                />
                              ) : (
                                <Icon
                                  name="toggle-off"
                                  size={25}
                                  color={Colors.gray}
                                />
                              )}
                            </Text>
                          </TouchableOpacity>
                          {/* <View
                            opacity={0.25}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              backgroundColor: Colors.gray,
                            }}></View> */}
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
                                +{Utilities.formatCOP(data.price)}{' '}
                                <Text
                                  style={Fonts.style.regular(
                                    Colors.gray,
                                    Fonts.size.small,
                                    'right',
                                    1,
                                  )}>
                                  c/u
                                </Text>
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

                      {addonsList.findIndex(i => i.id === data.id) !== -1 && (
                        <TouchableOpacity
                          onPress={() => {
                            this.selectAddonGuest(data, {id: 'yo'});
                          }}
                          style={{
                            width: Metrics.screenWidth * 0.8,
                            alignSelf: 'flex-end',
                            marginVertical: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text>
                            {addonsGuest.findIndex(
                              i => i.addonId === data.id,
                            ) !== -1 &&
                            addonsGuest.findIndex(i => i.guestId === 'yo') !==
                              -1 ? (
                              <Icon
                                name="toggle-on"
                                size={20}
                                color={Colors.client.primartColor}
                              />
                            ) : (
                              <Icon
                                name="toggle-off"
                                size={20}
                                color={Colors.gray}
                              />
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
                                1,
                              )}>
                              {user.firstName} {user.lastName} (yo)
                            </Text>
                          </View>
                          <View>
                            {addonsGuest.findIndex(
                              i => i.addonId === data.id,
                            ) !== -1 &&
                            addonsGuest.findIndex(i => i.guestId === 'yo') !==
                              -1 ? (
                              <Text
                                style={Fonts.style.regular(
                                  Colors.dark,
                                  Fonts.size.small,
                                  'left',
                                  1,
                                )}>
                                +{Utilities.formatCOP(data.price)}
                              </Text>
                            ) : (
                              <Text
                                style={Fonts.style.regular(
                                  Colors.dark,
                                  Fonts.size.small,
                                  'left',
                                  1,
                                )}>
                                +{Utilities.formatCOP(0)}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      )}

                      {addonsList.findIndex(i => i.id === data.id) !== -1 &&
                        guestList.map((item, indexItem) => {
                          return (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => {
                                this.selectAddonGuest(data, item, indexItem);
                              }}
                              style={{
                                width: Metrics.screenWidth * 0.8,
                                alignSelf: 'flex-end',
                                marginVertical: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text>
                                {addonsGuest.findIndex(
                                  i => i.addonId === data.id,
                                ) !== -1 &&
                                addonsGuest.findIndex(
                                  i => i.guestId === item.id,
                                ) !== -1 ? (
                                  <Icon
                                    name="toggle-on"
                                    size={20}
                                    color={Colors.client.primartColor}
                                  />
                                ) : (
                                  <Icon
                                    name="toggle-off"
                                    size={20}
                                    color={Colors.gray}
                                  />
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
                                    Fonts.size.small,
                                    'left',
                                    1,
                                  )}>
                                  {item.firstName} {item.lastName} (+
                                  {data.duration} min)
                                </Text>
                              </View>
                              <View>
                                {addonsGuest.findIndex(
                                  i => i.addonId === data.id,
                                ) !== -1 &&
                                addonsGuest.findIndex(
                                  i => i.guestId === item.id,
                                ) !== -1 ? (
                                  <Text
                                    style={Fonts.style.regular(
                                      Colors.dark,
                                      Fonts.size.small,
                                      'left',
                                      1,
                                    )}>
                                    +{Utilities.formatCOP(data.price)}
                                  </Text>
                                ) : (
                                  <Text
                                    style={Fonts.style.regular(
                                      Colors.dark,
                                      Fonts.size.small,
                                      'left',
                                      1,
                                    )}>
                                    +{Utilities.formatCOP(0)}
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          );
                        })}

                      <View style={{height: 20}} />
                    </View>
                  );
                })}

              <View style={{height: 20}} />
              {/* <View style={{ marginHorizontal: 20, alignSelf: 'center' }}> */}
              <View opacity={0.25} style={ApplicationStyles.separatorLine} />
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
              <View style={{height: 20}} />
            </View>
            <View style={{height: 160}} />
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
              {'SUBTOTAL'}{' '}
              {Utilities.formatCOP(
                product.price * (guestList.length + 1) + addonsSum,
              )}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.medium,
                'center',
                1,
              )}>
              {(product.duration * (guestList.length + 1)) / experts} min
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
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            style={{
              flex: 0,
              // paddingTop: Metrics.addHeader,
              width: Metrics.screenWidth,
              paddingHorizontal: 20,
              // height: Metrics.screenHeight * 0.85,
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
              onChangeText={text => this.setState({guestFirstName: text})}
              secureText={false}
              textContent={'name'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={'Apellido'}
              text={guestLastName}
              onChangeText={text => this.setState({guestLastName: text})}
              secureText={false}
              textContent={'familyName'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={'Email'}
              text={guestEmail}
              onChangeText={text => this.setState({guestEmail: text})}
              secureText={false}
              textContent={'emailAddress'}
              autoCapitalize={'none'}
            />
            <MyTextInput
              pHolder={'Teléfono (opcional)'}
              text={guestPhone}
              onChangeText={text => this.setState({guestPhone: text})}
              secureText={false}
              textContent={'telephoneNumber'}
              autoCapitalize={'none'}
            />
            <TouchableOpacity
              onPress={() => {
                if (guestEmail && guestFirstName && guestLastName) {
                  let data = {
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
            <View style={{height: Metrics.addFooter + 10}}></View>
            {/* <SwipeListView
              data={user.guest}
              renderItem={data => (
                <TouchableOpacity
                  activeOpacity={1.0}
                  onPress={() => {
                    this.selectGuest(data.item);
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

                    <View
                      style={{
                        width: 50,
                        height: 80,
                        flex: 0,
                        marginHorizontal: 10,
                        // backgroundColor: Colors.client.primartColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {guestList.findIndex(i => i.id === data.item.id) !==
                      -1 ? (
                        <Icon
                          name="toggle-on"
                          size={25}
                          color={Colors.client.primartColor}
                        />
                      ) : (
                        <Icon name="toggle-off" size={25} color={Colors.gray} />
                      )}
                    </View>
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
            /> */}
          </KeyboardAvoidingView>
        </Modal>

        <Loading/>
      </View>
    );
  }
}
