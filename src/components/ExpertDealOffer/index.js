import React, {useEffect, useContext, useRef, useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {formatDate} from '../../helpers/MomentHelper';

import {Colors, Fonts, Images, Metrics} from '../../themes';
import AppConfig from '../../config/AppConfig';
import {assignExpert, updateStatus} from '../../flux/util/actions';
import {StoreContext} from '../../flux';
import ModalApp from '../ModalApp';
import ModalService from '../ModalService';

export default ({order, dispatch, user}) => {
  const {utilDispatch} = useContext(StoreContext);
  const isMountedRef = useRef(null);
  const [modalService, setModalService] = useState(false);

  const validateService = () => {
    if (order.services.length > 1) {
      setModalService(true);
    } else {
      assignExpert(user, order, dispatch);
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
            <View style={styles.contentText}>
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                }}>
                <Text
                  numberOfLines={1}
                  style={Fonts.style.bold(
                    Colors.light,
                    Fonts.size.tiny,
                    'left',
                  )}>
                  {AppConfig.orderStatusStr[order.status]}
                </Text>
              </View>
            </View>
          </View>

          {order.services.map((item, index) => {
            return (
              <View key={index} style={styles.contentText}>
                <Text
                  numberOfLines={1}
                  style={Fonts.style.regular(
                    Colors.gray,
                    Fonts.size.small,
                    'left',
                  )}>
                  Servicio:{' '}
                  <Text
                    numberOfLines={1}
                    style={Fonts.style.bold(
                      Colors.expert.primaryColor,
                      Fonts.size.small,
                      'center',
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
                      'center',
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
                          'center',
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
            );
          })}

          <View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => validateService()}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                Tomar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ModalApp setOpen={setModalService} open={modalService}>
          <ModalService
            order={order}
            user={user}
            dispatch={utilDispatch}
            close={setModalService}
            assignExpert={assignExpert}
          />
        </ModalApp>
      </>
    );
  }
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,
    backgroundColor: Colors.expert.secondaryColor,
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
    justifyContent: 'center',
  },

  cellContainer: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
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

  contentContainer: {flexDirection: 'row'},
});
