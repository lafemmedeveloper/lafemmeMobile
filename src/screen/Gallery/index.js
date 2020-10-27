import React, {useContext, useEffect} from 'react';
import {ScrollView} from 'react-native';
import GalleryItem from '../../components/GalleryItem';
import {StoreContext} from '../../flux';
import {getGallery} from '../../flux/util/actions';

const Gallery = () => {
  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {gallery} = util;

  useEffect(() => {
    getGallery(utilDispatch);
  }, [utilDispatch]);

  return (
    <ScrollView style={{flex: 0, height: '90%', marginTop: 25}}>
      {gallery &&
        gallery.length > 0 &&
        gallery.map((item, index) => {
          return <GalleryItem key={index} index={index} item={item} />;
        })}
    </ScrollView>
  );
};

export default Gallery;
