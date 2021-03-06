import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ApplicationStyles, Fonts, Colors, Metrics} from '../../../themes';

export default (data) => {
  const {menuIndex, onAction} = data;

  return (
    <View style={[styles.container, ApplicationStyles.shadowsClient]}>
      <View style={styles.addHeader} />
      <View style={[styles.content]}>
        <Text
          style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
          Mi Balance
        </Text>
      </View>
      <View style={[styles.contentBtn]}>
        <TouchableOpacity
          onPress={() => {
            onAction(0);
          }}
          style={styles.itemBtn}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'center')}>
            {'Activas'}
          </Text>
          <View
            style={[
              styles.itemMenu,
              {
                height: menuIndex === 0 ? 3 : 0,
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onAction(1);
          }}
          style={styles.itemBtn}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'center')}>
            {'Historial'}
          </Text>
          <View
            style={[
              styles.itemMenu,
              {
                height: menuIndex === 1 ? 3 : 0,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    zIndex: 100,
    height: 60 + Metrics.addHeader,
    backgroundColor: Colors.light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  addHeader: {
    width: Metrics.screenWidth,

    height: Metrics.addHeader,
  },

  content: {
    width: Metrics.screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentBtn: {
    width: Metrics.screenWidth,
    flex: 1,

    flexDirection: 'row',
  },

  itemMenu: {
    width: '100%',
    backgroundColor: Colors.expert.primaryColor,
    position: 'absolute',
    bottom: 0,
  },

  itemBtn: {flex: 1},
});
