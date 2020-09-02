import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Images, Fonts, Colors, Metrics} from '../../themes';
import {StoreContext} from '../../flux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Utilities from '../../utilities';
import {firebase} from '@react-native-firebase/storage';
import {updatePhoto} from '../../flux/auth/actions';
import {useNavigation} from '@react-navigation/native';

const NoImage = () => {
  const navigation = useNavigation();

  const {state, authDispatch} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;

  const [imgSource, setImgSource] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState();

  const options = {
    title: 'Selecciona o toma una imagen',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const pickImage = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
        //setLoading(false);
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occured: ', response.error);
        //setLoading(false);
      } else {
        const source = {uri: response.uri};
        setImageUri(response.uri);
        setImgSource(source);
        await uploadImage();
      }
    });
  };
  const uploadImage = () => {
    const ext = imageUri.split('.').pop(); // Extract image extension
    const filename = `${Utilities.create_UUID()}.${ext}`; // Generate unique name
    setUploading(true);
    prepareImage(user.uid, filename);
  };

  const prepareImage = async (uid, filename) => {
    let x = imageUri;
    ImageResizer.createResizedImage(x, 300, 300, 'JPEG', 30, 0)
      .then((RES) => {
        console.log('RES 300', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/thumb@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = images;
                  console.log('allImages', allImages);
                  allImages.push(snapshot.downloadURL);

                  setImages(allImages);

                  firebase
                    .storage()
                    .ref(`users/${uid}/thumb@${filename}`)
                    .getDownloadURL()
                    .then((url) => {
                      console.log('url:_thumb', url);
                      setUrl(url);
                      setUploading(false);
                    });
                }
              },
              (error) => {
                Alert.alert(error, 'Sorry, Try again.');
              },
            );
        } catch (error) {
          console.log('err', error);
          //setLoading(false);
        }
      })
      .catch((error) => {
        console.log('error', error);
        //setLoading(false);
      });
  };
  const updateUser = async () => {
    await updatePhoto(url, authDispatch);
    navigation.navigate('TabBottom');
  };

  console.log('url =>', url);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.contContainer}>
          <Text
            style={Fonts.style.semiBold(Colors.gray, Fonts.size.h6, 'center')}>
            Hola,{' '}
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {`${user.firstName}`}
            </Text>
          </Text>

          <Text
            style={Fonts.style.semiBold(Colors.gray, Fonts.size.h6, 'center')}>
            Completa tu foto de perfil para continuar
          </Text>
          <View style={styles.contImage}>
            {imgSource ? (
              <Image style={styles.image} source={imgSource} />
            ) : (
              <Image style={styles.image} source={Images.upload} />
            )}
          </View>
          {imgSource ? (
            <TouchableOpacity onPress={() => updateUser()}>
              <Text
                style={Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.h6,
                  'center',
                )}>
                {'Subir'}{' '}
                <Icon
                  name={'arrow-up'}
                  size={15}
                  color={Colors.expert.primaryColor}
                />
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => pickImage()}>
              <Text
                style={Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.h6,
                  'center',
                )}>
                {'Tomar o cargar foto'}{' '}
                {uploading ? (
                  <ActivityIndicator />
                ) : (
                  <Icon
                    name={'camera'}
                    size={15}
                    color={Colors.expert.primaryColor}
                  />
                )}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => pickImage()}
        style={[
          styles.btnContainer,
          {
            backgroundColor: Colors.expert.secondaryColor,
          },
        ]}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          {'Cerrar sesion'}{' '}
          <Icon name={'sign-out-alt'} size={15} color={Colors.light} />
        </Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  image: {width: 100, height: 100, alignSelf: 'center'},
  contImage: {marginVertical: 20},
  btnContainer: {
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,

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
  },
  contContainer: {
    backgroundColor: Colors.light,
    paddingHorizontal: 10,
    paddingVertical: 60,
    borderRadius: 10,
  },
  logout: {
    marginTop: 20,
  },
});

export default NoImage;
