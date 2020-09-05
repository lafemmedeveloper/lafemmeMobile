import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {formatDate} from '../../helpers/MomentHelper';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../themes';

import Utilities from '../../utilities';
import _ from 'lodash';
import CardItemCart from '../../components/CardItemCart';
import FieldCartConfig from '../../components/FieldCartConfig';
import AppConfig from '../../config/AppConfig';

var locationIcon = {
  0: 'home',
  1: 'building',
  2: 'concierge-bell',
  3: 'map-pin',
};

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
const LATITUDE_DELTA = 0.0003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapStyle = require('../../config/mapStyle.json');

export default (dta) => {
  const [expanded, onChangeExpanded] = React.useState(false);

  const {order, user} = dta;

  return (
    <View key={order.cartId} style={styles.contentContainer}>
      <Text
        numberOfLines={1}
        style={Fonts.style.regular(Colors.gray, Fonts.size.small, 'left')}>
        Orden:{' '}
        <Text
          numberOfLines={1}
          style={Fonts.style.bold(
            Colors.client.primaryColor,
            Fonts.size.small,
            'center',
          )}>
          {order.cartId}
        </Text>
      </Text>
      <Image
        source={Images.moto}
        style={{
          alignSelf: 'center',
          resizeMode: 'contain',
          marginTop: 30,
          width: Metrics.screenWidth / 1.2,
        }}
      />
      <View
        style={{
          backgroundColor: Colors.status[order.status],
          width: '50%',
          alignSelf: 'center',
          borderRadius: 10,
          paddingHorizontal: 10,
          marginVertical: 20,
        }}>
        <Text
          numberOfLines={1}
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          {AppConfig.orderStatusStr[order.status]}
        </Text>
      </View>
      {user &&
        order.services.map((item, index) => {
          return (
            <CardItemCart
              key={item.id}
              isCart={false}
              showExperts={true}
              data={item}
              dateOrder={order.hoursServices[index]}
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
          {Utilities.formatCOP(_.sumBy(order.services, 'totalServices'))}
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
          {Utilities.formatCOP(_.sumBy(order.services, 'totalAddons'))}
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
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
          {Utilities.formatCOP(_.sumBy(order.services, 'total'))}
        </Text>
      </View>
      {expanded && (
        <>
          {user && order && (
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
              <View>
                <FieldCartConfig
                  key={'address'}
                  value={order.address ? order.address : false}
                  textActive={
                    order.address && `${order.address.formattedAddress}`
                  }
                  textSecondary={
                    order.address && order.address.addressDetail
                      ? `${order.address.addressDetail}`
                      : ''
                  }
                  textInactive={'+ Agregar una dirección'}
                  icon={
                    order.address
                      ? locationIcon[order.address.type]
                      : 'map-marker-alt'
                  }
                />

                <View
                  pointerEvents={'none'}
                  style={{
                    width: Metrics.screenWidth * 0.9,
                    height: 200,
                    marginTop: 5,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: 10,
                    alignSelf: 'center',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      ...StyleSheet.absoluteFillObject,
                    }}
                    customMapStyle={mapStyle}
                    region={{
                      latitude: order.address.coordinates.latitude,
                      longitude: order.address.coordinates.longitude,
                      latitudeDelta: 0.00001,
                      longitudeDelta: 0.00001 * ASPECT_RATIO,
                    }}>
                    <Marker.Animated
                      coordinate={{
                        latitude: order.address.coordinates.latitude,
                        longitude: order.address.coordinates.longitude,
                      }}>
                      <Icon
                        name={'map-marker-alt'}
                        size={30}
                        color={Colors.client.primaryColor}
                      />
                    </Marker.Animated>
                  </MapView>
                </View>
              </View>

              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primaryColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Fecha del servicio'}
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
                  value={order.day ? order.day : false}
                  textActive={`${formatDate(order.day, 'dddd, LLL')}`}
                  textInactive={'+ Selecciona la fecha del servicio'}
                  icon={'calendar'}
                />
              </View>

              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primaryColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Hora del servicio'}
                  {'\n'}
                  <Text
                    style={Fonts.style.regular(
                      Colors.gray,
                      Fonts.size.small,
                      'left',
                    )}>
                    {'Selecciona la hora estimada para el servicio.'}
                  </Text>
                </Text>
              </View>

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

              <FieldCartConfig
                key={'comments'}
                textSecondary={''}
                value={order.notes ? order.notes : false}
                textActive={order.notes}
                textInactive={'+ Agregar notas o comentarios'}
                icon={'comment-alt'}
              />
            </>
          )}
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        </>
      )}
      <TouchableOpacity
        onPress={() => {
          onChangeExpanded(!expanded);
        }}>
        <Text
          style={Fonts.style.regular(
            Colors.client.primaryColor,
            Fonts.size.medium,
            'center',
          )}>
          {expanded ? 'Ocultar Detalles' : 'Ver detalles'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Alerta',
            'Realmente deseas cancelar esta orden.\n\n(este proceso no puede ser revertido)',
            [
              {
                text: 'No cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Cancelar',
                onPress: () => {
                  console.log('cancelar');
                  dta.cancelOrder(order.id);
                },
              },
            ],
            {cancelable: false},
          );
        }}
        style={[styles.cancelBtn]}>
        <Text
          style={Fonts.style.bold(
            Colors.client.dark,
            Fonts.size.medium,
            'center',
          )}>
          {'Cancelar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cancelBtn: {
    flex: 1,
    marginVertical: 20,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 0,
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  contentContainer: {
    backgroundColor: Colors.light,
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
  },
});
