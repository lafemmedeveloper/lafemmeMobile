import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts, Colors, Images, Metrics} from '../../../../../../themes';
import {Picker} from '@react-native-community/picker';
import utilities from '../../../../../../utilities';

const UploadPhoto = (props) => {
  const {
    services,
    pickImage,
    source,
    serviceName,
    setServiceName,
    uploadImage,
    close,
  } = props;

  const activeUpload = async () => {
    if (serviceName === '' || source === null) {
      Alert.alert('Ups', 'Necesitas la foto y una categoria para continuar');
    } else {
      await uploadImage();
      close();
    }
  };
  console.log(services);
  return (
    <View style={styles.container}>
      <Icon
        name={'camera'}
        size={50}
        color={Colors.expert.primaryColor}
        style={styles.icon}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Sube tu foto'}
      </Text>
      <View style={styles.contFunc}>
        <Image
          source={source ? source : Images.logoExpertText}
          style={styles.img}
        />
        <View style={styles.contPiker}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
            {'Seleciona tu servicio'}
          </Text>
          <Picker
            selectedValue={serviceName}
            style={styles.piker}
            onValueChange={(itemValue) => setServiceName(itemValue)}>
            <Picker.Item label={'---Seleciona un servicio---'} value={''} />
            {services &&
              services.length > 0 &&
              services.map((item, index) => {
                return (
                  <Picker.Item
                    label={utilities.capitalize(item.split('-').join(' '))}
                    value={item}
                    key={index}
                  />
                );
              })}
          </Picker>
        </View>
      </View>

      {source ? (
        <TouchableOpacity style={styles.button} onPress={() => activeUpload()}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            Guardar foto
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            Abrir camara o galeria
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '90%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  img: {width: 100, height: 100, resizeMode: 'contain', alignSelf: 'center'},
  icon: {alignSelf: 'center', marginVertical: 20},
  piker: {width: '90%', alignSelf: 'center'},
  button: {
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
  },
  contFunc: {
    marginVertical: 20,
  },
  contPiker: {marginTop: 20},
});
export default UploadPhoto;
