import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Fonts, Colors, ApplicationStyles, Metrics} from '../../themes';
import Utilities from '../../utilities';

export default (data) => {
  return (
    <TouchableOpacity
      onPress={() => data.onAction()}
      style={[styles.container, ApplicationStyles.shadowsClient]}>
      <View style={styles.counter}>
        <Text
          style={Fonts.style.bold(
            Colors.light,
            Fonts.size.medium,
            'center',
            1,
          )}>
          {data.servicesNumber}
        </Text>
      </View>
      <View style={styles.title}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.input, 'left', 1)}>
          {data.title}
        </Text>
      </View>
      <View style={styles.price}>
        <Text
          style={Fonts.style.regular(
            Colors.light,
            Fonts.size.medium,
            'right',
            1,
          )}>
          {Utilities.formatCOP(data.servicesTotal)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth * 0.95,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: Metrics.screenWidth * 0.1,
    backgroundColor: Colors.client.primaryColor,
  },
  counter: {
    backgroundColor: Colors.lightMask(0.25),
    width: Metrics.screenWidth * 0.05,
    height: Metrics.screenWidth * 0.05,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
  },

  title: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  price: {
    flex: 0,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
