import React from 'react';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity, View, Text, StyleSheet, Linking} from 'react-native';
import {Fonts, Colors} from '../../../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ExpertCall = (props) => {
  const {expert} = props;
  return (
    <>
      {expert ? (
        <>
          <View style={styles.contExpert}>
            <View style={styles.profile}>
              <FastImage
                source={{uri: expert.imageUrl.medium}}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
              />

              <View style={styles.contInfo}>
                <Text style={[Fonts.style.bold(Colors.light, Fonts.size.h6)]}>
                  {expert.firstName}
                </Text>
                <Text
                  style={[Fonts.style.bold(Colors.light, Fonts.size.medium)]}>
                  <Icon
                    name={'star'}
                    size={20}
                    color={Colors.client.primaryColor}
                  />{' '}
                  {expert.rating}
                </Text>
              </View>
            </View>

            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={styles.buttonCall}
                onPress={() => Linking.openURL(`tel:${expert.phone}`)}>
                <Icon
                  name={'phone'}
                  size={25}
                  color={Colors.client.primaryColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCall2}
                onPress={() => Linking.openURL(`tel:${expert.phone}`)}>
                <Icon
                  name={'heart'}
                  size={25}
                  color={Colors.client.primaryColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <Text>loading</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contExpert: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingVertical: 20,
  },
  image: {height: 80, width: 80, borderRadius: 40},
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonCall: {
    backgroundColor: 'white',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  buttonCall2: {
    marginRight: 20,

    backgroundColor: 'white',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  contInfo: {marginLeft: 10},
});

export default ExpertCall;
