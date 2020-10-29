import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Colors, Fonts, Metrics} from '../../../themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ItemContact from './ItemContact';

const AllContacts = ({contacts, setContact, close}) => {
  const selectContact = (item) => {
    const number =
      item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : '';

    if (!number.includes('+57')) {
      setContact(`+57${number.trim()}`);
    } else {
      setContact(number.trim());
    }

    close(false);
  };

  const [data, setData] = useState(contacts);

  const loadMore = () => {
    console.log('active scroollll');
    console.log('data.length', data.length);
    let updatedData = data.slice(0, data.length + 40);
    setData(updatedData);
  };

  return (
    <View style={styles.container}>
      <Icon
        name="contacts"
        size={50}
        color={Colors.client.primaryColor}
        style={styles.icon}
      />
      <Text
        style={[
          Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center'),
          {marginVertical: 10},
        ]}>
        {'Selecciona tu contacto referido'}
      </Text>

      <FlatList
        data={data}
        renderItem={({item}) => (
          <ItemContact item={item} selectContact={selectContact} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={20}
        initialNumToRender={40}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    maxHeight: Metrics.screenHeight - 60,
  },
  icon: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
});
export default AllContacts;
