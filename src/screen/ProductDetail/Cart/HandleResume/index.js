import React from 'react';
import {
  Text,
  KeyboardAvoidingView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Metrics,
  Colors,
  Fonts,
  ApplicationStyles,
  Images,
} from '../../../../themes';
import {ScrollView} from 'react-native-gesture-handler';
import TitleValue from '../../../../components/TitleValue';
import Utilities from '../../../../utilities';
import _ from 'lodash';
import {minToHours} from '../../../../helpers/MomentHelper';

const HandleResume = ({
  guestList,
  countItems,
  product,
  addOnPrice,
  user,
  timeTotal,
  addOnCountPrice,
  addonsGuest,
  setShowModalService,
  sendItemCart,
}) => {
  let gList = [
    {
      email: user.email,
      firstName: user.firstName,
      id: 'yo',
      lastName: user.lastName,
      phone: user.phone,
    },
    ...guestList,
  ];

  let data = {
    productPrice: product.price,
    name: product.name,
    img: product.imageUrl.medium,
    servicesType: product.slug,
    clients: gList,
    order: user.cart.services.length,
    status: 0,
    uid: null,
    id: Utilities.create_UUID(),
    addons: addonsGuest,
    addOnsCount: countItems,
    duration: timeTotal,
    totalServices: product.price * (guestList.length + 1),
    totalAddons: addOnPrice + addOnCountPrice,
    total:
      product.price * (guestList.length + 1) + addOnPrice + addOnCountPrice,
    comment: null,
    commentClient: null,
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={{
          flex: 0,
          maxHeight: Metrics.screenHeight * 0.8,
          width: Metrics.screenWidth,
          paddingHorizontal: 20,
          backgroundColor: Colors.light,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}>
        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        <ScrollView>
          <Image
            source={Images.billResume}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginBottom: 20,
              tintColor: Colors.client.primaryColor,
            }}
          />
          <Text
            style={Fonts.style.semiBold(
              Colors.dark,
              Fonts.size.medium,
              'center',
              1,
            )}>
            Resumen del servicio
          </Text>

          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.h4, 'center', 1)}>
            {product.name}
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          <Text
            style={Fonts.style.semiBold(
              Colors.client.primaryColor,
              Fonts.size.medium,
              'center',
              1,
            )}>
            {'Clientes'}
          </Text>
          <View
            style={{
              alignSelf: 'center',
              width: Metrics.screenWidth * 0.85,
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <TitleValue
                title={`${user.firstName} ${user.lastName} (yo)`}
                value={null}
                letterSpacingTittle={0}
                letterSpacingValue={0}
                titleType={'bold'}
                valueType={'regular'}
                width={'100%'}
              />
              <TitleValue
                title={'Servicio'}
                // eslint-disable-next-line radix
                value={Utilities.formatCOP(parseInt(product.price))}
                titleType={'regular'}
                valueType={'regular'}
                width={'95%'}
              />
            </View>

            {_.filter(addonsGuest, ({guestId}) => guestId === 'yo').map(
              (item, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                  }}>
                  <TitleValue
                    title={item.addonName}
                    // eslint-disable-next-line radix
                    value={Utilities.formatCOP(parseInt(item.addOnPrice))}
                    titleType={'regular'}
                    valueType={'regular'}
                    width={'95%'}
                  />
                </View>
              ),
            )}
          </View>
          {guestList.map((data) => {
            return (
              <View
                key={data.id}
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  width: Metrics.screenWidth * 0.85,
                  alignItems: 'center',
                }}>
                <TitleValue
                  title={`${data.firstName} ${data.lastName}`}
                  value={null}
                  letterSpacingTittle={0}
                  letterSpacingValue={0}
                  titleType={'bold'}
                  valueType={'regular'}
                  width={'100%'}
                />

                <TitleValue
                  title={'Servicio'}
                  // eslint-disable-next-line radix
                  value={Utilities.formatCOP(parseInt(product.price))}
                  titleType={'regular'}
                  valueType={'regular'}
                  width={'95%'}
                />

                <View
                  style={{
                    width: Metrics.screenWidth * 0.8,
                    flex: 0,
                    flexDirection: 'column',
                  }}>
                  {_.filter(
                    addonsGuest,
                    ({guestId}) => guestId === data.id,
                  ).map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        width: Metrics.screenWidth * 0.85,
                        alignItems: 'center',
                      }}>
                      <TitleValue
                        title={item.addonName}
                        // eslint-disable-next-line radix
                        value={Utilities.formatCOP(parseInt(item.addOnPrice))}
                        titleType={'regular'}
                        valueType={'regular'}
                        width={'95%'}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
          {countItems.length > 0 && (
            <View
              style={{
                width: Metrics.screenWidth * 0.95,
                flex: 1,
                alignSelf: 'center',
                flexDirection: 'column',
                marginTop: 20,
              }}>
              <Text
                style={Fonts.style.semiBold(
                  Colors.client.primaryColor,
                  Fonts.size.medium,
                  'center',
                  1,
                )}>
                {'Adicionales comunes'}
              </Text>
              <Text
                style={Fonts.style.light(
                  Colors.client.dark,
                  Fonts.size.small,
                  'center',
                  1,
                )}>
                {'Son asignadas durante el servicio'}
              </Text>
              {countItems.map((item, index) => {
                return (
                  <View
                    key={`count-${index}`}
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      width: Metrics.screenWidth * 0.85,
                      alignItems: 'center',
                    }}>
                    <TitleValue
                      title={`${item.name} x${item.count}`}
                      // eslint-disable-next-line radix
                      value={Utilities.formatCOP(parseInt(item.addOnPrice))}
                      titleType={'regular'}
                      valueType={'regular'}
                      width={'100%'}
                    />
                  </View>
                );
              })}
            </View>
          )}
          <View opacity={0.25} style={ApplicationStyles.separatorLine} />
          <Text
            style={Fonts.style.semiBold(
              Colors.client.primaryColor,
              Fonts.size.medium,
              'center',
              1,
            )}>
            {'Duración - Expertos'}
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.medium,
              'center',
              1,
            )}>
            {minToHours(timeTotal)} - {1}
            {' Experto'}
          </Text>
          <View opacity={0.25} style={ApplicationStyles.separatorLine} />
          <View
            style={{
              flex: 1,

              marginHorizontal: 5,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 5,
              }}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'left',
                  1,
                )}>
                TOTAL SERVICIOS
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'left',
                  1,
                )}>
                {Utilities.formatCOP(
                  // eslint-disable-next-line radix
                  parseInt(product.price * (guestList.length + 1)),
                )}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 5,
              }}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'left',
                  1,
                )}>
                TOTAL ADICIONES
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'left',
                  1,
                )}>
                {
                  // eslint-disable-next-line radix
                  Utilities.formatCOP(parseInt(addOnPrice + addOnCountPrice))
                }
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 5,
              }}>
              <Text
                style={Fonts.style.semiBold(
                  Colors.client.primaryColor,
                  Fonts.size.medium,
                  'center',
                  1,
                )}>
                TOTAL
              </Text>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.medium,
                  'left',
                  1,
                )}>
                {Utilities.formatCOP(
                  // eslint-disable-next-line radix
                  parseInt(
                    product.price * (guestList.length + 1) +
                      addOnPrice +
                      addOnCountPrice,
                  ),
                )}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => sendItemCart(data)}
            style={{
              width: Metrics.screenWidth * 0.5,
              height: 40,
              marginVertical: 10,
              alignSelf: 'center',
              borderRadius: Metrics.borderRadius,
              backgroundColor: Colors.client.primaryColor,
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
              Confirmar servicio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowModalService(false)}
            style={{
              width: Metrics.screenWidth * 0.5,
              marginVertical: 10,
              alignSelf: 'center',
              borderRadius: Metrics.borderRadius,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
                1,
              )}>
              Cancelar
            </Text>
          </TouchableOpacity>
          <View style={{height: Metrics.addFooter + 10}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default HandleResume;
