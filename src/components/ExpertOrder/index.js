import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Fonts} from '../../themes';

const ExpertOrder = ({service, order}) => {
  const expert = order.experts.filter((e) => e.uid === service.uid)[0];
  console.log('order ==>', expert);

  return (
    <>
      {expert && (
        <View style={styles.container}>
          <FastImage
            style={styles.img}
            source={{uri: expert.imageUrl.small}}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text
            numberOfLines={1}
            style={Fonts.style.bold(Colors.gray, Fonts.size.small)}>
            {`${expert.firstName} ${expert.lastName}`}
          </Text>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    alignItems: 'center',
  },
});
export default ExpertOrder;
