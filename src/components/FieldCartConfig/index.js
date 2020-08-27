import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts, Colors, Metrics} from '../../themes';

export default (data) => {
  const {value, textActive, textInactive, textSecondary} = data;

  return (
    <View style={styles.container}>
      <View style={styles.deleteContainer}>
        {<Icon name={data.icon} size={20} color={Colors.client.primaryColor} />}
      </View>
      <View style={styles.productContainer}>
        {value ? (
          <>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'left',
              )}>
              {textActive}
            </Text>
            {textSecondary !== '' ? (
              <Text
                style={Fonts.style.regular(
                  Colors.gray,
                  Fonts.size.small,
                  'left',
                )}>
                {textSecondary}
              </Text>
            ) : null}
          </>
        ) : (
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            {textInactive}
          </Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginVertical: 2.5,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  imageContainer: {flex: 0},
  image: {width: 80, height: 80, borderRadius: Metrics.borderRadius},
  productContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  priceContainer: {
    flex: 0,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteContainer: {
    flex: 0,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: Metrics.screenWidth * 0.8,
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
  },
});
