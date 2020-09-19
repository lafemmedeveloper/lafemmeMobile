import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';

import {Colors, Fonts, Metrics} from '../../../themes';
import ItemProfile from '../../../components/ItemProfile';
import {signOff} from '../../../flux/auth/actions';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import ModalApp from '../../../components/ModalApp';
import UpdatePassword from './Modals/UpdatePassword';
import WebView from 'react-native-webview';

const Content = (props) => {
  const {state, dispatch, deviceInfo} = props;
  const {user} = state;
  console.log('props', props);

  const [modalPassword, setModalPassword] = useState(false);
  const [tyc, seTyc] = useState(false);
  console.log('user =>', user.activity);

  const logout = () => {
    Alert.alert(
      'Oye!',
      'Realmente deseas cerrar sesión.',
      [
        {
          text: 'Cerrar',
          onPress: () => {
            signOff(dispatch);
          },
        },
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <>
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
            {user && (
              <View style={styles.containerImageProfile}>
                <View style={styles.imageProfile}>
                  <FastImage
                    style={styles.containerImage}
                    source={{uri: user ? user.imageUrl.medium : ''}}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  {user && (
                    <>
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.small,
                            'center',
                          ),
                          {marginTop: 2.5},
                        ]}>
                        {'Calificación '} {user.rating}
                      </Text>

                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={user.rating ? parseFloat(user.rating) : 5}
                        starSize={15}
                        emptyStarColor={Colors.gray}
                        fullStarColor={Colors.start}
                        halfStarColor={Colors.gray}
                      />
                    </>
                  )}
                </View>

                <View style={styles.containerRating}>
                  <Text
                    style={[
                      {marginBottom: 5},
                      Fonts.style.semiBold(Colors.dark, Fonts.size.h6),
                      'center',
                    ]}>
                    Actividades
                  </Text>
                  {user &&
                    user.activity.map((item, index) => {
                      return (
                        <View key={index} style={{marginVertical: 2.5}}>
                          <Text style={styles.activity}>{item}</Text>
                        </View>
                      );
                    })}
                </View>
              </View>
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
              arrow={true}
              title={'Actualizar contraseña'}
              icon={'lock'}
              action={() => {
                setModalPassword(true);
              }}
              decorationLine={true}
            />
            <ItemProfile
              arrow={true}
              title={'Galería INSPO'}
              icon={'images'}
              action={() => {
                console.log('Galería ');
              }}
              decorationLine={true}
            />
            <ItemProfile
              arrow={true}
              title={'Comparte La Femme con tus amigos'}
              icon={'paper-plane'}
              action={() => {
                console.log('cerrar Sesión');
              }}
              decorationLine={true}
            />
          </View>

          <View //Legals
            style={styles.profileContainer}>
            <ItemProfile
              title={'Califica tu experiencia'}
              icon={'star'}
              action={() => {
                console.log('cerrar Sesión');
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Condiciones del servicio'}
              icon={'check-square'}
              action={() => {
                seTyc(true);
              }}
              decorationLine={true}
            />

            <ItemProfile
              title={'Ayuda'}
              icon={'question-circle'}
              action={() => {
                seTyc(true);
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
                logout();
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
              {deviceInfo.readableVersion}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'whatsapp://send?text=Me interesa contactar al desarrollador de La Femme &phone=+573106873181',
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
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.small,
                  'center',
                )}>
                {'@NiboStudio'}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        </ScrollView>
      </View>
      <ModalApp open={modalPassword} setOpen={setModalPassword}>
        <UpdatePassword user={user} />
      </ModalApp>
      <ModalApp open={tyc} setOpen={seTyc}>
        <View style={{height: '90%'}}>
          <WebView
            WebView={true}
            source={{uri: 'https://lafemme.com.co/terminos-y-condiciones/'}}
            // renderLoading={this.renderLoadingView}
            startInLoadingState={true}
            style={{
              width: Metrics.screenWidth,
              alignSelf: 'center',
              flex: 1,
            }}
          />
        </View>
      </ModalApp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
  containerImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  imageProfile: {},
  containerRating: {alignItems: 'center'},
  containerImageProfile: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginVertical: 20,
  },
  activity: {
    backgroundColor: Colors.expert.primaryColor,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
export default Content;
