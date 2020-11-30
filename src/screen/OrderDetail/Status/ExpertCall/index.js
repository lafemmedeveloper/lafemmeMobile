import React from 'react';
import FastImage from 'react-native-fast-image';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import {Fonts, Colors, Images} from '../../../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ExpertCall = ({experts, uid, handleCancel, status}) => {
  const expert = experts.filter((e) => e.uid === uid)[0];
  return (
    <>
      <View style={styles.contExpert}>
        <View style={styles.profile}>
          {expert ? (
            <FastImage
              source={{uri: expert.imageUrl.medium}}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.image}
            />
          ) : (
            <View
              style={[
                styles.image,
                {
                  backgroundColor: Colors.light,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Image
                source={Images.menuUser}
                resizeMode={FastImage.resizeMode.cover}
                style={[
                  styles.image,
                  {
                    tintColor: Colors.expert.primaryColor,
                    width: '90%',
                    height: '90%',
                  },
                ]}
              />
            </View>
          )}
          {expert ? (
            <View style={styles.contInfo}>
              <Text style={[Fonts.style.bold(Colors.light, Fonts.size.medium)]}>
                {expert.firstName} {expert.lastName}
              </Text>
              <Text
                style={[Fonts.style.semiBold(Colors.light, Fonts.size.small)]}>
                <Icon name={'star'} size={16} color={Colors.light} />{' '}
                {(expert && expert.rating ? expert.rating : 5).toFixed(1)}
              </Text>
            </View>
          ) : (
            <View style={styles.contInfo}>
              <Text style={[Fonts.style.bold(Colors.light, Fonts.size.medium)]}>
                Buscando experto...
              </Text>
            </View>
          )}
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
              name={'phone-alt'}
              size={20}
              color={Colors.expert.primaryColor}
            />
          </TouchableOpacity>
          {status <= 2 && (
            <TouchableOpacity
              style={styles.buttonCall}
              onPress={() => handleCancel()}>
              <Icon
                name={'times'}
                size={20}
                color={Colors.client.primaryColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    backgroundColor: Colors.expert.primaryColor,
    paddingHorizontal: 10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingVertical: 20,
  },
  image: {height: 60, width: 60, borderRadius: 30},
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonCall: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  // buttonCall2: {
  //   marginRight: 20,

  //   backgroundColor: 'white',
  //   height: 50,
  //   width: 50,
  //   borderRadius: 25,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4.65,

  //   elevation: 8,
  // },
  contInfo: {marginLeft: 10},
});

export default ExpertCall;
