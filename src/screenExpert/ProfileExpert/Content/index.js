import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
} from 'react-native';

import {Colors, Fonts, Metrics} from '../../../themes';
import ItemProfile from '../../../components/ItemProfile';
import {signOff} from '../../../flux/auth/actions';
import FastImage from 'react-native-fast-image';

const Content = (props) => {
  const {state, dispatch} = props;
  const {user} = state;
  console.log('user =>', user.activity);

  return (
    <View style={styles.container}>
      <View style={{paddingTop: 20}}>
        <Text
          style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Perfil y configuración'}
        </Text>
      </View>

      <ScrollView //Content
      >
        <View // Image profile
        >
          {user.imageUrl ? (
            <View style={styles.imageProfile}>
              <FastImage
                style={styles.containerImage}
                source={{uri: user.imageUrl}}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.containerRating}>
                <Text
                  style={[
                    {marginBottom: 5},
                    Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center'),
                  ]}>
                  Actividades
                </Text>
                {user.activity &&
                  user.activity.map((item, index) => {
                    return (
                      <View key={index}>
                        <Text>{item}</Text>
                      </View>
                    );
                  })}
                <Text> {`Ranting: ${user.rating}`}</Text>
              </View>
            </View>
          ) : (
            <Text>chao</Text>
          )}
        </View>
        <View //items
          style={styles.profileContainer}>
          <ItemProfile
            title={`${user.firstName}${user.lastName}`}
            icon={'user'}
            decorationLine={true}
          />
          <ItemProfile
            title={`${user.email}`}
            icon={'envelope'}
            decorationLine={true}
          />
          <ItemProfile
            title={'Actualizar contraseña'}
            icon={'lock'}
            action={() => {
              console.log('cerrar Sesion');
            }}
            decorationLine={true}
          />
          <ItemProfile
            title={'Comparte La Femme con tus amigos'}
            icon={'paper-plane'}
            action={() => {
              console.log('cerrar Sesion');
            }}
            decorationLine={true}
          />
          <ItemProfile
            title={'Mis direcciones'}
            icon={'map-marker'}
            action={() => {
              console.log('cerrar Sesion');
            }}
            decorationLine={false}
          />
        </View>

        <View //Legals
          style={styles.profileContainer}>
          <ItemProfile
            title={'Califica tu experiencia'}
            icon={'star'}
            action={() => {
              console.log('cerrar Sesion');
            }}
            decorationLine={true}
          />
          <ItemProfile
            title={'Condiciones del servicio'}
            icon={'check-square'}
            action={() => {
              console.log('cerrar Sesion');
            }}
            decorationLine={true}
          />

          <ItemProfile
            title={'Ayuda'}
            icon={'question-circle'}
            action={() => {
              console.log('cerrar Sesion');
            }}
            decorationLine={false}
          />
        </View>
        <View //logout
          style={styles.profileContainer}>
          <ItemProfile
            title={'Cerrar Sesión'}
            icon={'sign-out-alt'}
            action={() => {
              signOff(dispatch);
            }}
            decorationLine={false}
          />
        </View>
        <View //About
          style={styles.profileContainer}>
          <View style={styles.separator} />
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            La Femme Clientes
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'deviceInfo.readableVersion'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `whatsapp://send?text=Me interesa contactar al desarrollador de La Femme &phone=+573106873181`,
              );
            }}
            style={{marginVertical: 20}}>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.tiny,
                'center',
              )}>
              {'Desarrollado por'}
            </Text>
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.small, 'center')}>
              {'@NiboStudio'}
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    paddingTop: Metrics.addHeader,
    flexDirection: 'column',
    backgroundColor: Colors.light,
  },
  containerImage: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignSelf: 'center',
  },
  imageProfile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Metrics.baseMargin * 3,
    marginVertical: 20,
  },
  containerRating: {
    alignSelf: 'center',
  },
});
export default Content;
