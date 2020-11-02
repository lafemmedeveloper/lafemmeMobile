import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Metrics, Colors, Fonts, ApplicationStyles} from '../../../themes';
import Utilities from '../../../utilities';
import ModalApp from '../../../components/ModalApp';
import FormGuest from './FormGuest';
import {updateProfile} from '../../../flux/auth/actions';
import _ from 'lodash';
import {minToHours} from '../../../helpers/MomentHelper';
import {useNavigation} from '@react-navigation/native';

import {StoreContext} from '../../../flux';
import HandleGuest from './HandleGuest';
import HandleAddOns from './HandleAddOns';
import HandleResume from './HandleResume';

const Cart = (props) => {
  const navigation = useNavigation();
  const modelExpert = {
    id: null,
    firstName: null,
    lastName: null,
    image: null,
    ranking: null,
    thumbnail: null,
    coordinates: {
      latitude: null,
      longitude: null,
    },
  };
  const initial_state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
  const {state, authDispatch} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;
  const {guest} = user;
  const {product} = props;

  const [guestModal, setGuestModal] = useState(false);
  const [formGuest, setFormGuest] = useState(initial_state);
  const [guestList, setGuestList] = useState([]);
  const [addonsGuest, setAddonsGuest] = useState([]);
  const [addonsList, setAddonsList] = useState([]);
  const [addonsListCount, setAddonsListCount] = useState([]);
  const [experts, setExperts] = useState(modelExpert);
  const [showModalService, setShowModalService] = useState(false);

  const addGuest = async () => {
    const guestUser = Object.assign(formGuest, {id: Utilities.create_UUID()});

    let data = [...guest, guestUser];
    await updateProfile(data, 'guest', authDispatch);

    Keyboard.dismiss();

    setGuestModal(false);
    setFormGuest(initial_state);
  };

  const deleteGuest = async (guestId) => {
    let data = [];
    const index = guest ? guest.findIndex((i) => i.id === guestId) : -1;

    if (index !== -1) {
      data = [...guest.slice(0, index), ...guest.slice(index + 1)];

      await updateProfile(data, 'guest', authDispatch);
    }
  };

  const selectGuest = async (item) => {
    let data = guestList;
    const index = guestList ? guestList.findIndex((i) => i.id === item.id) : -1;

    if (index !== -1) {
      let addonsGuestFilter = _.filter(
        addonsGuest,
        ({guestId}) => guestId !== item.id,
      );

      setAddonsGuest(addonsGuestFilter);

      data = [...guestList.slice(0, index), ...guestList.slice(index + 1)];
    } else {
      data = guestList && guestList ? [...guestList, item] : [item];
    }

    setGuestList(data);
  };

  const selectAddons = (item) => {
    let data = addonsList;
    const index = addonsList
      ? addonsList.findIndex((i) => i.id === item.id)
      : -1;

    let itemData;

    if (item.isCountAddon) {
      itemData = {
        count: 1,
        addOnPrice: item.price,
        addonsDuration: item.duration,
        ...item,
      };
    } else {
      itemData = {
        count: 0,
        addOnPrice: item.price,
        addonsDuration: item.duration,
        ...item,
      };
    }

    if (index !== -1) {
      let addonsGuest = _.filter(
        addonsGuest,
        ({addonId}) => addonId !== item.id,
      );

      setAddonsList(addonsGuest);

      data = [...addonsList.slice(0, index), ...addonsList.slice(index + 1)];
      setAddonsGuest([]);
    } else {
      data = addonsList && addonsList ? [...addonsList, itemData] : [itemData];
      setAddonsList(data);
    }
  };

  const countableAddOrRemove = (add, indexItem) => {
    let count = add
      ? addonsList[indexItem].count + 1
      : addonsList[indexItem].count > 1
      ? addonsList[indexItem].count - 1
      : 1;

    let item = {
      ...addonsList[indexItem],
      count,
      addOnPrice: count * addonsList[indexItem].price,
      addonsDuration: count * addonsList[indexItem].duration,
    };

    let _addonsList = addonsList;
    _addonsList[indexItem] = item;
    setAddonsListCount([_addonsList]);
  };

  const selectAddonGuest = (addonSelected, guest) => {
    let item = {
      addonId: addonSelected.id,
      addOnPrice: addonSelected.price,
      guestId: guest.id,
      addonName: addonSelected.name,
      addonsDuration: addonSelected.duration,
    };

    let data = addonsGuest ? addonsGuest : [];

    const indexAddonId = addonsGuest
      ? addonsGuest.findIndex(
          (i) => i.addonId === addonSelected.id && i.guestId === guest.id,
        )
      : -1;

    if (indexAddonId !== -1) {
      data = [
        ...addonsGuest.slice(0, indexAddonId),
        ...addonsGuest.slice(indexAddonId + 1),
      ];
    } else {
      data = addonsGuest ? [...addonsGuest, item] : [item];
    }

    setAddonsGuest(data);
  };

  const sendItemCart = async (item) => {
    let old = user.cart.services ? user.cart.services : [];

    let services = [...old, item];

    console.log('services', services);

    await updateProfile({...user.cart, services}, 'cart', authDispatch);

    setShowModalService(false);
    setExperts({});
    navigation.navigate('Home');
  };

  const {addOns} = product;

  let addOnPrice = _.sumBy(addonsGuest, 'addOnPrice');
  let addOnDuration = _.sumBy(addonsGuest, 'addonsDuration');

  let countItems = _.filter(addonsList, (item) => item.isCountAddon === true);

  let addOnCountPrice = _.sumBy(countItems, 'addOnPrice');
  let addOnCountDuration = _.sumBy(countItems, 'addonsDuration');

  let timeTotal =
    (product.duration * (guestList.length + 1) +
      addOnDuration +
      addOnCountDuration) /
    1;

  const addOnsFilter = addOns.filter((a) => a.isEnabled === true);

  return (
    <View
      style={{
        width: Metrics.screenWidth,
        flex: 1,
        backgroundColor: Colors.light,
      }}>
      <ScrollView>
        <FastImage
          style={styles.imageProduct}
          source={{
            uri: product.imageUrl.big,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View
          style={{
            backgroundColor: 'white',
            zIndex: 10000,
            height: 20,
            width: '100%',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            position: 'absolute',
            top: 260,
          }}
        />
        <View
          style={{
            width: Metrics.screenWidth,
            flex: 1,
            alignSelf: 'center',
            backgroundColor: Colors.light,
          }}>
          <View //description
            style={{
              width: Metrics.screenWidth * 0.9,
              alignSelf: 'center',
            }}>
            <View
              style={{
                flex: 0,
                marginVertical: 10,
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
                  {product.name}
                </Text>
                <Text
                  style={[
                    Fonts.style.regular(Colors.dark, Fonts.size.h6, 'right', 1),
                  ]}>
                  {Utilities.formatCOP(product.price)}
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
                style={[
                  Fonts.style.light(Colors.dark, Fonts.size.medium, 'left', 0),
                  {marginTop: 10},
                ]}>
                {product.description}
              </Text>
            </View>

            <View opacity={0.25} style={[ApplicationStyles.separatorLine]} />

            {/* Guest */}
            <HandleGuest
              guest={guest}
              guestList={guestList}
              selectGuest={selectGuest}
              deleteGuest={deleteGuest}
              setGuestModal={setGuestModal}
              product={product}
            />

            {/* Guest */}

            <>
              <View opacity={0.25} style={ApplicationStyles.separatorLine} />

              <View // experts
                style={{
                  width: Metrics.screenWidth * 0.9,
                  alignSelf: 'center',
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
                    {1}
                  </Text>
                </View>
              </View>
            </>

            {addOnsFilter.length > 0 && (
              <>
                <View opacity={0.25} style={ApplicationStyles.separatorLine} />

                <HandleAddOns
                  addOnsFilter={addOnsFilter}
                  user={user}
                  countItems={countItems}
                  selectAddons={selectAddons}
                  guestList={guestList}
                  addonsGuest={addonsGuest}
                  countableAddOrRemove={countableAddOrRemove}
                  selectAddonGuest={selectAddonGuest}
                  addonsList={addonsList}
                  product={product}
                  addonsListCount={addonsListCount}
                />
              </>
            )}
          </View>
          <View opacity={0.25} style={ApplicationStyles.separatorLine} />
          <View //description
            style={{
              width: Metrics.screenWidth * 0.9,
              alignSelf: 'center',
            }}>
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'left', 1)}>
              {'Información adicional'}
            </Text>
            <Text
              style={Fonts.style.light(
                Colors.dark,
                Fonts.size.small,
                'left',
                0,
              )}>
              {product.description}
            </Text>
          </View>
        </View>
        <View style={{height: 200}} />
      </ScrollView>

      <View
        style={[
          {
            height: 130,
            backgroundColor: Colors.client.primaryColor,
            width: Metrics.screenWidth,
            bottom: 0,
            position: 'absolute',
            shadowColor: Colors.client.primaryColors,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
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
            {'SUBTOTAL '}
            {Utilities.formatCOP(
              product.price * (guestList.length + 1) +
                addOnPrice +
                addOnCountPrice,
            )}
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.gray,
              Fonts.size.medium,
              'center',
              0,
            )}>
            {minToHours(timeTotal)} - {' 1 Experto'}
          </Text>
        </View>
        {/*show from  user.cart.services.length */}
        <TouchableOpacity
          onPress={() => setShowModalService(true)}
          style={[
            {
              flex: 1,
              backgroundColor: Colors.client.primaryColor,
              width: Metrics.screenWidth,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: Metrics.addFooter,
            },
            ApplicationStyles.shadowsClientTop,
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.h6, 'center', 1)}>
            {'AGREGAR SERVICIO'}
          </Text>
        </TouchableOpacity>
      </View>
      <ModalApp open={guestModal} setOpen={setGuestModal}>
        <FormGuest
          setForm={setFormGuest}
          form={formGuest}
          addGuest={addGuest}
        />
      </ModalApp>

      <ModalApp open={showModalService} setOpen={setShowModalService}>
        <HandleResume
          guestList={guestList}
          countItems={countItems}
          experts={experts}
          product={product}
          addOnPrice={addOnPrice}
          user={user}
          timeTotal={timeTotal}
          addOnCountPrice={addOnCountPrice}
          addonsGuest={addonsGuest}
          setShowModalService={setShowModalService}
          sendItemCart={sendItemCart}
        />
      </ModalApp>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  imageProduct: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.5,
    resizeMode: 'cover',
  },
});
