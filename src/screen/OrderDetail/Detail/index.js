import React, {Fragment} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {minToHours} from '../../../helpers/MomentHelper';
import {ApplicationStyles, Colors, Fonts, Metrics} from '../../../themes';
import utilities from '../../../utilities';
import ButonMenu from '../../ButonMenu';

const Detail = ({filterOrder, menuIndex, setMenuIndex}) => {
  const {services} = filterOrder;
  return (
    <ScrollView style={styles.container}>
      <View style={{marginTop: 10}}>
        <Text
          style={[
            Fonts.style.bold(
              Colors.expert.primaryColor,
              Fonts.size.medium,
              'center',
            ),
            {marginVertical: 5},
          ]}>
          Información general
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            marginVertical: 2.5,
          }}>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium),
              {flex: 1},
            ]}>
            Cliente:
          </Text>
          <Text
            style={[
              Fonts.style.bold(Colors.dark, Fonts.size.medium),
              {flex: 2},
            ]}>
            {filterOrder &&
              filterOrder.client &&
              `${filterOrder.client.firstName} ${filterOrder.client.lastName}`}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            marginVertical: 2.5,
          }}>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium),
              {flex: 1},
            ]}>
            Dirección:
          </Text>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium),
              {flex: 2},
            ]}>
            {filterOrder && filterOrder.address && filterOrder.address.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            marginVertical: 2.5,
          }}>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
              {flex: 1},
            ]}>
            Nota de{'\n'}servicio:
          </Text>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
              {flex: 2},
            ]}>
            {filterOrder && filterOrder.address.notesAddress}
          </Text>
        </View>

        <View opacity={0.25} style={ApplicationStyles.separatorLine} />
        {filterOrder && services && services.length > 1 && (
          <>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20, marginBottom: 10},
              ]}>
              Selecciona tus servicios para ver al información
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingBottom: 40, marginLeft: 20}}>
              {services.map((item, index) => {
                return (
                  <Fragment key={index}>
                    {menuIndex === index ? (
                      <ButonMenu
                        item={item}
                        index={index}
                        menuIndex={menuIndex}
                        theme={true}
                        setMenuIndex={setMenuIndex}
                      />
                    ) : (
                      <ButonMenu
                        item={item}
                        index={index}
                        menuIndex={menuIndex}
                        theme={false}
                        setMenuIndex={setMenuIndex}
                      />
                    )}
                  </Fragment>
                );
              })}
            </ScrollView>
          </>
        )}
        {filterOrder &&
          services &&
          services.map((item, index) => {
            const {clients, addOnsCount, addons} = item;

            return (
              <Fragment key={index}>
                {menuIndex === index && (
                  <>
                    <Text
                      style={[
                        Fonts.style.bold(
                          Colors.expert.primaryColor,
                          Fonts.size.medium,
                          'center',
                        ),
                      ]}>
                      Servicios
                    </Text>
                    <View>
                      {clients.length > 0 &&
                        clients.map((guest, index) => {
                          const addonGuest = addons.filter(
                            (a) => a.guestId === guest.id,
                          );

                          return (
                            <Fragment key={index}>
                              <View>
                                <Text
                                  style={[
                                    Fonts.style.bold(
                                      Colors.dark,
                                      Fonts.size.medium,
                                      'left',
                                    ),
                                    {marginLeft: 20},
                                  ]}>
                                  {guest.firstName} {guest.lastName}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Text
                                    style={[
                                      Fonts.style.regular(
                                        Colors.dark,
                                        Fonts.size.medium,
                                        'left',
                                      ),
                                      {
                                        marginLeft: 40,
                                        marginVertical: 5,
                                      },
                                    ]}>
                                    Servicio
                                  </Text>
                                  <Text
                                    style={[
                                      Fonts.style.regular(
                                        Colors.dark,
                                        Fonts.size.medium,
                                        'left',
                                      ),
                                      {
                                        marginRight: 20,
                                        marginVertical: 5,
                                      },
                                    ]}>
                                    {utilities.formatCOP(
                                      services[menuIndex].productPrice,
                                    )}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  {addonGuest.length > 0 &&
                                    addonGuest.map((item, index) => {
                                      return (
                                        <Fragment key={index}>
                                          <Text
                                            style={[
                                              Fonts.style.regular(
                                                Colors.dark,
                                                Fonts.size.medium,
                                                'left',
                                              ),
                                              {
                                                marginLeft: 40,
                                              },
                                            ]}>
                                            {item.addonName}
                                          </Text>
                                          <Text
                                            style={[
                                              Fonts.style.regular(
                                                Colors.dark,
                                                Fonts.size.medium,
                                                'left',
                                              ),
                                              {
                                                marginRight: 20,
                                              },
                                            ]}>
                                            {utilities.formatCOP(
                                              item.addOnPrice,
                                            )}
                                          </Text>
                                        </Fragment>
                                      );
                                    })}
                                </View>
                              </View>
                            </Fragment>
                          );
                        })}
                    </View>

                    <View
                      opacity={0.25}
                      style={ApplicationStyles.separatorLine}
                    />

                    <Text
                      style={[
                        Fonts.style.bold(
                          Colors.expert.primaryColor,
                          Fonts.size.medium,
                          'center',
                        ),

                        {marginBottom: 10},
                      ]}>
                      Adicionales comunes
                    </Text>

                    {addOnsCount && addOnsCount.length > 0 ? (
                      addOnsCount.map((dataAddon, index) => {
                        const {name, count, addOnPrice} = dataAddon;

                        return (
                          <View key={index} style={styles.contAddons}>
                            <Text
                              style={
                                ([
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'left',
                                  ),
                                ],
                                {flex: 2})
                              }>
                              {name} x{count}
                            </Text>
                            <Text
                              style={
                                ([
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                  ),
                                ],
                                {
                                  flex: 1,
                                  textAlign: 'right',
                                  marginRight: 10,
                                })
                              }>
                              {utilities.formatCOP(addOnPrice)}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          ),
                        ]}>
                        Sin adiciones
                      </Text>
                    )}
                  </>
                )}
              </Fragment>
            );
          })}
        <View opacity={0.25} style={styles.separatorLineMini} />

        <Text
          style={[
            Fonts.style.bold(
              Colors.expert.primaryColor,
              Fonts.size.medium,
              'center',
            ),
          ]}>
          Duración
        </Text>
        <Text
          style={[
            Fonts.style.regular(
              Colors.expert.primaryColor,
              Fonts.size.medium,
              'center',
            ),
          ]}>
          {minToHours(services[menuIndex].duration)}
        </Text>
        <View opacity={0.25} style={styles.separatorLineMini} />

        <Text
          style={[
            Fonts.style.bold(
              Colors.expert.primaryColor,
              Fonts.size.medium,
              'center',
            ),
          ]}>
          Resumen a pagar
        </Text>
        {filterOrder &&
          services &&
          services.map((item, index) => {
            const {totalAddons, totalServices} = item;

            return (
              <View key={index} style={styles.cont}>
                {menuIndex === index && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                        marginVertical: 2.5,
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        Subtotal
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        {utilities.formatCOP(totalServices)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                        marginVertical: 2.5,
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        Adicionales
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        {utilities.formatCOP(totalAddons)}
                      </Text>
                    </View>
                    {filterOrder.specialDiscount &&
                      filterOrder.specialDiscount.idServices.includes(
                        item.id,
                      ) && (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                            marginVertical: 2.5,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            Recargo nocturno
                          </Text>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            {utilities.formatCOP(
                              filterOrder.specialDiscount.discount,
                            )}
                          </Text>
                        </View>
                      )}

                    {filterOrder.coupon &&
                      filterOrder.coupon.type.includes(item.servicesType) && (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                            marginVertical: 2.5,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            Descuento por cupón
                          </Text>
                          <Text
                            style={[
                              Fonts.style.regular('red', Fonts.size.medium),
                            ]}>
                            -{' '}
                            {filterOrder.coupon?.typeCoupon === 'percentage'
                              ? `${filterOrder.coupon?.percentage}%`
                              : utilities.formatCOP(filterOrder.coupon?.money)}
                          </Text>
                        </View>
                      )}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                        marginVertical: 2.5,
                      }}>
                      <Text
                        style={[
                          Fonts.style.bold(Colors.dark, Fonts.size.medium),
                        ]}>
                        Total a cobrar
                      </Text>

                      <Text
                        style={[
                          Fonts.style.bold(Colors.dark, Fonts.size.medium),
                        ]}>
                        {utilities.formatCOP(
                          utilities.calculateTotal(filterOrder, menuIndex),
                        )}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  separatorLineMini: {
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: Colors.dark,
    marginVertical: 20,
  },
  contAddons: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
});
export default Detail;
