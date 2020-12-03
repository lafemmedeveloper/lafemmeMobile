import React, {useState, useEffect, useRef, useCallback} from 'react';
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

import {ApplicationStyles, Fonts, Images, Colors, Metrics} from '../../themes';

const Gallery = () => {
  let refFlatlistFeed = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [limit] = useState(3);
  const [loading, setLoading] = useState(false);

  const [documentData, setDocumentData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

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

  const retrieveData = useCallback(async () => {
    console.log('retriveData');
    setLoading(true);

    console.log('~ lastVisible', lastVisible);

    try {
      setLoading(true);
      let initialQuery;
      initialQuery = firestore()
        .collection('gallery')
        .where('isApproved', '==', true)
        .orderBy('date', 'desc');

      // .limit(limit);

      let documentSnapshots = await initialQuery.get();

      const response = documentSnapshots.docs.map((doc) => {
        const id = doc.id;

        return {
          id,
          ...doc.data(),
        };
      });

      Promise.all(response).then((values) => {
        console.log(
          '🚀 ~ file: index.js ~ line 107 ~ Promise.all ~ values',
          values.length,
        );
        let lastVisibleResponse = values[values.length - 1];
        console.log(
          '🚀 ~ retrieveDatal ~ lastVisibleResponse',
          lastVisibleResponse,
        );

        setDocumentData(values);
        setLastVisible(lastVisibleResponse);
        setRefreshing(false);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  }, [limit]);

  const retrieveMore = useCallback(async () => {
    console.log('retrieveMore');
    // try {

    console.log(' ~ lastVisible', lastVisible);

    setRefreshing(true);

    let additionalQuery;

    additionalQuery = firestore()
      .collection('gallery')
      // .where('isApproved', '==', true)
      .orderBy('date', 'desc')
      .startAfter(lastVisible)
      .limit(limit);

    let documentSnapshots = await additionalQuery.get();
    console.log(
      '🚀 ~ file: index.js ~ line 56 ~ retrieveMore ~ documentSnapshots',
      documentSnapshots,
    );

    const response = documentSnapshots.docs.map((doc) => {
      const id = doc.id;
      return {
        id,
        ...doc.data(),
      };
    });

    Promise.all(response).then((values) => {
      console.log(
        '🚀 ~ file: index.js ~ line 107 ~ Promise.all ~ values',
        values.length,
      );
      let lastVisibleResponse = values[values.length - 1];
      console.log(
        '🚀 ~ retrieveMore ~ lastVisibleResponse',
        lastVisibleResponse,
      );
      setDocumentData([documentData, ...values]);
      setLastVisible(lastVisibleResponse);
      setRefreshing(false);
    });
    // } catch (error) {
    //   console.log(error);
    // }
  }, [limit]);

  useEffect(() => {
    retrieveData();
  }, []);

  console.log('documentData', documentData.length);
  return (
    <View style={{height: Metrics.screenHeight - 60}}>
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

      <FlatList
        // pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={(ref) => (refFlatlistFeed.current = ref)}
        data={documentData}
        keyExtractor={(item, index) => String(index)}
        // ListFooterComponent={() => renderFooter()}
        // onEndReached={() => retrieveMore()}
        // onEndReachedThreshold={0}
        refreshing={refreshing}
        renderItem={({item}) => {
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
