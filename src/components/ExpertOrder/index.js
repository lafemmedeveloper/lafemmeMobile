import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Fonts, Colors} from '../../themes';

const ExpertOrder = ({service, order}) => {
  const expert = order.experts.filter((e) => e.uid === service.uid)[0];

  return (
    <>
      {expert ? (
        <View style={styles.container}>
          <FastImage
            style={styles.img}
            source={{uri: expert.imageUrl.small}}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text
            numberOfLines={1}
            style={Fonts.style.bold(Colors.dark, Fonts.size.small)}>
            {`${expert.firstName} ${expert.lastName}`}
          </Text>
        </View>
      ) : (
        <ActivityIndicator color={Colors.expert.primaryColor} />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
});
export default ExpertOrder;
