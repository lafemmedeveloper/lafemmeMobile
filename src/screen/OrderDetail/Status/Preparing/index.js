import React, {useContext, useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Fonts, Colors} from '../../../../themes';
import {StoreContext} from '../../../../flux';

const Preparing = (props) => {
  const {id} = props;

  const {state /*  serviceDispatch, authDispatch */} = useContext(StoreContext);
  const [expert, setExpert] = useState(null);

  const {util} = state;

  const {orders} = util;

  useEffect(() => {
    if (orders.length > 0) {
      const currentOrder = orders.filter((item) => item.cartId === id)[0];

      setExpert(currentOrder.experts);
    }
  }, []);

  console.log('expert ===>', expert);

  return (
    <>
      <View style={styles.container}>
        <Text
          style={Fonts.style.regular(
            Colors.lightGray,
            Fonts.size.input,
            'left',
          )}>
          {'Buscando experto'}
        </Text>
        <Text
          style={[
            Fonts.style.bold(
              Colors.client.primaryColor,
              Fonts.size.h6,
              'center',
            ),
            {marginTop: 38},
          ]}>
          {'Preparando tu orden'}
        </Text>
        <Text
          style={[
            Fonts.style.regular(Colors.lightGray, Fonts.size.regular, 'left'),
            {marginTop: 38},
          ]}>
          {'En ruta'}
        </Text>
        <Text
          style={[
            Fonts.style.regular(Colors.lightGray, Fonts.size.regular, 'left'),
            {marginTop: 35},
          ]}>
          {'En servicio'}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  contExpert: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
  },
});

export default Preparing;
