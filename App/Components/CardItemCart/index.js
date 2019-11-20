/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import {Fonts, Colors, Images, ApplicationStyles} from '../../Themes';
import Utilities from '../../Utilities';
import {minToHours, formatDate} from '../../Helpers/MomentHelper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';

export default data => {
  const {name, id, total, duration, clients, experts} = data.data;

  return (
    <>
      <View style={[styles.container, ApplicationStyles.shadownClient]}>
        <View style={styles.productContainer}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
            {name}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'clock'} size={15} color={Colors.client.primartColor} />{' '}
            {minToHours(duration)}
            {!data.isCart &&
              `, iniciando: ${formatDate(
                moment(data.startHour, 'HH:mm'),
                'h:mm a',
              )}`}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon
              name={'user-friends'}
              size={12}
              color={Colors.client.primartColor}
            />{' '}
            {clients.length} Usuarios
          </Text>
          {/* <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon
              name={'id-badge'}
              size={18}
              color={Colors.client.primartColor}
            />{' '}
            {experts} Expertos
          </Text> */}
        </View>
        <View style={styles.priceContainer}>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left')}>
            {Utilities.formatCOP(total)}
          </Text>
        </View>
        {data.isCart && (
          <TouchableOpacity
            onPress={() => {
              data.removeItem(id);
            }}
            style={styles.deleteContainer}>
            <Icon
              name={'minus-square'}
              size={20}
              color={Colors.client.primartColor}
              solid
            />
          </TouchableOpacity>
        )}
      </View>
      {data.showExperts && (
        <Text
          style={Fonts.style.regular(
            Colors.client.primartColor,
            Fonts.size.small,
            'center',
          )}>
          {'Expertos'}
        </Text>
      )}
      {data.showExperts &&
        experts.map((item, index) => {
          return (
            <View
              key={index}
              style={[
                styles.container,
                styles.containerBottom,
                ApplicationStyles.shadownClient,
              ]}>
              {item.id == null ? (
                <>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.client.secondaryColor,
                      marginRight: 10,
                    }}>
                    <ActivityIndicator size={'small'} color={Colors.light} />
                  </View>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'left',
                    )}>
                    Buscando Experto...
                  </Text>
                </>
              ) : (
                <Image
                  source={{uri: item.thumbnail}}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
              )}
              <View style={{flex: 1}}>
                <Text
                  style={Fonts.style.bold(
                    Colors.dark,
                    Fonts.size.small,
                    'left',
                  )}>
                  {item.firstName} {item.lastName}
                </Text>
                {item.ranking && (
                  <View style={{width: 300, flexDirection: 'row'}}>
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      rating={item.ranking ? item.ranking : 5}
                      starSize={15}
                      emptyStarColor={Colors.gray}
                      fullStarColor={Colors.client.primartColor}
                      halfStarColor={Colors.client.secondaryColor}
                      // selectedStar={(rating) => }
                    />
                    <Text
                      style={Fonts.style.regular(
                        Colors.dark,
                        Fonts.size.small,
                        'left',
                      )}>
                      {' '}
                      {item.ranking}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
    </>
  );
};
