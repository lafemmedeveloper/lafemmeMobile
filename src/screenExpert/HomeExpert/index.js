import React, {useContext, useState, useEffect} from 'react';
import {Text, View, ScrollView, StyleSheet, Switch} from 'react-native';
import {Colors, Fonts, Metrics, ApplicationStyles} from '../../themes';
import ServiceItemBanner from '../../components/ServiceItemBanner';
import ExpertDealOffer from '../../components/ExpertDealOffer';
import {StoreContext} from '../../flux';
import firestore from '@react-native-firebase/firestore';
import {setUser, setLoading} from '../../flux/auth/actions';
import {getExpertOpenOrders, assingExpert} from '../../flux/util/actions';

const HomeExpert = () => {
  const {state, authDispatch, utilDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user, loading} = auth;
  const {expertActiveOrders, expertOpenOrders, deviceInfo} = util;
  const appType = deviceInfo;

  useEffect(() => {
    if (user) {
      const {activity} = user;
      getExpertOpenOrders(activity, utilDispatch);
    }
  }, []);

  const [isEnabled, setIsEnabled] = useState(user && user.isEnabled);

  const toggleSwitch = async () => {
    try {
      setLoading(true, authDispatch);
      setIsEnabled((previousState) => !previousState);

      await firestore().collection('users').doc(user.uid).set(
        {
          isEnabled: isEnabled,
        },
        {merge: true},
      );
      await setUser(user.uid, authDispatch);
      setLoading(false, authDispatch);
    } catch (error) {
      setLoading(false, authDispatch);
      console.log('error toggleSwitch => ', error);
    }
  };

  console.log('loading home =>', loading);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerButton}>
          {user && (
            <>
              <Text
                style={Fonts.style.semiBold(
                  Colors.dark,
                  Fonts.size.h6,
                  'center',
                )}>
                Activo
              </Text>

              <Switch
                trackColor={{false: '#dbdbdb', true: '#dbdbdb'}}
                thumbColor={
                  user.isEnabled ? Colors.expert.primaryColor : '#f4f3f4'
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={user.isEnabled}
              />
            </>
          )}
        </View>
        {expertActiveOrders && expertActiveOrders.length > 0 ? (
          <ServiceItemBanner
            item={expertActiveOrders[0]}
            appType={appType}
            onPress={() => {}}
          />
        ) : (
          <View style={{marginTop: Metrics.addHeader}} />
        )}
        {expertOpenOrders && expertOpenOrders.length > 0 ? (
          <ScrollView
            style={[ApplicationStyles.scrollHomeExpert, {flex: 1}]}
            bounces={true}>
            {expertOpenOrders.map((item) => {
              return (
                <View key={item.id}>
                  <ExpertDealOffer
                    order={item}
                    user={user}
                    dispatch={utilDispatch}
                    assingExpert={assingExpert}
                  />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'No hay ordenes actualmente'}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {
                'Este pendiente de las notificaciones que te avisaremos cuando tengamos nuevos clientes'
              }
            </Text>
          </View>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: Colors.backgroundColor,
  },

  containerButton: {
    position: 'absolute',
    zIndex: 2000,
    flexDirection: 'row',
    display: 'flex',
    marginTop: 40,
    alignSelf: 'flex-end',
    right: 20,
  },
});

export default HomeExpert;
