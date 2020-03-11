/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import {Fonts, Colors, Images} from '../../Themes';
import Utilities from '../../Utilities';
import {minToHours} from '../../Helpers/MomentHelper';
import AppConfig from '../../Config/AppConfig';

export default data => {
  const {formattedAddress, type, addressDetail, pets, id} = data.data;

  return (
    <TouchableOpacity
      onPress={() => {
        data.selectAddress();
      }}
      style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          data.removeAddress(id);
        }}
        style={{width: 30, justifyContent: 'center', alignItems: 'center'}}>
        {
          <Icon
            name={AppConfig.locationIcon[type]}
            size={20}
            color={Colors.client.primaryColor}
          />
        }
      </TouchableOpacity>
      <View style={styles.productContainer}>
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
          {AppConfig.locationType[type]}{' '}
          {pets === 0 || pets == null ? null : (
            <>
              {pets !== 0 && pets < 3 ? (
                <Icon
                  name={AppConfig.petsType[pets]}
                  size={12}
                  color={Colors.client.primaryColor}
                />
              ) : (
                <>
                  <Icon
                    name={'dog'}
                    size={12}
                    color={Colors.client.primaryColor}
                  />{' '}
                  <Icon
                    name={'cat'}
                    size={12}
                    color={Colors.client.primaryColor}
                  />
                </>
              )}
            </>
          )}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
          <Icon name={'map-marker-alt'} size={10} color={Colors.gray} />{' '}
          {formattedAddress}
        </Text>

        {addressDetail !== '' && (
          <Text
            style={Fonts.style.regular(Colors.gray, Fonts.size.small, 'left')}>
            <Icon
              name={'map-marker-alt'}
              size={10}
              color={Colors.pinkMask(0)}
            />{' '}
            {addressDetail}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          data.removeAddress(id);
        }}
        style={styles.deleteContainer}>
        {
          <Icon
            name={'minus-square'}
            size={20}
            color={Colors.client.primaryColor}
            solid
          />
        }
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
