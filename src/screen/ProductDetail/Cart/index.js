import React, {useState, useContext} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Metrics, Colors, Fonts, ApplicationStyles} from 'App/themes';
import Utilities from 'App/utilities';
import ModalApp from 'App/components/ModalApp';
import FormGuest from './FormGuest';
import {addGuestDb, updateUser, setUserCart} from 'App/flux/auth/actions';
import _ from 'lodash';
import {minToHours} from '../../../helpers/MomentHelper';
import {useNavigation} from '@react-navigation/native';

import {StoreContext} from 'App/flux';
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

  const addGuest = () => {
    const guestUser = Object.assign(formGuest, {id: Utilities.create_UUID()});
    addGuestDb({user, guestUser}, authDispatch);
    setGuestModal(false);
    setFormGuest(initial_state);
  };

  const deleteGuest = async (guestId) => {
    let data = [];
    const index = guest ? guest.findIndex((i) => i.id === guestId) : -1;

    if (index !== -1) {
      data = [...guest.slice(0, index), ...guest.slice(index + 1)];

      updateUser(data, authDispatch);
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

      setAddonsGuest({
        addonsGuestFilter,
      });

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
    } else {
      data = addonsList && addonsList ? [...addonsList, itemData] : [itemData];
      return setAddonsList(data);
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

  const selectAddonGuest = (addonSelected, guest, indexItem) => {
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

  const sendItemCart = (item) => {
    setUserCart(item, user, authDispatch);
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
    <>
      <ScrollView style={ApplicationStyles.scrollCart}>
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
                style={Fonts.style.light(
                  Colors.dark,
                  Fonts.size.medium,
                  'left',
                  0,
                )}>
                {product.shortDescription}
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

              <View
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
                    {1}{' '}
                  </Text>
                </View>
              </View>
            </>

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
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          {
            height: 150,
            backgroundColor: Colors.client.primaryColor,
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
            {'SUBTOTAL'}
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
            ApplicationStyles.shadownClientTop,
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
    </>
  );
};

export default Cart;
