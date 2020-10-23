import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Fonts, Images, Metrics, Colors} from '../../../../../themes';

const UpdateImage = ({source, pickImage, uploadImage, close}) => {
  const handleUploadImage = async () => {
    await uploadImage();
    close(false);
  };

  return (
    <View style={styles.container}>
      {source ? (
        <Image source={source} style={styles.img} />
      ) : (
        <Image source={Images.defaultUser} style={styles.img} />
      )}
      <View>
        {source ? (
          <TouchableOpacity
            style={styles.button}
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
          <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
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
  button: {
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
