import React, {useContext, useEffect} from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics, ApplicationStyles} from '../../themes';
import ServiceItemBanner from '../../components/ServiceItemBanner';
import ExpertDealOffer from '../../components/ExpertDealOffer';
import {StoreContext} from '../../flux';
import {getExpertActiveOrders} from '../../flux/util/actions';

const HomeExpert = () => {
  const {state, utilReducer} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {expertActiveOrders, expertOpenOrders, deviceInfo} = util;
  const appType = deviceInfo;

  useEffect(() => {
    getExpertActiveOrders(utilReducer);
  }, []);

  return (
    <View style={styles.container}>
      {expertActiveOrders.length > 0 ? (
        <ServiceItemBanner
          item={expertActiveOrders[0]}
          appType={appType}
          onPress={() => {}}
        />
      ) : (
        <View style={{marginTop: Metrics.addHeader}} />
      )}
      {expertOpenOrders.length > 0 ? (
        <ScrollView
          style={[ApplicationStyles.scrollHomeExpert, {flex: 1}]}
          bounces={true}>
          {expertOpenOrders.map((item, index) => {
            console.log(item);
            return (
              <View key={item.id}>
                <ExpertDealOffer
                  order={item}
                  user={user}
                  onSwipe={() => {
                    let expertData = {
                      coordinates: {
                        latitude: 6.2458007,
                        longitude: -75.5680003,
                      },
                      id: user.id,
                      ranking: user.ranking,
                      lastName: user.lastName,
                      firstName: user.firstName,
                      image: user.pics.image,
                      thumbnail: user.pics.thumbnail,
                    };

                    assignExpert(item.id, index, expertData);
                  }}
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
            style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
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
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: Colors.backgroundColor,
  },
  bannerExpert: {
    width: '95%',
    height: 80,
    marginTop: Metrics.addHeader,
    borderRadius: Metrics.borderRadius,
    backgroundColor: Colors.expert.primaryColor,
    alignSelf: 'center',
  },
  loading: {
    backgroundColor: Colors.loader,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
  },
});

export default HomeExpert;
