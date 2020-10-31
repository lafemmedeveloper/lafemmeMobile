import React, {useContext, useEffect} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import GalleryItem from '../../components/GalleryItem';
import {StoreContext} from '../../flux';
import {getGallery} from '../../flux/util/actions';
import {ApplicationStyles, Fonts, Images, Metrics, Colors} from '../../themes';

const Gallery = () => {
  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {gallery} = util;

  useEffect(() => {
    getGallery(utilDispatch);
  }, [utilDispatch]);

  return (
    <ScrollView style={{flex: 0, height: Metrics.screenHeight - 80}}>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      <Image
        source={Images.inspo}
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
        {'Inspo'}
      </Text>

      <Text style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
        {'Busca inspiración pra tu próxima cita'}
      </Text>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      {gallery &&
        gallery.length > 0 &&
        gallery.map((item, index) => {
          return <GalleryItem key={index} index={index} item={item} />;
        })}
    </ScrollView>
  );
};

export default Gallery;
