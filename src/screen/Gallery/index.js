import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import GalleryItem from '../../components/GalleryItem';
import {StoreContext} from '../../flux';

const Gallery = () => {
  const {state} = useContext(StoreContext);
  const {util} = state;
  const {gallery} = util;

  return (
    <ScrollView style={{flex: 0, height: '90%', marginTop: 25}}>
      {gallery &&
        gallery.length &&
        gallery.map((item, index) => {
          return <GalleryItem key={index} index={index} item={item} />;
        })}
    </ScrollView>
  );
};

export default Gallery;
