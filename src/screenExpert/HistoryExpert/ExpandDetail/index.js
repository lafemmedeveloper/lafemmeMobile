import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {Colors, Fonts, Metrics} from '../../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default (data) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => data.action()}
        style={styles.itemProfile}>
        <View style={styles.itemIcon}>
          <Icon name={data.icon} size={15} color={Colors.dark} />
        </View>
        <Text
          style={[
            Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center'),
            {marginLeft: 20},
          ]}>
          {data.title}
        </Text>

        <View style={styles.itemIconEnd}>
          <Icon name={'chevron-right'} size={15} color={Colors.dark} />
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  itemProfile: {
    width: Metrics.screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  decorationLine: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 0,
    width: Metrics.screenWidth * 0.87,
    height: 0.5,
    backgroundColor: Colors.gray,
  },
  itemIcon: {
    width: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconEnd: {
    width: 30,
    height: 20,
    alignSelf: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row-reverse',
    position: 'absolute',
    right: 20,
  },
});
