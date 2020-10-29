import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ApplicationStyles, Colors, Fonts} from '../../../../themes';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ItemContact = ({item, selectContact}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => selectContact(item)}>
        <View>
          <Text
            style={[
              Fonts.style.semiBold(Colors.dark, Fonts.size.medium, 'left'),
            ]}>
            {item && item.displayName && item.displayName}
          </Text>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center'),
              {marginHorizontal: 5},
            ]}>
            {item && item.phoneNumbers.length > 0
              ? item.phoneNumbers[0].number
              : null}
          </Text>
        </View>
        <View style={{alignSelf: 'center'}}>
          <Icon
            name="keyboard-arrow-right"
            size={25}
            color={Colors.client.primaryColor}
          />
        </View>
      </TouchableOpacity>
      <View opacity={0.25} style={ApplicationStyles.separatorLineMini} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
});
export default ItemContact;
