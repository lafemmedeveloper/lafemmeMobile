import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../themes';

const ButonMenu = ({item}) => {
  console.log('item service ==>', item);
  return (
    <>
      {item ? (
        <TouchableOpacity style={styles.container}>
          <Text
            style={Fonts.style.bold(
              false ? Colors.light : Colors.expert.primaryColor,
              Fonts.size.small,
              'center',
            )}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: Colors.light,
    height: 40,
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 20,
  },
  containerActive: {
    backgroundColor: Colors.expert.primaryColor,
    height: 40,
    width: 100,
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default ButonMenu;
