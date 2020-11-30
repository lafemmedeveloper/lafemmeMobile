import React, {Component} from 'react';
import {
  View,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
import Modal from 'react-native-modal';
import * as Localize from '../../Config/Localize';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {Images, Fonts, Colors, Metrics} from '../../Themes';
import HeaderWhite from '../../Components/HeaderWhite/';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import Social from '../../Config/Share';
import * as Analytics from '../../Lib/Analytics';
import UserCommunity from '../../Components/UserCommunity';
import WebView from 'react-native-webview';
import FeedItem from '../../Components/FeedItem';
import {TitleSection} from '../../Components/Articles/TitleSection';
import FeaturedNotifications from '../../Components/Articles/FeaturedNotifications';
import VerticalSeparator from '../../Components/VerticalSeparator';
import SvgBell from '../../Components/Icons/Bell';
import SvgEdit from '../../Components/Icons/Edit';
import SvgUpCircle from '../../Components/Icons/UpCircle';
import SvgPaperPlane from '../../Components/Icons/PaperPlane';
import SvgImage from '../../Components/Icons/Image';
import SvgBack from '../../Components/Icons/Back';

export default class Community extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documentData: [],
      lastVisible: null,
      hasScrolled: false,
      page: 1,
      refreshing: false,
      look: false,
      indexMenuFullWidth: 0,
      endOfArticles: false,
      limit: 40,
      onlyPictures: false,
      commentInPut: '',
      singlePost: null,
      modalSinglePost: false,
      singlePostLike: -1,

      body: null,
      modalArticle: false,
      selectedArticle: null,

      articles: [],
      groupedArticles: null,
      categories: [],
      typesArticle: [],
      filterTopics: null,
    };
  }

  async componentDidMount() {
    const {getBlog} = this.props;
    await getBlog();
    await this.retrieveData();
    Analytics.setScreen('Community_feed');
  }

  onFav(item, type) {
    const {profile, favorites} = this.props;
    const index =
      favorites && favorites[type]
        ? favorites[type].findIndex((i) => i.id === item.id)
        : -1;
    let data = [];
    let dta = {
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      isPremium: item.isPremium,
    };
    if (index !== -1) {
      data = [
        ...favorites[type].slice(0, index),
        ...favorites[type].slice(index + 1),
      ];
    } else {
      data = favorites && favorites[type] ? [...favorites[type], dta] : [dta];
    }

    console.log('favorite:data', data, profile.uid);

    firestore()
      .collection('users')
      .doc(profile.uid)
      .set(
        {
          fav: {
            blog: data,
          },
        },
        {merge: true},
      );
  }

  // Retrieve Data
  retrieveData = async () => {
    console.log('retriveData');
    const {setLoading} = this.props;
    setLoading(true);
    const that = this;
    if (!this.state.look) {
      try {
        // Set State: Loading
        this.setState({
          loading: true,
          look: true,
        });
        console.log('Retrieving Data');
        // Cloud Firestore: Query
        let initialQuery;
        if (this.state.onlyPictures === false) {
          initialQuery = await firestore()
            .collection('postTraining')
            .where('isPublic', '==', true)
            .orderBy('date', 'desc')

            .limit(this.state.limit);
        } else {
          initialQuery = await firestore()
            .collection('postTraining')
            .where('isPublic', '==', true)
            .where('hashImage', '==', true)
            .orderBy('date', 'desc')
            .limit(this.state.limit);
        }
        // Cloud Firestore: Query Snapshot
        let documentSnapshots = await initialQuery.get();

        const documentData = documentSnapshots.docs.map(async (doc) => {
          const id = doc.id;

          return {
            id,
            ...doc.data(),
          };
        });

        Promise.all(documentData).then(function (values) {
          let lastVisible = values[documentData.length - 1].date;

          let data = _.filter(
            values,
            (item) => item.isDeleted !== true && item.isModerated !== true,
          );

          that.setState(
            {
              documentData: data,
              lastVisible: lastVisible,
              refreshing: false,
              look: false,
            },
            () => {
              console.log('complete:retriveData');
              setLoading(false);
            },
          );
        });
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    }
  };
  // Retrieve More
  retrieveMore = async () => {
    console.log('this.state.hasScrolled', this.state.hasScrolled);

    console.log('retrieveMore');

    const that = this;
    if (!this.state.look) {
      try {
        // Set State: Refreshing
        this.setState(
          {
            refreshing: true,
            look: true,
          },
          () => {},
        );
        console.log('Retrieving additional Data');
        let additionalQuery;
        if (this.state.onlyPictures === false) {
          additionalQuery = await firestore()
            .collection('postTraining')
            .where('isPublic', '==', true)
            .orderBy('date', 'desc')

            .startAfter(this.state.lastVisible)
            .limit(this.state.limit);
        } else {
          additionalQuery = await firestore()
            .collection('postTraining')
            .where('isPublic', '==', true)
            .where('hashImage', '==', true)
            .orderBy('date', 'desc')

            .startAfter(this.state.lastVisible)
            .limit(this.state.limit);
        }

        let documentSnapshots = await additionalQuery.get();

        const documentData = documentSnapshots.docs.map(async (doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        });

        Promise.all(documentData).then(function (values) {
          let lastVisible = values[documentData.length - 1].date;

          let data = _.filter(
            values,
            (item) => item.isDeleted !== true && item.isModerated !== true,
          );
          that.setState(
            {
              documentData: [...that.state.documentData, ...data],
              lastVisible: lastVisible,
              refreshing: false,
              look: false,
            },
            () => {
              console.log('complete:retriveMore');
            },
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  async onComment(item) {
    if (this.state.commentInPut.length > 0) {
      const {profile, sendPushFeed, profilePics} = this.props;
      const {singlePost} = this.state;
      let uid = profile.uid;
      let userName = `${profile.firstName} ${profile.lastName}`;
      let userImage = profile.userImage ? profile.userImage : null;
      // let userImageUrl = profile.userImageUrl ? profile.userImageUrl : null;
      let gender = profile.gender;
      let userIsPremium = profile.isPremium || profile.isPremiumManual;
      let imageUser = null;
      console.log('profilePics', profilePics);
      if (profilePics && profilePics.thumb64) {
        console.log('profilePics:64', profilePics.thumb64);
        imageUser = profilePics.thumb64;
      } else if (profilePics && profilePics.facebook) {
        console.log('profilePics:facebook', profilePics.facebook);
        imageUser = profilePics.facebook;
      } else if (profilePics && profilePics.google) {
        console.log('profilePics:google', profilePics.google);
        imageUser = profilePics.google;
      }

      let comts =
        singlePost.comments && singlePost.comments.length > 0
          ? singlePost.comments
          : [];

      console.log('comts', comts);
      let data = {
        uid,
        gender,
        userName,
        date: moment(new Date()).format('LLL'),
        message: this.state.commentInPut,
        userImage,
        userImageUrl: imageUser,
        userIsPremium,
      };
      console.log('comts:data', data);
      comts = [...comts, data];

      console.log('comts', comts);

      firestore()
        .collection('postTraining')
        .doc(item)
        .set({comments: comts}, {merge: true});
      Keyboard.dismiss();
      this.setState({commentInPut: ''});
      console.log(
        'profile.uid !== singlePost.uid',
        profile.uid !== singlePost.uid,
        profile.uid,
        singlePost.uid,
      );
      if (profile.uid !== singlePost.uid) {
        sendPushFeed(item, profile.uid, userName);
        console.log('item', item);
        messaging().subscribeToTopic(item);
      }
    }
  }

  async onLike(type, id, likesItem) {
    console.log('onLike', type, id, likesItem);
    const {profile, likes} = this.props;
    let data = [];
    console.log('type', type);
    // console.log(type, id, likesItem, use_.uid, likes[type]);

    // console.log(likes[type]);
    let index = -1;

    if (likes && likes[type]) {
      console.log(likes, likes[type], likes[type].indexOf(id));
      index = likes[type].indexOf(id);
    }

    if (index !== -1) {
      data = [...likes[type].slice(0, index), ...likes[type].slice(index + 1)];

      if (type === 'feed') {
        // console.log('feed1');
        if (likesItem > 0) {
          firestore()
            .collection('postTraining')
            .doc(id)
            .set(
              {
                likes: likesItem - 1,
                seen: firebase.firestore.FieldValue.increment(1),
              },
              {merge: true},
            );
        }
      }
    } else {
      console.log('else', likes && likes[type]);
      if (likes && likes[type]) {
        data = [...likes[type], id];
      } else {
        data = [id];
      }
      // console.log('data', data);
      if (type === 'feed') {
        // console.log('feed2');
        firestore()
          .collection('postTraining')
          .doc(id)
          .set(
            {
              likes: likesItem + 1,
              seen: firebase.firestore.FieldValue.increment(1),
            },
            {merge: true},
          );
      }
    }

    console.log('data', data, '[type]', type);

    firestore()
      .collection('users')
      .doc(profile.uid)
      .set(
        {
          likes: {
            [type]: data,
          },
        },
        {merge: true},
      );
  }

  renderFooter = () => {
    if (!this.state.loading) {
      return null;
    }

    return (
      <View
        style={{
          paddingVertical: 10,
          // borderTopWidth: 1,
          // borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  async selectFeedItem(id, active, singlePost) {
    const {setLoading} = this.props;
    const that = this;
    let idex = -1;
    setLoading(true);
    console.log('selectFeedItem', id, active);
    if (active === true) {
      firestore()
        .collection('postTraining')
        .doc(id)
        .update({seen: firebase.firestore.FieldValue.increment(1)});

      // if (active) {
      this.unsubscribe = await firestore()
        .collection('postTraining')
        .doc(id)
        .onSnapshot((querySnapshot) => {
          console.log(
            'doc',
            querySnapshot.data().userName,
            ':',
            querySnapshot.data(),
          );
          this.setState(
            {
              singlePost: {id: querySnapshot.id, ...querySnapshot.data()},
            },
            () => {
              setLoading(false);
            },
          );
        });
    } else {
      try {
        let data = that.state.documentData;
        console.log('preIDex:a');
        idex = data.findIndex((i) => i.id === id);
        // console.log(idex);
        // console.log(idex, that.state.documentData);
        if (idex !== -1) {
          data[idex] = singlePost;

          // console.log('newArray', data);
          that.setState({documentData: data}, () => {
            setLoading(false);
          });
        }
        that.unsubscribe();
      } catch (error) {
        setLoading(false);
        console.log('unsubscribe:error', error);
      }
    }
  }

  onSelectFeed(type, id, itemIsPremium, postId, titleObject) {
    const {profile, navigation, userChallenges} = this.props;

    firestore()
      .collection('postTraining')
      .doc(postId)
      .update({seen: firebase.firestore.FieldValue.increment(1)});

    console.log('onSelectFeed', type, id, itemIsPremium);

    let isPremium = profile.isPremium || profile.isPremiumManual;

    if (isPremium === false && itemIsPremium === true) {
      console.log('itemPremium:UserNOPremium');
      this.setState({modalPremium: true});
    } else {
      this.setState({isLoading: true});
      if (type === 0) {
        console.log('is 0');
        this.setState({isLoading: false});
        navigation.navigate('SingleWorkout', {
          id,
          type: 0,
          userChallenges: null,
          premiumPostData: null,
        });
      }

      if (type === 4) {
        console.log('is 4');

        this.setState({isLoading: false});
        navigation.navigate('SingleWorkout', {
          id,
          type: 0,
          titleReplace: titleObject,
          userChallenges: null,
          premiumPostData: null,
        });
      }

      if (type === 1) {
        console.log('is 1');

        this.setState({isLoading: false});
        navigation.navigate('SingleWorkout', {
          id,
          type: 1,
          userChallenges,
          premiumPostData: null,
        });
      }

      if (type === 2) {
      }
    }
  }

  renderBlog = () => {
    const {navigation, blog, lang, notifications} = this.props;

    return (
      <>
        <View
          style={{
            justifyContent: 'space-between',
            width: Metrics.screenWidth,
            flex: 0,
          }}>
          <View style={{height: Metrics.addHeader}} />
          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                console.log('action:Noticias');
                navigation.navigate('NotificationsCenter');
              }}>
              <FeaturedNotifications
                notifications={[notifications[0]]}
                lang={lang}
                onSelectNotification={(itm) => {
                  // this.onSelectNotification(itm, true);
                }}
                filterCategory={(topic) => {
                  console.log('action:blog', topic);
                }}
              />
            </TouchableOpacity>
          )}
          <View style={styles.betweenBox}>
            <Text style={styles.title}>{Localize.locale('newsTitle')}</Text>
            <TouchableOpacity
              onPress={() => {
                this.setPushBlog();
              }}>
              <SvgBell
                fill={Colors.dark}
                width={Fonts.size.h6 + 5}
                height={Fonts.size.h6 + 5}
              />
            </TouchableOpacity>
          </View>
          <TitleSection
            title={'Blog'}
            // iconTitle={true}
            titleAction={() => {
              this.setPushBlog();
            }}
            actionText={Localize.locale('Ver todos')}
            // actionIcon={null}
            action={() => {
              // StatusBar.setBarStyle('light-content', true);
              Analytics.trackWithProperties('blogAll', {
                lang,
              });
              this.setState({
                modalArticle: true,
                selectedArticle: true,
                body: 'https://orux.tv/es/blog/',
              });
            }}
          />
          <ScrollView
            horizontal
            style={{flexDirection: 'row'}}
            showsHorizontalScrollIndicator={false}>
            {blog.map((item, index) => (
              <TouchableOpacity
                style={{
                  width: Metrics.screenWidth * 0.7,
                  overflow: 'hidden',
                  marginLeft: index === 0 ? Metrics.screenWidth * 0.05 : 0,
                  resizeMode: 'cover',
                  marginRight: 15,
                  borderRadius: Metrics.borderRadius,
                  backgroundColor: Colors.accentGray,
                }}
                key={item.id}
                onPress={() => {
                  // StatusBar.setBarStyle('light-content', true);

                  Analytics.trackWithProperties('blogPost', {
                    name: item.locName.en,
                    lang,
                  });

                  this.setState({
                    modalArticle: true,
                    selectedArticle: true,
                    body: item.locUrl[lang === 'es' ? lang : 'en'],
                  });
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: 250,
                    marginRight: 10,
                    resizeMode: 'cover',
                  }}
                  source={{
                    uri: item.imageUrl,
                  }}
                />

                <View style={{marginHorizontal: 10, marginVertical: 15}}>
                  <Text
                    style={[
                      Fonts.style.semiBold(
                        Colors.dark,
                        Fonts.size.medium,
                        'left',
                      ),
                      {marginBottom: 2.5},
                    ]}>
                    {item.locName[lang === 'es' ? lang : 'en']}
                  </Text>
                  <Text
                    numberOfLines={4}
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'left',
                    )}>
                    {item.locDescription[lang === 'es' ? lang : 'en']}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <VerticalSeparator sizesType={['large', 'medium']} />
          <TitleSection
            title={Localize.locale('Comunidad')}
            actionText={null}
            actionIcon={null}
            action={() => {
              console.log('action:community');
            }}
          />
        </View>
      </>
    );

    // }
  };

  render() {
    const {profile, likes, lang} = this.props;
    const {singlePost} = this.state;
    const {selectedArticle} = this.state;
    if (!profile) {
      return null;
    }

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: Metrics.screenWidth,
            flex: 1,

            backgroundColor: Colors.snow,
          }}>
          {this.state.indexMenuFullWidth === 0 && (
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ref={(ref) => (this.flatlistFeed = ref)}
              data={this.state.documentData}
              keyExtractor={(item, index) => String(index)}
              ListFooterComponent={this.renderFooter}
              onEndReached={this.retrieveMore}
              onScroll={this.onScroll}
              onEndReachedThreshold={0}
              refreshing={this.state.refreshing}
              renderItem={({item, index}) => {
                let idex = -1;
                if (likes && likes.feed) {
                  idex = likes.feed.indexOf(item.id);
                }

                if (!item.isPublic || item.isDeleted || item.isModerated) {
                  return null;
                }

                return (
                  <>
                    {index === 0 && this.renderBlog()}
                    <FeedItem
                      lang={lang}
                      likeAutoIncrement
                      item={item}
                      idex={idex}
                      profile={profile}
                      backgroundColor={Colors.snow}
                      selectFeedItem={(id, active) => {
                        console.log('===>', id, active, this.state.singlePost);
                        this.selectFeedItem(id, active, this.state.singlePost);
                        this.setState({
                          singlePost: item,
                          modalSinglePost: true,
                          singlePostLike: idex,
                        });
                      }}
                      onSelectFeed={(
                        type,
                        objectId,
                        userIsPremium,
                        id,
                        titleObject,
                      ) => {
                        console.log(
                          '===>',
                          type,
                          objectId,
                          userIsPremium,
                          id,
                          titleObject,
                        );
                        this.onSelectFeed(
                          type,
                          objectId,
                          userIsPremium,
                          id,
                          titleObject,
                        );
                      }}
                      onSelectRecipe={(data) => {
                        this.props.navigation.navigate('SingleRecipe', {
                          id: data.objectId,
                          gender: data.gender,
                          somatotipo: data.somatotipo ? data.somatotipo : 0,
                        });

                        this.setState({
                          modalSinglePost: false,
                          singlePost: null,
                          singlePostLike: -1,
                        });
                      }}
                      onLike={(type, id, countLikes) => {
                        console.log('===>', type, id, countLikes);
                        this.onLike(type, id, countLikes);
                      }}
                      hiddePost={(id) => {
                        console.log('===>', id);
                        this.hiddePost(id);
                      }}
                      deleteItem={(type, id) => {
                        console.log('===>', type, id);
                        this.deleteItem(type, id);
                      }}
                      moderateItem={(type, id, moderateMotive) => {
                        console.log('===>', type, id, moderateMotive);
                        this.moderateItem(type, id, moderateMotive);
                      }}
                      deleteItemFeed={(type, id) => {
                        console.log('===>', type, id);
                        this.deleteItemFeed(type, id);
                      }}
                      onShareItem={(post) => {
                        Social.shareFeed(post);
                      }}
                    />
                  </>
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.retrieveData}
                />
              }
            />
          )}
          {this.state.indexMenuFullWidth === 0 && (
            <View
              style={{
                flex: 0,
                flexDirection: 'column',
                position: 'absolute',
                justifyContent: 'space-between',
                width: 45,
                height: 150,
                right: 5,
                bottom: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      onlyPictures: !this.state.onlyPictures,
                    },
                    () => {
                      this.retrieveData();
                    },
                  );
                }}
                style={[
                  styles.newPost,

                  {
                    backgroundColor: this.state.onlyPictures
                      ? Colors.OruxYellow
                      : Colors.Gray,
                  },
                ]}>
                <SvgImage width={27} height={24.5} fill={Colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  let uid = profile.uid;
                  let userName = `${profile.firstName} ${profile.lastName}`;
                  let userImage = profile.userImage ? profile.userImage : null;
                  let userImageUrl = profile.userImageUrl
                    ? profile.userImageUrl
                    : null;
                  let gender = profile.gender;

                  this.props.navigation.navigate('PostWorkout', {
                    premiumPostData: null,
                    startDate: null,
                    endDate: null,
                    type: 10,
                    id: null,
                    trainedSeconds: 0,
                    levelSelected: null,
                    level: null,
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    caloriesBurned: 0,
                    titleObject: null,
                    uid,
                    userName,
                    userImage,
                    userImageUrl,
                    gender,
                  });
                }}
                style={[styles.newPost, styles.shadown]}>
                <SvgEdit fill={Colors.dark} width={27} height={24.5} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.flatlistFeed.scrollToIndex({
                    animated: true,
                    index: 0,
                    viewPosition: 0,
                  }); // Go to element 98
                }}
                style={[
                  styles.newPost,
                  {
                    backgroundColor: Colors.OruxYellow,
                  },
                ]}>
                <SvgUpCircle width={27} height={24.5} fill={Colors.dark} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Modal //modalSinglePost
          isVisible={this.state.modalSinglePost}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
            backgroundColor: Colors.snow,
          }}>
          {this.state.modalSinglePost && singlePost && (
            <View
              style={{
                // padding: 22,
                width: Metrics.screenWidth,
                height: Metrics.screenHeight,
                flex: 1,

                alignSelf: 'center',

                borderRadius: 4,
                borderColor: 'rgba(0, 0, 0, 0.05)',
                backgroundColor: Colors.snow,
              }}>
              <HeaderWhite
                isDark={false}
                iconRight={null}
                IconLeft={SvgBack}
                actionLeft={() => {
                  this.selectFeedItem(
                    singlePost.id,
                    false,
                    this.state.singlePost,
                  );
                  this.setState({
                    modalSinglePost: false,
                    singlePost: null,
                    singlePostLike: -1,
                  });
                }}
                title={'Comunidad'}
                subtitle={null}
              />

              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{flex: 1, backgroundColor: Colors.snow}}>
                <View style={[styles.container]}>
                  <FeedItem
                    item={singlePost}
                    keyExtractor={(item, index) => item.id}
                    idex={
                      likes && likes.feed
                        ? likes.feed.indexOf(singlePost.id)
                        : -1
                    }
                    profile={profile}
                    backgroundColor={'transparent'}
                    selectFeedItem={(id, active) => {
                      console.log('===>', id, active, this.state.singlePost);
                    }}
                    onSelectFeed={(
                      type,
                      objectId,
                      userIsPremium,
                      id,
                      titleObject,
                    ) => {
                      console.log(
                        '===>',
                        type,
                        objectId,
                        userIsPremium,
                        id,
                        titleObject,
                      );
                      this.onSelectFeed(
                        type,
                        objectId,
                        userIsPremium,
                        id,
                        titleObject,
                      );
                      this.setState({
                        modalSinglePost: false,
                        singlePost: null,
                        singlePostLike: -1,
                      });
                    }}
                    onLike={(type, id, countLikes) => {
                      console.log('===>', type, id, countLikes);
                      this.onLike(type, id, countLikes);
                    }}
                    hiddePost={(id) => {
                      console.log('===>', id);
                      this.hiddePost(id);
                    }}
                    deleteItem={(type, id) => {
                      console.log('===>', type, id);
                      this.deleteItem(type, id);
                    }}
                    moderateItem={(type, id, moderateMotive) => {
                      console.log('===>', type, id, moderateMotive);
                      this.moderateItem(type, id, moderateMotive);
                    }}
                    deleteItemFeed={(type, id) => {
                      console.log('===>', type, id);
                      this.deleteItemFeed(type, id);
                    }}
                    onSelectRecipe={(data) => {
                      this.props.navigation.navigate('SingleRecipe', {
                        id: data.objectId,
                        gender: data.gender,
                        somatotipo: data.somatotipo ? data.somatotipo : 0,
                      });
                      this.setState({
                        modalSinglePost: false,
                        singlePost: null,
                        singlePostLike: -1,
                      });
                    }}
                    onShareItem={(post) => {
                      Social.shareFeed(post);
                    }}
                  />

                  <View
                    style={{
                      // flex: 0,
                      width: '100%',
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={Fonts.style.semiBold(
                        Colors.dark,
                        Fonts.size.h6,
                        'left',
                      )}>
                      {singlePost &&
                      singlePost.comments &&
                      singlePost.comments.length > 0
                        ? Localize.locale('Comentarios')
                        : Localize.locale('Sin comentarios')}
                    </Text>

                    {singlePost &&
                      singlePost.comments &&
                      singlePost.comments.length > 0 &&
                      _.sortBy(singlePost.comments, 'date')
                        .reverse()
                        .map((doc, index) => {
                          return (
                            <View key={`comments_${index}`} style={{flex: 0}}>
                              <UserCommunity
                                date={doc.date}
                                userImageUrl={doc.userImageUrl}
                                userIsPremium={doc.userIsPremium}
                                userName={doc.userName}
                              />
                              {doc.message !== null && doc.message !== '' && (
                                <Text
                                  style={[
                                    Fonts.style.regular(
                                      Colors.dark,
                                      Fonts.size.small,
                                      'left',
                                    ),
                                    {
                                      marginHorizontal: 5,
                                      marginVertical: 5,
                                      fontWeight: '200',
                                    },
                                  ]}>
                                  {doc.message}
                                </Text>
                              )}

                              <View
                                opacity={0.25}
                                style={{
                                  width: Metrics.screenWidth * 0.25,
                                  height: 0.5,
                                  backgroundColor: Colors.Gray,
                                  alignSelf: 'center',
                                  marginVertical: 10,
                                }}
                              />
                            </View>
                          );
                        })}
                  </View>
                </View>
              </ScrollView>

              <KeyboardAvoidingView
                style={{}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                enabled>
                <View
                  style={{
                    width: Metrics.screenWidth,
                    flex: 0,
                    // minHeight: 60 + Metrics.addFooter,
                    backgroundColor: Colors.dark,
                    flexDirection: 'row',
                    paddingBottom: Metrics.addFooter,
                  }}>
                  <View
                    style={{
                      // width: Metrics.screenWidth * 0.8,
                      flex: 6,
                      backgroundColor: Colors.snow,
                      marginLeft: 5,
                      marginVertical: 5,
                      borderRadius: Metrics.borderRadius,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TextInput
                      multiline={true}
                      placeholder={Localize.locale('commentPlace')}
                      style={{
                        width: '95%', //Metrics.screenWidth * 0.78,

                        minHeight: 60,
                        maxHeight: Metrics.screenWidth / 2,
                      }}
                      onChangeText={(text) =>
                        this.setState({commentInPut: text})
                      }
                      value={this.state.commentInPut}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.onComment(singlePost.id);
                    }}
                    style={{
                      // width: Metrics.screenWidth * 0.2,
                      flex: 0,
                      marginHorizontal: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <SvgPaperPlane
                      width={30}
                      height={27.5}
                      fill={Colors.snow}
                    />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          )}
        </Modal>

        <Modal //modalArticle
          isVisible={this.state.modalArticle}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}>
          {selectedArticle !== null && (
            <View
              style={{
                backgroundColor: Colors.dark,
                width: Metrics.screenWidth,
                flex: 1,
                alignSelf: 'center',
                borderRadius: 4,
                borderColor: 'rgba(0, 0, 0, 0.05)',
              }}>
              <HeaderWhite
                isDark={true}
                IconLeft={SvgBack}
                iconRight={null}
                actionLeft={() => {
                  // StatusBar.setBarStyle('dark-content', true);

                  this.setState({modalArticle: false, body: null});
                }}
                title={'Blog'}
                subtitle={null}
              />

              <View style={{flex: 1, backgroundColor: Colors.snow}}>
                {this.state.modalArticle && (
                  <WebView
                    style={{
                      width: Metrics.screenWidth,
                      height: Metrics.screenHeight - Metrics.header,
                      flex: 1,
                    }}
                    source={{uri: this.state.body}}
                  />
                )}
              </View>
            </View>
          )}
        </Modal>

        <Modal //modalPremium
          onSwipeComplete={() =>
            this.setState({modalPremium: false, modalFav: false})
          }
          onBackdropPress={() =>
            this.setState({modalPremium: false, modalFav: false})
          }
          swipeDirection={['down']}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          transparent={true}
          isVisible={this.state.modalPremium}>
          <View
            style={{
              width: Metrics.screenWidth,
              backgroundColor: Colors.dark,
              borderRadius: Metrics.borderRadius * 2,
              overflow: 'hidden',
            }}>
            <Image
              source={Images.bannerPremium}
              style={{
                width: Metrics.screenWidth,
                height: 150,
                resizeMode: 'cover',
              }}
            />
            <Text
              style={[
                {
                  marginVertical: 20,
                  marginHorizontal: Metrics.screenWidth * 0.1,
                  fontFamily: Fonts.type.base,
                  fontSize: Fonts.size.small,
                  textAlign: 'center',
                  color: Colors.snow,
                },
              ]}>
              {Localize.locale('premModal1')}{' '}
              <Text style={{fontWeight: 'bold'}}>{'PREMIUM'}</Text>
              {Localize.locale('premModal2')}.
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.setState({modalPremium: false, modalFav: false}, () => {
                  // Analytics.increment('Favorites -> Premium');

                  Analytics.setScreen('PremiumShop_Community');
                  this.props.navigation.navigate('PremiumShop');
                  this.setState({modalPremium: false, modalFav: false});
                });
              }}
              style={{
                width: Metrics.screenWidth * 0.6,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.OruxYellow,
                borderRadius: Metrics.borderRadius,
                // marginVertical: 16,
                alignSelf: 'center',
                // marginBottom: 50
              }}>
              <Text style={[{color: Colors.dark, fontFamily: Fonts.type.bold}]}>
                {Localize.locale('MÁS INFORMACIÓN')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
                marginBottom: Metrics.addFooter + 20,
                alignSelf: 'center',
              }}
              onPress={() => this.setState({modalPremium: false})}>
              <Text
                style={[
                  {
                    color: Colors.snow,
                    textDecorationLine: 'underline',
                    fontFamily: Fonts.type.base,
                  },
                ]}>
                {'CANCELAR'}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  async hiddePost(id) {
    console.log('hiddePost', id);
    await firestore().collection('postTraining').doc(id).set(
      {
        isPublic: false,
      },
      {merge: true},
    );
  }
  async deleteItem(type, id) {
    console.log('deleteDoc', type, id);
    await firestore().collection(type).doc(id).set(
      {
        isDeleted: true,
      },
      {merge: true},
    );
  }
  async moderateItem(type, id, moderateMotive) {
    console.log('moderateItem', type, id);
    await firestore().collection(type).doc(id).set(
      {
        isModerated: true,
        moderateMotive,
      },
      {merge: true},
    );
  }

  async deleteItemFeed(type, id) {
    console.log('moderateItem', type, id);
    await firestore().collection(type).doc(id).delete();
  }

  _filterResultsByTypes = (unfilteredResults, types) => {
    console.log('start:data', unfilteredResults, types);
    const results = [];
    for (let i = 0; i < unfilteredResults.length; i++) {
      let found = false;

      for (let j = 0; j < types.length; j++) {
        if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }
      console.log('found', found);
      if (found === true) {
        results.push(unfilteredResults[i]);
      }
    }

    console.log('results:_filterResults', results);
    let data = {};
    if (results.length > 0) {
      for (
        let index = 0;
        index < results[0].address_components.length;
        index++
      ) {
        console.log('idex', index);
        let doc = results[0].address_components[index];
        let key = doc.types[0];
        let value = doc.long_name;
        let item = {[key]: value};

        data = {...data, ...item};
      }
    }
    console.log('_filterResults:data', data);
    return data;
  };

  setPushBlog() {
    const {lang} = this.props;
    Alert.alert(
      Localize.locale('notificaciones'),
      Localize.locale('notificacionesBlog'),
      [
        {
          text: Localize.locale('No, Recibir notificiones'),
          onPress: () => {
            console.log('No, Pressed');
            messaging().unsubscribeFromTopic(`blog_${lang}`);
          },
          style: 'cancel',
        },
        {
          text: Localize.locale('Si, Recibir notificaciones'),
          onPress: () => {
            console.log('Si, Pressed');
            messaging().subscribeToTopic(`blog_${lang}`);
          },
        },
      ],
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.snow,
    borderRadius: Metrics.borderRadius,
    marginVertical: 5,
  },

  newPost: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.OruxYellow,
  },

  betweenBox: {
    marginTop: 10,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: Fonts.style.semiBold(Colors.dark, Fonts.size.h4, 'left'),
});