import React, {useContext, useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import _ from 'lodash';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {GalleryItem} from '../../components/GalleryItem';
import {StoreContext} from '../../flux';
import {getGallery, setLoading} from '../../flux/util/actions';

import {ApplicationStyles, Fonts, Images, Metrics, Colors} from '../../themes';

const Gallery = () => {
  const {state, utilDispatch} = useContext(StoreContext);

  const [look, setLook] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);

  const [documentData, setDocumentData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  const {util} = state;
  // const {gallery} = util;

  useEffect(() => {
    // getGallery(utilDispatch);
    retrieveData();
  }, []);

  // Retrieve Data
  const retrieveData = async () => {
    console.log('retriveData');
    // const {setLoading} = this.props;
    // setLoading(true);

    if (!look) {
      try {
        // Set State: Loading
        // setLoading(true, utilDispatch);
        setLook(true);
        console.log('Retrieving Data');
        // Cloud Firestore: Query
        let initialQuery;

        initialQuery = await firestore()
          .collection('gallery')
          .where('isApproved', '==', true)
          .orderBy('date', 'desc')
          .limit(limit);

        // Cloud Firestore: Query Snapshot
        let documentSnapshots = await initialQuery.get();

        const _documentData = documentSnapshots.docs.map(async (doc) => {
          const id = doc.id;

          return {
            id,
            ...doc.data(),
          };
        });

        Promise.all(_documentData).then(function (values) {
          let lastVisible = null; //values[_documentData.length - 1].date;

          setDocumentData(values);
          setLastVisible(lastVisible);
          setRefreshing(false);
          setLook(false);
          // setLoading(false, utilDispatch);
          // that.setState(
          //   {
          //     documentData: data,
          //     lastVisible: lastVisible,
          //     refreshing: false,
          //     look: false,
          //   },
          //   () => {
          //     console.log('complete:retriveData');
          //     setLoading(false);
          //   },
          // );
        });
      } catch (error) {
        // setLoading(false);

        console.log(error);
      }
    }
  };
  // Retrieve More
  const retrieveMore = async () => {
    console.log('retrieveMore', !look);

    if (!look) {
      try {
        // Set State: Refreshing
        setLoading(true);
        setRefreshing(true);
        setLook(true);

        console.log('Retrieving additional Data');

        let additionalQuery;

        additionalQuery = await firestore()
          .collection('gallery')
          .where('isApproved', '==', true)
          .orderBy('date', 'desc')

          .startAfter(lastVisible)
          .limit(limit);

        let documentSnapshots = await additionalQuery.get();

        const _documentData = documentSnapshots.docs.map(async (doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        });

        Promise.all(_documentData).then(function (values) {
          let lastVisible = null; // values[_documentData.length - 1].date;

          setDocumentData([...documentData, ...values]);
          setLastVisible(lastVisible);
          setRefreshing(false);
          setLook(false);
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

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

  console.log('documentData', documentData.length);
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
      {/* {gallery &&
        gallery.length > 0 &&
        gallery.map((item, index) => {
          return <GalleryItem key={index} index={index} item={item} />;
        })} */}

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={documentData}
        keyExtractor={(item, index) => String(index)}
        ListFooterComponent={renderFooter}
        // onEndReached={() => retrieveMore()}
        onEndReached={({distanceFromEnd}) => {
          // this.loadMoreItem();
          console.log(
            '🚀 ~ file: index.js ~ line 211 ~ Gallery ~ distanceFromEnd',
            distanceFromEnd,
          );
          // alert('end reached call');
          retrieveMore();
        }}
        // onScroll={this.onScroll}
        onEndReachedThreshold={1}
        refreshing={refreshing}
        renderItem={({item, index}) => {
          return <GalleryItem key={index} index={index} item={item} />;
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={retrieveData} />
        }
      />
    </View>
  );
};

export default Gallery;
