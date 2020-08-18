import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {getGallery} from 'App/flux/util/actions';
import GalleryItem from 'App/components/GalleryItem';

const Gallery = (props) => {
  console.log('props=>', props);
  const {dispatch, state} = props;
  const {gallery} = state;
  useEffect(() => {
    getGallery(dispatch);
  }, []);

  return (
    <ScrollView style={{flex: 0, height: '90%'}}>
      {gallery &&
        gallery.length &&
        gallery.map((item, index) => {
          return <GalleryItem key={index} index={index} item={item} />;
        })}
    </ScrollView>
  );
};

export default Gallery;
