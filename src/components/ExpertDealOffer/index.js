import React, {useEffect, useContext, useRef, Fragment} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {formatDate} from '../../helpers/MomentHelper';

import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../themes';
import AppConfig from '../../config/AppConfig';
import {
  assignExpert,
  assingExpertService,
  updateStatus,
} from '../../flux/util/actions';
import {StoreContext} from '../../flux';
import ExpertOrder from '../ExpertOrder';

export default ({order, dispatch, user}) => {
  const {utilDispatch} = useContext(StoreContext);
  const isMountedRef = useRef(null);

  const assingService = async (item) => {
    try {
      if (!user.activity.includes(item.servicesType)) {
        return Alert.alert(
          'Ups',
          `Lo siento no puedes tomar el servicio por que no posees la actividad ${item.servicesType
            .toUpperCase()
            .split('-')
            .join(' ')}`,
        );
      }
      let orderServices = order;
      const indexService = order.services.findIndex((i) => i.id === item.id);
      orderServices.services[indexService].uid = user.uid;
      orderServices.services[indexService].status = 1;
      await assingExpertService(orderServices, user, dispatch);
      await assignExpert(user, order, dispatch);
    } catch (error) {
      console.log('errorassing expert ==>', error);
    }
  };

  useEffect(() => {
    if (order.experts.length === order.services.length) {
      isMountedRef.current = true;
      updateStatus(1, order, utilDispatch);
      return () => {
        return () => (isMountedRef.current = false);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  if (!order) {
    return null;
  } else {
    return (
      <>
        <View style={styles.cellContainer}>
          <View style={styles.contentContainer}>
            <View style={{flexDirection: 'column'}}>
              <Text
                numberOfLines={1}
                style={Fonts.style.regular(
                  Colors.gray,
                  Fonts.size.small,
                  'left',
                )}>
                Orden:{' '}
                <Text
                  numberOfLines={1}
                  style={Fonts.style.bold(
                    Colors.expert.primaryColor,
                    Fonts.size.small,
                    'center',
                  )}>
                  {order.cartId}
                </Text>
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'left',
                )}>
                <Icon
                  name={'map-marker-alt'}
                  size={12}
                  color={Colors.expert.primaryColor}
                />{' '}
                {order.address.name}
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'left',
                )}>
                <Icon
                  name={'calendar'}
                  size={12}
                  color={Colors.expert.primaryColor}
                />{' '}
                {formatDate(order.date, 'ddd, LL')}
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'left',
                )}>
                <Icon
                  name={'clock'}
                  size={12}
                  color={Colors.expert.primaryColor}
                />{' '}
                {formatDate(order.date, 'h:mm a')}
              </Text>
            </View>
            <View
              style={{
                width: 140,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={Images.moto}
                style={{
                  height: 55,
                  width: 140,
                  resizeMode: 'contain',
                }}
              />
              <View
                style={{
                  backgroundColor: Colors.status[order.status],
                  marginTop: 5,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                }}>
                <Text
                  numberOfLines={1}
                  style={Fonts.style.bold(Colors.light, Fonts.size.tiny)}>
                  {AppConfig.orderStatusStr[order.status]}
                </Text>
              </View>
            </View>
          </View>

          {order.services.map((item, index) => {
            return (
              <Fragment key={index}>
                {order.services.length > 1 && (
                  <View
                    opacity={0.25}
                    style={[ApplicationStyles.separatorLine]}
                  />
                )}
                <View style={styles.contentText}>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={Fonts.style.regular(
                        Colors.gray,
                        Fonts.size.small,
                      )}>
                      Servicio:{' '}
                      <Text
                        numberOfLines={1}
                        style={Fonts.style.bold(
                          Colors.expert.primaryColor,
                          Fonts.size.small,
                        )}>
                        {item.name}
                      </Text>
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={Fonts.style.regular(
                        Colors.gray,
                        Fonts.size.small,
                        'left',
                      )}>
                      Clientes:{' '}
                      <Text
                        numberOfLines={1}
                        style={Fonts.style.bold(
                          Colors.expert.primaryColor,
                          Fonts.size.small,
                        )}>
                        {item.clients.length}
                        <Text
                          numberOfLines={1}
                          style={Fonts.style.regular(
                            Colors.gray,
                            Fonts.size.small,
                            'left',
                          )}>
                          , Calificación:{' '}
                          <Text
                            numberOfLines={1}
                            style={Fonts.style.bold(
                              Colors.expert.primaryColor,
                              Fonts.size.small,
                            )}>
                            {(order.client.rating
                              ? order.client.rating
                              : 5
                            ).toFixed(1)}
                          </Text>
                        </Text>
                      </Text>
                    </Text>
                  </View>
                  {!item.uid ? (
                    <TouchableOpacity
                      disabled={!user.activity.includes(item.servicesType)}
                      style={
                        !user.activity.includes(item.servicesType)
                          ? styles.btnDisable
                          : styles.btnContainer
                      }
                      onPress={() => assingService(item)}>
                      <Text
                        style={Fonts.style.bold(
                          !user.activity.includes(item.servicesType)
                            ? Colors.gray
                            : Colors.light,
                          Fonts.size.small,
                          'center',
                        )}>
                        Tomar Servicio
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <ExpertOrder service={item} order={order} />
                  )}
                </View>
              </Fragment>
            );
          })}
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 0,
    height: 40,
    width: 80,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,
    backgroundColor: Colors.expert.primaryColor,
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
  btnDisable: {
    flex: 0,
    height: 40,
    width: 80,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,
    backgroundColor: Colors.disabledBtn,
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
  contentText: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cellContainer: {
    backgroundColor: Colors.light,
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,

    shadowColor: Colors.client.primaryColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.84,

    elevation: 2,
  },

  contentContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});
