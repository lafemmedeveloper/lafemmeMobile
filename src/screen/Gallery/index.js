import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import _ from 'lodash';
import firestore from '@react-native-firebase/firestore';
import {GalleryItem} from '../../components/GalleryItem';
//import {StoreContext} from '../../flux';
//import {getGallery, setLoading} from '../../flux/util/actions';

import {ApplicationStyles, Fonts, Images, Colors} from '../../themes';

const Gallery = () => {
  // const {state} = useContext(StoreContext);

  const [look, setLook] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [onlyPictures] = useState(false);

  const [documentData, setDocumentData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [indexMenuFullWidth] = useState(0);

  // const {util} = state;

  const renderFooter = () => {
    if (!loading) {
      return null;
    }

    return (
      <View
        style={{
          paddingVertical: 10,
        }}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  const retrieveMore = async () => {
    console.log('retrieveMore');
    try {
      setLook(true);
      setRefreshing(true);

      const additionalQuery = await firestore()
        .collection('gallery')
        .where('isApproved', '==', true)
        .orderBy('date', 'desc')
        .startAfter(lastVisible)
        .limit(limit)
        .get();

      const response = additionalQuery.docs.map((doc) => {
        const id = doc.id;
        return {
          id,
          ...doc.data(),
        };
      });
      console.log('documentData =>', documentData);
      Promise.all(response).then(function (values) {
        let lastVisible = values;
        console.log('lastVisible =>', lastVisible);

        setDocumentData(values);
        setLastVisible(lastVisible);
        setRefreshing(false);
        setLook(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const retrieveData = async () => {
    console.log('retriveData');
    setLoading(true);

    try {
      // Set State: Loading

      setLoading(true);
      setLook(true);
      let initialQuery;
      if (!onlyPictures) {
        initialQuery = firestore()
          .collection('gallery')
          .where('isApproved', '==', true)
          .orderBy('date', 'desc')

          .limit(limit);
      } else {
        initialQuery = firestore()
          .collection('postTraining')
          .where('isApproved', '==', true)
          .orderBy('date', 'desc')
          .limit(limit);
      }
      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get();

      const response = documentSnapshots.docs.map((doc) => {
        const id = doc.id;

        return {
          id,
          ...doc.data(),
        };
      });

      Promise.all(response).then(function (values) {
        let lastVisible = values[response.length - 1].date;
        console.log('lastVisible =>', lastVisible);

        setDocumentData(values);
        setLastVisible(lastVisible);
        setRefreshing(false);
        setLook(false);
      });
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  useEffect(() => {
    retrieveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={{flex: 0, height: '80%'}}>
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

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        //ref={(ref) => (flatlistFeed = ref)}
        data={documentData}
        keyExtractor={(item, index) => String(index)}
        ListFooterComponent={() => renderFooter()}
        onEndReached={() => retrieveData()}
        // onScroll={onScroll}
        onEndReachedThreshold={0}
        refreshing={refreshing}
        renderItem={({item, index}) => {
          return <GalleryItem item={item} />;
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => retrieveData()}
          />
        }
      />
    </View>
  );
};

export default Gallery;
