import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Image,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GalleryItem} from '../../components/GalleryItem';

import {ApplicationStyles, Fonts, Images, Colors, Metrics} from '../../themes';

const Gallery = () => {
  let refFlatlistFeed = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [limit] = useState(5);
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

  const retrieveMore = async () => {
    try {
      setRefreshing(true);
      console.log('Retrieving additional Data');
      let additionalQuery;

      additionalQuery = firestore()
        .collection('gallery')
        .where('isApproved', '==', true)
        .orderBy('date', 'desc')
        .startAfter(lastVisible)
        .limit(limit);

      let documentSnapshots = await additionalQuery.get();

      const response = documentSnapshots.docs.map((doc) => {
        const id = doc.id;
        return {
          id,
          ...doc.data(),
        };
      });

      Promise.all(response).then((values) => {
        let lastVisibleResponse =
          response.length > 0 ? values[response.length - 1].date : null;

        if (!lastVisibleResponse) {
          setRefreshing(false);
          setLoading(false);

          return;
        }

        setDocumentData([...documentData, ...values]);
        setLastVisible(lastVisibleResponse);
        setRefreshing(false);
        setLoading(false);
      });
    } catch (error) {
      setRefreshing(false);
      setLoading(false);

      console.log(error);
    }
  };

  const retrieveData = useCallback(async () => {
    console.log('retriveData');
    setLoading(true);

    try {
      setLoading(true);
      let initialQuery;
      initialQuery = firestore()
        .collection('gallery')
        .where('isApproved', '==', true)
        .orderBy('date', 'desc')

        .limit(limit);

      let documentSnapshots = await initialQuery.get();

      const response = documentSnapshots.docs.map((doc) => {
        const id = doc.id;

        return {
          id,
          ...doc.data(),
        };
      });

      Promise.all(response).then((values) => {
        let lastVisibleResponse = values[response.length - 1].date;

        setDocumentData(values);
        setLastVisible(lastVisibleResponse);
        setRefreshing(false);
        setLoading(false);
      });
    } catch (error) {
      setRefreshing(false);
      setLoading(false);

      console.log(error);
    }
  }, [limit]);

  useEffect(() => {
    retrieveData();
  }, [retrieveData]);

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
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={(ref) => (refFlatlistFeed.current = ref)}
        data={documentData}
        keyExtractor={(item, index) => String(index)}
        ListFooterComponent={() => renderFooter()}
        onEndReached={() => retrieveMore()}
        onEndReachedThreshold={1}
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
