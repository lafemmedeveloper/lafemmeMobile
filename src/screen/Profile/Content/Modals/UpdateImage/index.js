import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {
  Fonts,
  Images,
  Metrics,
  Colors,
  ApplicationStyles,
} from '../../../../../themes';

const UpdateImage = ({
  source,
  pickImage,
  uploadImage,
  close,
  setImgSource,
  setImageUri,
}) => {
  const handleUploadImage = async () => {
    await uploadImage();
    setImgSource(null);
    setImageUri(null);
    Alert.alert(
      'Que bien',
      'Se actualizo tu imagen de perfil satisfactoriamente',
      [{text: 'OK', onPress: () => close(false)}],
    );
  };

  return (
    <View style={styles.container}>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

      <Image
        source={Images.photo}
        style={{
          width: 50,
          height: 50,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 10,
          tintColor: Colors.client.primaryColor,
        }}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Actualizar usuario'}
      </Text>

      <Text style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
        {'Actualiza tu foto de perfil'}
      </Text>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      {source ? (
        <Image source={source} style={styles.img} />
      ) : (
        <Image source={Images.defaultUser} style={styles.img} />
      )}
      <View>
        {source ? (
          <TouchableOpacity
            style={{
              flex: 0,
              height: 40,
              width: Metrics.contentWidth,
              alignSelf: 'center',
              borderRadius: Metrics.borderRadius,
              marginVertical: 20,
              backgroundColor: Colors.client.primaryColor,
              justifyContent: 'center',
              alignItems: 'center',

              shadowColor: Colors.dark,
              shadowOffset: {
                width: 2,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 1,

              elevation: 5,
            }}
            onPress={() => handleUploadImage()}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              Guardar foto
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              flex: 0,
              height: 40,
              width: Metrics.contentWidth,
              alignSelf: 'center',
              borderRadius: Metrics.borderRadius,
              marginVertical: 20,
              backgroundColor: Colors.client.primaryColor,
              justifyContent: 'center',
              alignItems: 'center',

              shadowColor: Colors.dark,
              shadowOffset: {
                width: 2,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 1,

              elevation: 5,
            }}
            onPress={() => pickImage()}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              Abrir cámara o galería
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },

  img: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
});
export default UpdateImage;
