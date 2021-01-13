import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {
  ApplicationStyles,
  Colors,
  Fonts,
  Images,
  Metrics,
} from '../../../../../themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StoreContext} from '../../../../../flux';
import {
  addImageGallery,
  getGallery,
  onDeleteGallery,
  setLoading,
} from '../../../../../flux/util/actions';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {firebase} from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';

import ImagePicker from 'react-native-image-picker';
import utilities from '../../../../../utilities';
import Loading from '../../../../../components/Loading';
import ModalApp from '../../../../../components/ModalApp';
import UploadPhoto from './UploadPhoto';

const GalleryExpert = ({user, services}) => {
  let isComplete = false;
  const options = {
    title: 'Selecciona o toma una imagén',
    cancelButtonTitle: 'Cancelar',
    takePhotoButtonTitle: 'Tomar una fotografía',
    chooseFromLibraryButtonTitle: 'Selecciona de la galería',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {gallery} = util;

  let [galleryUid, setGalleryUid] = useState([]);

  const [imageUri, setImageUri] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    getGallery(utilDispatch);
  }, [utilDispatch]);
  useEffect(() => {
    let insert = gallery.filter((i) => i.expertUid === user.uid);

    setGalleryUid(insert);
  }, [gallery, user.uid]);

  const pickImage = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occured: ', response.error);
      } else {
        const source = {uri: response.uri};
        setImageSource(source);
        setImageUri(response.uri);
      }
    });
  };

  const uploadImage = async () => {
    const ext = imageUri.split('.').pop(); // Extract image extension
    const filename = `${utilities.create_UUID()}.${ext}`; // Generate unique name

    await prepareImage(user.uid, filename);
  };

  const prepareImage = async (uid, filename) => {
    setLoading(true, utilDispatch);

    let picture = {
      thumbnail: null,
      small: null,
      medium: null,
      big: null,
      giant: null,
    };
    try {
      console.log('inciiando prepare');
      let x = imageUri;

      const THUMBNAIL = await ImageResizer.createResizedImage(
        x,
        56,
        56,
        'JPEG',
        30,
        0,
      );

      await firebase
        .storage()
        .ref(`users/${uid}/thumbnail@${filename}`)
        .putFile(THUMBNAIL.path)
        .on(firebase.storage.TaskEvent.STATE_CHANGED, async (snapshot) => {
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const url = await firebase
              .storage()
              .ref(`users/${uid}/thumbnail@${filename}`)
              .getDownloadURL();
            picture = {...picture, thumbnail: url};
          }
        });

      const SMALL = await ImageResizer.createResizedImage(
        x,
        128,
        128,
        'JPEG',
        30,
        0,
      );
      await firebase
        .storage()
        .ref(`users/${uid}/small@${filename}`)
        .putFile(SMALL.path)
        .on(firebase.storage.TaskEvent.STATE_CHANGED, async (snapshot) => {
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const url = await firebase
              .storage()
              .ref(`users/${uid}/small@${filename}`)
              .getDownloadURL();
            picture = {...picture, small: url};
          }
        });

      const MEDIUM = await ImageResizer.createResizedImage(
        x,
        256,
        256,
        'JPEG',
        30,
        0,
      );
      await firebase
        .storage()
        .ref(`users/${uid}/medium@${filename}`)
        .putFile(MEDIUM.path)
        .on(firebase.storage.TaskEvent.STATE_CHANGED, async (snapshot) => {
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const url = await firebase
              .storage()
              .ref(`users/${uid}/medium@${filename}`)
              .getDownloadURL();
            picture = {...picture, medium: url};
          }
        });

      const BIG = await ImageResizer.createResizedImage(
        x,
        512,
        512,
        'JPEG',
        30,
        0,
      );
      await firebase
        .storage()
        .ref(`users/${uid}/big@${filename}`)
        .putFile(BIG.path)
        .on(firebase.storage.TaskEvent.STATE_CHANGED, async (snapshot) => {
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const url = await firebase
              .storage()
              .ref(`users/${uid}/big@${filename}`)
              .getDownloadURL();

            picture = {...picture, big: url};
          }
        });

      const GIANT = await ImageResizer.createResizedImage(
        x,
        512,
        512,
        'JPEG',
        30,
        0,
      );
      await firebase
        .storage()
        .ref(`users/${uid}/giant@${filename}`)
        .putFile(GIANT.path)
        .on(firebase.storage.TaskEvent.STATE_CHANGED, async (snapshot) => {
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const url = await firebase
              .storage()
              .ref(`users/${uid}/giant@${filename}`)
              .getDownloadURL();
            picture = {...picture, giant: url};

            console.log('ultima img');

            await updateUser(picture);

            isComplete = true;
            setLoading(false, utilDispatch);
          }
        });
    } catch (error) {
      console.log('error prepareImg =>', error);
      setLoading(false, utilDispatch);
    }
  };

  const updateUser = async (picture) => {
    console.log('isComplete =>', isComplete);
    if (isComplete) {
      await addImageGallery(
        {
          expertUid: user.uid,
          expertName: user.firstName,
          expertImage: user.imageUrl.small,
          rating: user.rating,
          date: Date.now(),
          imageUrl: {...picture},
          isApproved: false,
          id: utilities.create_UUID(),
          service: serviceName,
        },
        utilDispatch,
      );
      await getGallery(utilDispatch);
      setUploadModal(false);
    }
  };

  const handleModalUpload = () => {
    setImageSource(null);
    setServiceName('');
    isComplete = false;
    setUploadModal(true);
  };

  return (
    <>
      <View style={styles.conatiner}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.inspo}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
            tintColor: Colors.expert.primaryColor,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Inspo'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Sube tus trabajos para inspirar los clientes La Femme'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        {galleryUid && galleryUid.length === 0 && (
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center'),
              {marginTop: 100},
            ]}>
            {'Lo siento aun no tienes imágenes de tu trabajo'}
          </Text>
        )}
        <ScrollView
          style={styles.contGallery}
          showsHorizontalScrollIndicator={false}>
          {galleryUid &&
            galleryUid.length > 0 &&
            galleryUid.map((item) => {
              return (
                <View key={item.id} style={styles.conCard}>
                  <TouchableOpacity>
                    <FastImage
                      style={styles.img}
                      source={{uri: item.imageUrl.giant}}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      marginLeft: 20,
                      marginBottom: 40,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text
                        style={[
                          styles.date,
                          Fonts.style.bold(Colors.dark, Fonts.size.h6),
                        ]}>
                        {utilities.capitalize(
                          item.service.split('-').join(' '),
                        )}
                      </Text>
                      <Text
                        style={[
                          styles.date,
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        Creado: {moment(item.date).format('L')}
                      </Text>
                      <Text
                        style={[
                          styles.date,
                          Fonts.style.regular(
                            item.isApproved ? 'green' : Colors.dark,
                            Fonts.size.medium,
                          ),
                        ]}>
                        {item.isApproved ? 'Aprobado' : 'En espera'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          'Confirmación',
                          'realmente deseas eliminar esta imagen',
                          [
                            {
                              text: 'ELIMINAR',
                              onPress: async () => {
                                await onDeleteGallery(item.id, utilDispatch);
                              },
                            },
                            {
                              text: 'NO',
                            },
                          ],
                        )
                      }
                      style={{justifyContent: 'center', marginRight: 20}}>
                      <Icon
                        name="delete"
                        size={25}
                        color={Colors.client.primaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleModalUpload()}>
          <Text style={Fonts.style.bold(Colors.light, Fonts.size.medium)}>
            Cargar foto
          </Text>
        </TouchableOpacity>
      </View>
      <ModalApp open={uploadModal} setOpen={setUploadModal}>
        <UploadPhoto
          services={services}
          source={imageSource}
          serviceName={serviceName}
          uploadImage={uploadImage}
          pickImage={pickImage}
          setServiceName={setServiceName}
          close={setUploadModal}
        />
      </ModalApp>
      <Loading type="expert" />
    </>
  );
};
const styles = StyleSheet.create({
  conatiner: {height: Metrics.screenHeight - 60},
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
    marginTop: 10,
  },

  contGallery: {
    alignSelf: 'center',
  },

  conCard: {},

  img: {
    width: Metrics.screenWidth * 0.8,
    height: Metrics.screenWidth * 0.8,
    alignSelf: 'center',
    marginHorizontal: 20,
    borderRadius: Metrics.borderRadius,
  },
  date: {},
});
export default GalleryExpert;
