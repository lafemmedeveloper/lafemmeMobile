import React, {useContext, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StoreContext} from '../../../../../flux';
import {Colors, Fonts, Metrics} from '../../../../../themes';
import {
  expertRating,
  updateNote,
  updateStatus,
} from '../../../../../flux/util/actions';

const ModalQualtification = (props) => {
  const {utilDispatch} = useContext(StoreContext);

  const {expert, orderId, close} = props;
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);
  const changeStatus = async (status) => {
    await updateStatus(status, orderId, utilDispatch);
  };
  const sendRanting = async () => {
    const result = (rating + expert.rating) / 2;
    if (rating < 5) {
      try {
        await activeExpertChange(result);

        changeStatus(6);
        await close(false);
      } catch (error) {
        console.log('error sendRanting=>', error);
      }
    } else {
      try {
        await expertRating(expert.uid, result, utilDispatch);
        changeStatus(6);

        await close(false);
      } catch (error) {
        console.log('error sendRanting < 5 =>', error);
      }
    }
  };
  const activeExpertChange = async (result) => {
    await expertRating(expert.uid, result, utilDispatch);
    await updateNote(orderId, note, utilDispatch);
  };

  return (
    <>
      <Icon
        name={'star'}
        color={Colors.client.primaryColor}
        size={40}
        style={{alignSelf: 'center', marginVertical: 20}}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Calificame'}
      </Text>

      <Text
        style={[
          Fonts.style.light(Colors.data, Fonts.size.small, 'center'),
          {marginHorizontal: 50, marginBottom: 20},
        ]}>
        {'Califica tu experto segun tu experiencia '}
      </Text>
      <View style={styles.container}>
        <AirbnbRating
          count={5}
          reviews={['Terrible', 'Malo', 'Bien', 'Genial', 'Perfecto']}
          defaultRating={5}
          size={40}
          onFinishRating={(value) => setRating(value)}
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
          onPress={() => {
            sendRanting();
          }}
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
              backgroundColor: Colors.client.primaryColor,
              marginBottom: Metrics.addFooter + 10,
              marginTop: 20,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {'Enviar'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '50%',
  },
});

export default ModalQualtification;
