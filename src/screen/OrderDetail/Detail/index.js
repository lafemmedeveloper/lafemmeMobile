import React, {Fragment} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ApplicationStyles, Colors, Fonts, Metrics} from '../../../themes';
import utilities from '../../../utilities';
import ButonMenu from '../../ButonMenu';

const Detail = ({filterOrder, menuIndex, setMenuIndex}) => {
  const {services} = filterOrder;
  return (
    <ScrollView style={styles.container}>
      <View style={{marginTop: 20}}>
        <Text
          style={[
            Fonts.style.bold(
              Colors.expert.primaryColor,
              Fonts.size.medium,
              'center',
            ),
          ]}>
          Clientes
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <Text style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
            Cliente
          </Text>
          <Text style={[Fonts.style.bold(Colors.dark, Fonts.size.medium)]}>
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
          }}>
          <Text style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
            Teléfono
          </Text>
          <Text style={[Fonts.style.bold(Colors.dark, Fonts.size.medium)]}>
            {filterOrder.client && filterOrder.client.phone}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <Text style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
            Direccion
          </Text>
          <Text style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
            {filterOrder && filterOrder.address && filterOrder.address.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
            ]}>
            Nota de dirección
          </Text>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
            ]}>
            {filterOrder && filterOrder.address.notesAddress
              ? filterOrder.address.notesAddress
              : 'No ahi nota disponible'}
          </Text>
        </View>

        <View opacity={0.25} style={ApplicationStyles.separatorLine} />
        {services && services.length > 1 && (
          <>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20, marginBottom: 10},
              ]}>
              Seleciona tus servicios para ver al informacion
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingBottom: 40, marginLeft: 20}}>
              {services.map((item, index) => {
                return (
                  <Fragment key={item.id}>
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
        {services &&
          services.map((item, index) => {
            const {name, clients, addOnsCount, addons} = item;

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
                      Productos
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        Producto
                      </Text>
                      <Text
                        style={[
                          Fonts.style.bold(Colors.dark, Fonts.size.medium),
                        ]}>
                        {name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        Invitados
                      </Text>

                      <Text
                        style={[
                          Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        {clients.length === 0 ? 'Ninguno' : clients.length}
                      </Text>
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
                      ]}>
                      Adicionales comunes
                    </Text>
                    {addons && addons.length > 0 ? (
                      addons.map((dataAddon, index) => {
                        const {addonName} = dataAddon;

                        return (
                          <View key={index} style={styles.contAddons}>
                            <Text
                              style={[
                                Fonts.style.regular(
                                  Colors.dark,
                                  Fonts.size.medium,
                                  'left',
                                ),
                                {marginLeft: 20},
                              ]}>
                              {addonName}{' '}
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
                        No ahi adiciones comunes
                      </Text>
                    )}
                    <View opacity={0.25} style={styles.separatorLineMini} />
                    <Text
                      style={[
                        Fonts.style.bold(
                          Colors.expert.primaryColor,
                          Fonts.size.medium,
                          'center',
                        ),
                      ]}>
                      Adicionales contable
                    </Text>
                    {addOnsCount.length > 0 ? (
                      addOnsCount.map((addonCount, index) => {
                        const {name, count} = addonCount;
                        return (
                          <Fragment key={index}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 20,
                              }}>
                              <Text
                                style={[
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'left',
                                  ),
                                  {marginLeft: 20},
                                ]}>
                                {name}
                              </Text>
                              <Text
                                style={[
                                  Fonts.style.bold(
                                    Colors.dark,
                                    Fonts.size.medium,
                                  ),
                                ]}>
                                X{' '}
                                <Text
                                  style={[
                                    Fonts.style.regular(
                                      Colors.dark,
                                      Fonts.size.medium,
                                    ),
                                  ]}>
                                  {count}
                                </Text>
                              </Text>
                            </View>
                          </Fragment>
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
                        No ahi adiciones Contables
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
          Resumen a pagar
        </Text>
        {services &&
          services.map((item, index) => {
            const {duration, total, totalAddons, totalServices} = item;

            return (
              <View key={index} style={styles.cont}>
                {menuIndex === index && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        DURACION{' '}
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        {duration} mins
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        SUBTOTAL
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
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        ADICIONES
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        {utilities.formatCOP(totalAddons)}
                      </Text>
                    </View>

                    {filterOrder.coupon &&
                      filterOrder.coupon.type.includes(item.servicesType) && (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            DESCUENTO POR CUPÓN
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
                      }}>
                      <Text
                        style={[
                          Fonts.style.bold(Colors.dark, Fonts.size.medium),
                        ]}>
                        TOTAL DE SERVICIOS
                      </Text>

                      <Text
                        style={[
                          Fonts.style.bold(Colors.dark, Fonts.size.medium),
                        ]}>
                        {filterOrder.coupon &&
                        filterOrder.coupon.type.includes(item.servicesType)
                          ? filterOrder.coupon.typeCoupon !== 'money'
                            ? utilities.formatCOP(
                                (filterOrder.coupon.percentage / 100) * total -
                                  total,
                              )
                            : utilities.formatCOP(
                                total - filterOrder.coupon?.money,
                              )
                          : utilities.formatCOP(total)}
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
});
export default Detail;
