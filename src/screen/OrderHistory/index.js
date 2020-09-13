import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Colors} from '../../themes';

const OrderHistory = (props) => {
  /* config map */
  console.log('props =>', props);
  const {route} = props;
  const {params} = route;
  console.log('params =>>', params);

  return (
    <>
      <View style={styles.container}>
        <Text>Hello+</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1},
  cont: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.light,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 20,
  },
  step: {
    alignSelf: 'center',
    marginLeft: 20,
    marginBottom: 20,
  },
  step4: {
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 20,
    height: 150,
  },

  containerPosition: {
    marginVertical: 20,
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  mapView: {
    height: 300,
    width: '100%',
    zIndex: 1,
  },
  back: {
    backgroundColor: Colors.light,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  contBack: {
    position: 'absolute',
    zIndex: 2,
    marginLeft: 10,
    marginTop: 10,
  },
});
export default OrderHistory;
