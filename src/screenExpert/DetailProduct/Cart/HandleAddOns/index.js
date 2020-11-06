import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Metrics, Colors, Fonts} from '../../../../themes';
import Utilities from '../../../../utilities';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TitleValue from '../../../../components/TitleValue';

const HandleAddOns = ({
  addOnsFilter,
  user,
  countItems,
  selectAddons,
  countableAddOrRemove,
  guestList,
  addonsGuest,
  addonsList,
  selectAddonGuest,
}) => {
  return (
    <>
      {addOnsFilter && addOnsFilter.length > 0 && (
        <View //description
          style={{
            width: Metrics.screenWidth * 0.9,
            alignSelf: 'center',
          }}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left', 1)}>
            {'Servicios Adicionales'}
          </Text>
        </View>
      )}
      {addOnsFilter &&
        addOnsFilter.length > 0 &&
        addOnsFilter.map((data, index) => {
          return (
            <View key={index}>
              {index === 0 && <View style={{height: 20}} />}
              {index !== 0 && (
                <View
                  opacity={0.25}
                  style={{
                    width: Metrics.screenWidth * 0.5,
                    alignSelf: 'center',
                    height: 0.5,
                    backgroundColor: Colors.dark,
                    marginVertical: 20,
                  }}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  width: Metrics.screenWidth * 0.9,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingRight: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      selectAddons(data);
                    }}>
                    <Text>
                      {addonsList.findIndex((i) => i.id === data.id) !== -1 ? (
                        <Icon
                          name="toggle-on"
                          size={20}
                          color={Colors.expert.primaryColor}
                        />
                      ) : (
                        <Icon name="toggle-off" size={20} color={Colors.gray} />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 4,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 4,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={Fonts.style.semiBold(
                          Colors.dark,
                          Fonts.size.medium,
                          'center',
                          1,
                        )}>
                        {data.name}
                        <Text
                          style={Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.small,
                            'center',
                            1,
                          )}>
                          +{data.duration} min
                        </Text>
                      </Text>
                      <Text
                        style={Fonts.style.semiBold(
                          Colors.dark,
                          Fonts.size.small,
                          'center',
                          1,
                        )}>
                        +{Utilities.formatCOP(data.price)}
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
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 4,
                    }}>
                    <Text
                      style={Fonts.style.light(
                        Colors.dark,
                        Fonts.size.small,
                        'left',
                        0,
                      )}>
                      {data.description}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                {data.isCountAddon &&
                  addonsList.findIndex((i) => i.id === data.id) !== -1 && (
                    <View
                      style={{
                        width: Metrics.screenWidth * 0.9,
                        alignSelf: 'center',
                        marginVertical: 5,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 6, marginLeft: 40}}>
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.small,
                            'left',
                            1,
                          )}>
                          {'Cantidad de items'}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          countableAddOrRemove(
                            false,
                            addonsList.findIndex((i) => i.id === data.id),
                          );
                        }}
                        style={{flex: 0, alignItems: 'center'}}>
                        <Icon
                          name="minus-circle"
                          size={20}
                          color={Colors.expert.primaryColor}
                        />
                      </TouchableOpacity>
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
                          {
                            addonsList[
                              addonsList.findIndex((i) => i.id === data.id)
                            ].count
                          }
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          countableAddOrRemove(
                            true,
                            addonsList.findIndex((i) => i.id === data.id),
                          )
                        }
                        style={{flex: 0, alignItems: 'center'}}>
                        <Icon
                          name={'plus-circle'}
                          size={20}
                          color={Colors.expert.primaryColor}
                        />
                      </TouchableOpacity>
                      <Text
                        style={Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.small,
                          'left',
                          1,
                        )}>
                        {' '}
                        +
                        {Utilities.formatCOP(
                          addonsList[
                            addonsList.findIndex((i) => i.id === data.id)
                          ].count *
                            addonsList[
                              addonsList.findIndex((i) => i.id === data.id)
                            ].price,
                        )}
                      </Text>
                    </View>
                  )}

                {!data.isCountAddon &&
                  addonsList.findIndex((i) => i.id === data.id) !== -1 && (
                    <TouchableOpacity
                      onPress={() => selectAddonGuest(data, {id: 'yo'})}
                      style={{
                        width: Metrics.screenWidth * 0.8,
                        alignSelf: 'flex-end',
                        marginVertical: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>
                        {addonsGuest &&
                        addonsGuest.length > 0 &&
                        addonsGuest.findIndex(
                          (i) => i.id === data.id && i.guestId === 'yo',
                        ) !== -1 ? (
                          <Icon
                            name="toggle-on"
                            size={20}
                            color={Colors.expert.primaryColor}
                          />
                        ) : (
                          <Icon
                            name="toggle-off"
                            size={20}
                            color={Colors.gray}
                          />
                        )}
                      </Text>
                      <View
                        style={{
                          flex: 1,

                          marginHorizontal: 5,
                        }}>
                        <Text
                          style={Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                            0,
                          )}>
                          {user.firstName} {user.lastName} (Cliente)
                        </Text>
                      </View>
                      <View>
                        {addonsGuest &&
                        addonsGuest.length > 0 &&
                        addonsGuest.findIndex(
                          (i) => i.id === data.id && i.guestId === 'yo',
                        ) !== -1 ? (
                          <Text
                            style={Fonts.style.regular(
                              Colors.dark,
                              Fonts.size.small,
                              'left',
                              1,
                            )}>
                            +{Utilities.formatCOP(data.price)}
                          </Text>
                        ) : (
                          <Text
                            style={Fonts.style.regular(
                              Colors.dark,
                              Fonts.size.small,
                              'left',
                              1,
                            )}>
                            +{Utilities.formatCOP(0)}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}

                {!data.isCountAddon &&
                  addonsList.findIndex((i) => i.id === data.id) !== -1 &&
                  guestList.map((item) => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => selectAddonGuest(data, item)}
                        style={{
                          width: Metrics.screenWidth * 0.8,
                          alignSelf: 'flex-end',
                          marginVertical: 5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text>
                          {addonsGuest &&
                          addonsGuest.length > 0 &&
                          addonsGuest.findIndex(
                            (i) => i.id === data.id && i.guestId === item.id,
                          ) !== -1 ? (
                            <Icon
                              name="toggle-on"
                              size={20}
                              color={Colors.expert.primaryColor}
                            />
                          ) : (
                            <Icon
                              name="toggle-off"
                              size={20}
                              color={Colors.gray}
                            />
                          )}
                        </Text>
                        <View
                          style={{
                            flex: 1,

                            marginHorizontal: 5,
                          }}>
                          <Text
                            style={Fonts.style.regular(
                              Colors.dark,
                              Fonts.size.medium,
                              'left',
                              0,
                            )}>
                            {item.firstName} {item.lastName} (+
                            {data.duration} min)
                          </Text>
                        </View>
                        <View>
                          {addonsGuest &&
                          addonsGuest.length > 0 &&
                          addonsGuest.findIndex(
                            (i) => i.id === data.id && i.guestId === item.id,
                          ) !== -1 ? (
                            <Text
                              style={Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.small,
                                'left',
                                1,
                              )}>
                              +{Utilities.formatCOP(data.price)}
                            </Text>
                          ) : (
                            <Text
                              style={Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.small,
                                'left',
                                1,
                              )}>
                              +{Utilities.formatCOP(0)}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
              {countItems && countItems.length > 0 && (
                <View
                  style={{
                    width: Metrics.screenWidth * 0.95,
                    flex: 1,
                    alignSelf: 'center',
                    flexDirection: 'column',
                  }}>
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
                        {data.isCountAddon === true && (
                          <TitleValue
                            title={`${item.name} x${item.count}`}
                            titleType={'regular'}
                            valueType={'regular'}
                            width={'100%'}
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
    </>
  );
};

export default HandleAddOns;
