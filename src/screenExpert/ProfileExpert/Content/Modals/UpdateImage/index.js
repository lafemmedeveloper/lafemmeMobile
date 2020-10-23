import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Fonts, Images, Metrics, Colors} from '../../../../../themes';

const UpdateImage = ({source, pickImage, uploadImage, close, type}) => {
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
            style={{
              flex: 0,
              borderRadius: Metrics.textInBr,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '90%',

              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: type
                ? Colors[type].primaryColor
                : Colors.client.primaryColor,
              marginBottom: Metrics.addFooter + 10,
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
              borderRadius: Metrics.textInBr,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '90%',

              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: type
                ? Colors[type].primaryColor
                : Colors.client.primaryColor,
              marginBottom: Metrics.addFooter + 10,
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
