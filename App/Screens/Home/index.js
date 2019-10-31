/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, {Component, useContext, useEffect, useState} from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import {
  Colors,
  Fonts,
  Images,
  Metrics,
  ApplicationStyles,
  FlatList,
} from '../../Themes';

import AutoHeightImage from 'react-native-auto-height-image';
import Header from '../../Components/Header';
import GalleryItem from '../../Components/GalleryItem';
import ExpandHome from '../../Components/ExpandHome';
import BannerScroll from '../../Components/BannerScroll';

import Login from '../../Screens/Login';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import FastImage from 'react-native-fast-image';

imgs = [
  {
    src: 'https://c1.staticflickr.com/9/8387/8638813125_3cac0dc01c_n.jpg',
    width: 274,
    height: 182,
    rating: 4.2,
    date: '09-10-2019',
    expertName: 'Sofia Botero',
    expertImage:
      'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
  },
  {
    src: 'https://c1.staticflickr.com/9/8388/8647725119_458d0c92a2_n.jpg',
    width: 243,
    height: 182,
    rating: 4.8,
    date: '09-10-2019',
    expertName: 'Sofia Botero',
    expertImage:
      'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
  },
  {
    src: 'https://c1.staticflickr.com/6/5162/5230435699_f1eec256fe_n.jpg',
    width: 272,
    height: 182,
    rating: 4.0,
    date: '09-10-2019',
    expertName: 'Sofia Botero',
    expertImage:
      'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
  },
  {
    src: 'https://c1.staticflickr.com/4/3644/3396273424_47b22fd76f_m.jpg',
    width: 199,
    height: 182,
    rating: 3.5,
    date: '09-10-2019',
    expertName: 'Sofia Botero',
    expertImage:
      'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
  },
  {
    src: 'https://c1.staticflickr.com/7/6007/5987700999_7dbff6cb6c_n.jpg',
    width: 259,
    height: 172,
    rating: 5.0,
    date: '09-10-2019',
    expertName: 'Sofia Botero',
    expertImage:
      'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
  },
  {
    src: 'https://c1.staticflickr.com/1/183/363751844_4fe568940a_m.jpg',
    width: 240,
    height: 172,
    rating: 4.1,
    date: '09-10-2019',
    expertName: 'Sofia Botero',
    expertImage:
      'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
  },
  {
    src: 'https://c1.staticflickr.com/4/3457/3945833048_49caa3fc57_n.jpg',
    width: 260,
    height: 172,
    rating: 5.0,
    date: '09-10-2019',
    expertName: 'Sofia Botero',
    expertImage:
      'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
  },
];
export default function Home({navigation}) {
  // console.log(list);

  const [openModal, showModal] = useState(false);

  function logout() {}

  function actionL() {
    console.log('actionL');
  }

  function actionR() {
    console.log('actionR');
  }
  function selectAddress() {
    console.log('selectAddress');
  }
  function selectService(product) {
    console.log('selectService', product);
    // StatusBar.setBarStyle('dark-content', false);

    navigation.navigate('ProductDetail', {product});
  }

  function selectBanner() {
    console.log('selectBanner');

    showModal(true);
  }
  // console.log('services', services);
  // console.log('deviceInfo', deviceInfo);
  // console.log('user', user);
  // if (user.uid == null) {
  //   return <View></View>;
  // }
  return (
    <View style={styles.container}>
      <Header
        title={'Inicio'}
        iconL={Images.menu}
        iconR={Images.alarm}
        selectAddress={() => selectAddress()}
        onActionL={() => actionL()}
        onActionR={() => actionR()}
      />
      <ScrollView style={ApplicationStyles.scrollHome} bounces={false}>
        {/* {list &&
          list.map(data => {
            return (
              <ExpandHome
                key={data.id}
                data={data}
                image={{uri: data.imageUrl}}
                selectService={product => selectService(product)}></ExpandHome>
            );
          })} */}

        <BannerScroll
          key={'banner'}
          name={'Galería'}
          image={Images.banner}
          selectBanner={() => selectBanner()}
        />

        {/* <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'Home View'}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {' name:'} {user.fullName}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'email:'} {user.email}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'bundleId:'} {deviceInfo.bundleId}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'V:'}
          {deviceInfo.readableVersion}
        </Text> */}
        <TouchableOpacity
          onPress={() => {
            console.log('signOut');
            auth().signOut;
          }}>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'LOGOUT'}
          </Text>
        </TouchableOpacity>
        {/* <Text style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'uid:'} {user.uid}
        </Text>
        <TouchableOpacity onPress={logout}>
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>logout</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }}></View> */}
      </ScrollView>

      <Modal
        isVisible={openModal}
        style={{
          justifyContent: 'flex-end',
          margin: 0,

          // ,height: Metrics.screenHeight * 0.7
          // top:100,
        }}
        backdropColor={'rgba(100,74, 87, 0.75)'}>
        <View
          style={{
            // flex: 1,
            // paddingTop: Metrics.addHeader,
            width: Metrics.screenWidth,
            height: Metrics.screenHeight * 0.85,
            backgroundColor: Colors.light,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              showModal(false);
            }}>
            <Text>─</Text>
          </TouchableOpacity>

          <ScrollView
            style={{
              flex: 1,
              width: Metrics.screenWidth,
              // height:'100%',
              // backgroundColor: 'blue'
              // flexDirection: 'row'
              // flexWrap: 'wrap'
            }}>
            <View
              style={{
                width: Metrics.screenWidth,
                // height:'100%',
                // backgroundColor: 'blue',
                flexDirection: 'row',
                // flexWrap: 'wrap'
              }}>
              <View
                style={{
                  flex: 1,
                  width: Metrics.screenWidth / 2,
                  // height:'100%',
                  // backgroundColor: 'green',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {openModal &&
                  imgs.map((item, index) => {
                    if (index % 2 != 0) {
                      return null;
                    }
                    return (
                      <GalleryItem
                        key={index}
                        index={index}
                        item={item}></GalleryItem>
                    );
                  })}
              </View>
              <View
                style={{
                  flex: 1,
                  width: Metrics.screenWidth / 2,
                  // height:'100%',
                  // backgroundColor: 'green',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {openModal &&
                  imgs.map((item, index) => {
                    if (index % 2 == 0) {
                      return null;
                    }
                    return (
                      <GalleryItem
                        key={index}
                        index={index}
                        item={item}></GalleryItem>
                    );
                  })}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        isVisible={false}
        // isVisible={user.uid == null}
        style={{
          justifyContent: 'flex-end',
          margin: 0,

          // ,height: Metrics.screenHeight * 0.7
          // top:100,
        }}
        backdropColor={'rgba(100,74, 87, 0.75)'}>
        <View
          style={{
            flex: 0,
            justifyContent: 'flex-end',
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.light,
          }}>
          <Login></Login>
        </View>
      </Modal>
    </View>
  );
}
