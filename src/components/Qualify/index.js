import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors, Fonts, Metrics} from '../../themes';
import {AirbnbRating} from 'react-native-ratings';
import {StoreContext} from '../../flux';
import {
  userRating,
  updateNote,
  updateStatus,
  sendPushFcm,
} from '../../flux/util/actions';

const Qualify = (props) => {
  const {state, utilDispatch} = useContext(StoreContext);

  const {type, userRef, close, typeQualification, ordersRef, menuIndex} = props;
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);

  const calQuantity = async () => {
    try {
      Keyboard.dismiss();

      const result = (parseFloat(rating) + parseFloat(userRef.rating)) / 2;

      const noteSend = note === '' ? 'Perfecto' : note;
      await updateNote(ordersRef.id, noteSend, typeQualification, utilDispatch);
      await userRating(userRef.uid, result, utilDispatch);
      if (type === 'expert') {
        await updateStatus(5, ordersRef, utilDispatch);
        let notification = {
          title: 'Actualización de la orden',
          body: `El experto  ${
            state.auth.user.firstName + ' ' + state.auth.user.lastName
          } esta esperando por tu calificación `,
          content_available: true,
          priority: 'high',
        };
        let dataPush = null;
        sendPushFcm(ordersRef.fcmClient, notification, dataPush);
        close(false);
        return;
      }
      let notification = {
        title: 'Actualización de la orden',
        body: `El cliente ${
          state.auth.user.firstName + ' ' + state.auth.user.lastName
        } a finalizado la el servicio de ${ordersRef.services[
          menuIndex
        ].servicesType
          .toUpperCase()
          .split('-')
          .join(' ')}`,
        content_available: true,
        priority: 'high',
      };
      let dataPush = null;
      sendPushFcm(ordersRef.fcmExpert[menuIndex], notification, dataPush);
      await updateStatus(6, ordersRef, utilDispatch);

      close(false);
      Alert.alert('Excelente', 'Gracias por calificar');
    } catch (error) {
      console.log('error calQuantity =>', error);
    }
  };

  return (
    <View style={styles.container}>
      <>
        <Icon
          name={'star'}
          color={Colors.expert.primaryColor}
          size={40}
          style={{alignSelf: 'center', marginVertical: 20}}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Calificarme'}
        </Text>

        <Text
          style={[
            Fonts.style.light(Colors.dark, Fonts.size.small, 'center'),
            {marginHorizontal: 50, marginBottom: 20},
          ]}>
          {'Para nosotros es muy importante tu experiencia'}
        </Text>
        <View style={styles.container}>
          <AirbnbRating
            count={5}
            reviews={['Terrible', 'Malo', 'Bien', 'Genial', 'Perfecto']}
            defaultRating={5}
            size={40}
            // eslint-disable-next-line radix
            onFinishRating={(value) => setRating(parseInt(value))}
            ratingBackgroundColor="#c8c7c8"
            ratingColor="#3498db"
            showRating={true}
            reviewColor={Colors.dark}
          />
          {rating < 5 && (
            <TextInput
              value={note}
              onChangeText={(text) => setNote(text)}
              placeholder={'Comentanos que tal fue tu experiencia'}
              style={{
                width: '90%',
                padding: 20,
                marginVertical: 20,
                borderRadius: Metrics.borderRadius,
                height: 100,
                backgroundColor: Colors.textInputBg,
                alignSelf: 'center',
              }}
              multiline
              numberOfLines={20}
            />
          )}

          <TouchableOpacity
            onPress={() => calQuantity()}
            style={[
              {
                flex: 0,
                borderRadius: Metrics.textInBr,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '90%',

                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.expert.primaryColor,
                marginBottom: Metrics.addFooter + 10,
                marginTop: 20,
              },
            ]}>
            {state.util.loading ? (
              <ActivityIndicator color={Colors.light} />
            ) : (
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Enviar'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default Qualify;
