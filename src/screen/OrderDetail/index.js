import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import SerchExpert from './SerchExpert';

const OrderDetail = (props) => {
  const {route} = props;
  const {params} = route;
  console.log('props ==>', params);

  return <Text>Hello</Text>;
};
const styles = StyleSheet.create({
  container: {flex: 1},
});
export default OrderDetail;
