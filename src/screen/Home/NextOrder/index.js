import React, {useState, useEffect} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Colors, Fonts, Images} from '../../../themes';

import AppConfig from '../../../config/AppConfig';

import moment from 'moment';

export default (dta) => {
  const {order, activeDetailModal} = dta;

  useEffect(() => {
    countdown(order.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentService = moment(order.date).format('dd,ll');
  const [dateCount, setDateCount] = useState('');
  const [stopTime, setStopTime] = useState(false);

  const getRemainingTime = (deadline) => {
    let now = new Date(),
      remainTime = (new Date(deadline) - now + 1000) / 1000,
      remainSeconds = ('0' + Math.floor(remainTime % 60)).slice(-2),
      remainMinutes = ('0' + Math.floor((remainTime / 60) % 60)).slice(-2),
      remainHours = ('0' + Math.floor((remainTime / 3600) % 24)).slice(-2),
      remainDays = Math.floor(remainTime / (3600 * 24));

    return {
      remainSeconds,
      remainMinutes,
      remainHours,
      remainDays,
      remainTime,
    };
  };

  const countdown = (deadline) => {
    const timerUpdate = setInterval(() => {
      let t = getRemainingTime(deadline);
      setDateCount(
        `${t.remainDays}d:${t.remainHours}h:${t.remainMinutes}m:${t.remainSeconds}s`,
      );
      if (t.remainTime <= 1) {
        clearInterval(timerUpdate);
        activeStatus(true);
      }
      if (Math.sign(t.remainDays) === -1) {
        setStopTime(true);
      }
    }, 1000);
  };
  const activeStatus = (data) => {
    console.log('Data activeStatus ==>', data);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => activeDetailModal(order)}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={Fonts.style.bold(Colors.light, Fonts.size.small, 'left')}>
            Proxima Orden:{' '}
            <Text
              numberOfLines={1}
              style={Fonts.style.semiBold(
                Colors.light,
                Fonts.size.small,
                'center',
              )}>
              {order.cartId}
            </Text>
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'map-marker-alt'} size={12} color={Colors.light} />{' '}
            {order.address.name}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'calendar'} size={12} color={Colors.light} />{' '}
            {currentService}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'running'} size={12} color={Colors.light} /> Faltan{' '}
            <Text
              style={Fonts.style.regular(
                !stopTime ? Colors.dark : Colors.light,
                Fonts.size.small,
                'left',
              )}>
              {!stopTime ? dateCount : 'Terminado'}
            </Text>
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
              style={Fonts.style.bold(Colors.light, Fonts.size.tiny, 'left')}>
              {AppConfig.orderStatusStr[order.status]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.expert.primaryColor,
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});