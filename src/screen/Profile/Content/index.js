import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';

import {Colors, Fonts, Images} from '../../../themes';
import styles from './styles';
import ItemProfile from '../../../components/ItemProfile';
import {signOff} from '../../../flux/auth/actions';

const Content = (props) => {
  const {state, dispatch} = props;
  const {user} = state;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Perfil y configuración'}
        </Text>
      </View>

      <ScrollView>
        <View //profile
          style={styles.profileContainer} //profile
        >
          <TouchableOpacity onPress={() => this.pickImage()}>
            {user &&
            user.picture &&
            user.picture.large &&
            user.picture.medium &&
            user.picture.thumbnail ? (
              <Image
                source={{uri: user.picture.medium}}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                }}
              />
            ) : (
              <Image
                source={Images.user}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                }}
              />
            )}
          </TouchableOpacity>

          <View style={styles.separator} />
          <Text
            style={Fonts.style.semiBold(Colors.dark, Fonts.size.h4, 'center')}>
            {`${user.firstName} ${user.lastName}`}
          </Text>

          {user.phone ? (
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {user.phone}
            </Text>
          ) : (
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              No se ha registrado Telefono
            </Text>
          )}

          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.medium,
              'center',
            )}>
            {user.email}
          </Text>
          <View style={styles.separator} />
        </View>
        <View //items
          style={styles.profileContainer}>
          <ItemProfile
            title={'Actualizar nombre'}
            icon={'user'}
            action={() => {
              console.log('cerrar Sesion');
            }}
            decorationLine={true}
          />
          <ItemProfile
            title={'Actualizar email'}
            icon={'envelope'}
            action={() => {
              console.log('cerrar Sesion');
            }}
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

export default Content;
