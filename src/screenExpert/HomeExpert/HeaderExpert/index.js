import React from 'react';
import {Text, View, Switch, StyleSheet, Image} from 'react-native';
import {Fonts, Colors} from '../../../themes';
import firestore from '@react-native-firebase/firestore';
import {setUser, setLoading} from '../../../flux/auth/actions';

const HeaderExpert = (props) => {
  const {user, dispatch} = props;
  console.log('user ===>', user);
  const {imageUrl = ''} = user;
  const toggleSwitch = async () => {
    try {
      setLoading(true, dispatch);
      const ref = firestore().collection('users').doc(user.uid);
      await ref.set(
        {
          isEnabled: user.isEnabled ? false : true,
        },
        {merge: true},
      );

      await setUser(user.uid, dispatch);
      setLoading(false, dispatch);
    } catch (error) {
      setLoading(false, dispatch);
      console.log('toggleSwitch ==>', error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={{alignSelf: 'center'}}>
          {user && (
            <Image
              source={{uri: user ? imageUrl.medium : ''}}
              style={styles.image}
            />
          )}
        </View>
        <Text
          style={[
            Fonts.style.semiBold(Colors.dark, Fonts.size.medium),
            {alignSelf: 'center'},
          ]}>
          {user.isEnabled ? 'Activo' : 'Activate para recibir ordenes'}
        </Text>
        <View style={{alignSelf: 'center', marginRight: 10}}>
          <Switch
            trackColor={{false: '#dbdbdb', true: '#dbdbdb'}}
            thumbColor={user.isEnabled ? Colors.expert.primaryColor : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={user.isEnabled}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {width: 40, height: 40, borderRadius: 20, marginLeft: 10},
  container: {
    paddingVertical: 10,
    backgroundColor: Colors.light,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  containerButton: {},
});

export default HeaderExpert;
