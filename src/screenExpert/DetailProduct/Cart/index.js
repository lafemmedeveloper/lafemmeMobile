import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

//Modules
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';

//Flux
import {StoreContext} from '../../../flux';
import {updateClient, updateOrder} from '../../../flux/services/actions';

//Components
import HandleGuest from './HandleGuest';
import HandleAddOns from './HandleAddOns';
import HandleResume from './HandleResume';
import FormGuest from './FormGuest';
import ModalApp from '../../../components/ModalApp';
//Theme
import {Metrics, Colors, Fonts, ApplicationStyles} from '../../../themes';

//Util
import Utilities from '../../../utilities';
import {minToHours} from '../../../helpers/MomentHelper';

const Cart = ({product, order, currentService}) => {
  const navigation = useNavigation();

  const initial_state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  const {state, serviceDispatch} = useContext(StoreContext);
  const {util} = state;
  const {expertOpenOrders} = util;

  const orderSnap = expertOpenOrders.filter((o) => o.id === order.id)[0];
  const {services} = orderSnap;

  const indexService = services.findIndex((s) => s.id === currentService.id);

  const {addOns} = product;
  const addonsEnable = addOns.filter((a) => a.isEnabled === true);

  const [guestModal, setGuestModal] = useState(false);
  const [formGuest, setFormGuest] = useState(initial_state);
  const [showModalService, setShowModalService] = useState(false);
  const [loading, setLoading] = useState(false);

  const [guestList, setGuestList] = useState(
    orderSnap.services[indexService].clients.filter((c) => c.id !== 'yo'),
  );
  const [addonsGuest, setAddonsGuest] = useState(services[indexService].addons);
  const [addOnsFilter] = useState(addonsEnable);

  const [addonsList, setAddonsList] = useState(
    services[indexService].addOnsCount.concat(services[indexService].addons),
  );
  const [addonsListCount, setAddonsListCount] = useState(
    services[indexService].addons,
  );

  const addGuest = async () => {
    Keyboard.dismiss();
    const guestUser = Object.assign(formGuest, {id: Utilities.create_UUID()});
    let currentService = orderSnap;

    currentService.services[indexService].clients = [
      ...orderSnap.services[indexService].clients,
      guestUser,
    ];
    await updateOrder(
      currentService.services,
      'services',
      order.id,
      serviceDispatch,
    );

    await updateClient(
      [...orderSnap.client.guest, guestUser],
      'guest',
      orderSnap.client.uid,
      serviceDispatch,
    );

    setGuestModal(false);
    setFormGuest(initial_state);
  };

  const deleteGuest = async (guestId) => {
    setLoading(true);
    let currentService = orderSnap;

    let delGuest = orderSnap.services[indexService].clients.filter(
      (c) => c.id !== guestId,
    );
    currentService.services[indexService].clients = delGuest;

    await updateOrder(
      currentService.services,
      'services',
      order.id,
      serviceDispatch,
    );
    setLoading(false);
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
      let addonsGuest = _.filter(addonsGuest, ({id}) => id !== item.id);

      setAddonsList(addonsGuest);

      data = [...addonsList.slice(0, index), ...addonsList.slice(index + 1)];
    } else {
      data = addonsList && addonsList ? [...addonsList, itemData] : [itemData];
    }
    setAddonsList(data);
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
      id: addonSelected.id,
      addOnPrice: addonSelected.price,
      guestId: guest.id,
      addonName: addonSelected.name,
      addonsDuration: addonSelected.duration,
    };

    let data = addonsGuest ? addonsGuest : [];

    const indexAddonId = addonsGuest
      ? addonsGuest.findIndex(
          (i) => i.id === addonSelected.id && i.guestId === guest.id,
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
    setLoading(true);
    let currentService = orderSnap;
    currentService.services[indexService] = item;
    await updateOrder(services, 'services', order.id, serviceDispatch);

    setShowModalService(false);
    setLoading(false);
    navigation.navigate('TabBottom');
  };

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

  const addCart = () => {
    setShowModalService(true);
  };
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
              guest={orderSnap.services[indexService].clients.filter(
                (c) => c.id !== 'yo',
              )}
              guestList={guestList}
              selectGuest={selectGuest}
              deleteGuest={deleteGuest}
              setGuestModal={setGuestModal}
              product={product}
              loading={loading}
            />

            {/* Guest */}

            {addOnsFilter.length > 0 && (
              <>
                <View opacity={0.25} style={ApplicationStyles.separatorLine} />

                <HandleAddOns
                  addOnsFilter={addOnsFilter}
                  user={orderSnap.client}
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
            {'Subtotal '}
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
            {minToHours(timeTotal)}
          </Text>
        </View>
        {/*show from  user.cart.services.length */}
        <TouchableOpacity
          onPress={() => addCart()}
          style={[
            {
              flex: 1,
              backgroundColor: Colors.expert.primaryColor,
              width: Metrics.screenWidth,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: Metrics.addFooter,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.h6, 'center', 1)}>
            {'Agregar Servicio'}
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
          product={product}
          addOnPrice={addOnPrice}
          user={orderSnap.client}
          timeTotal={timeTotal}
          addOnCountPrice={addOnCountPrice}
          addonsGuest={addonsGuest}
          setShowModalService={setShowModalService}
          sendItemCart={sendItemCart}
          lastTotal={services[indexService].total}
          order={orderSnap}
          currentService={currentService}
          loading={loading}
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
