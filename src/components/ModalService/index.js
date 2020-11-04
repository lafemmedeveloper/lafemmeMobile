import React, {Fragment} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {assingExpertService} from '../../flux/util/actions';
import {ApplicationStyles, Fonts, Images, Metrics, Colors} from '../../themes';
import Loading from '../Loading';

const ModalService = ({order, user, close, dispatch, assignExpert}) => {
  const {services} = order;
  const serviceFilter = services.filter((s) => s.uid === null);
  const assingService = async (item) => {
    if (!user.activity.includes(item.servicesType)) {
      return Alert.alert(
        'Ups',
        `Lo siento no puedes tomar el servicio por que no posees la actividad ${item.servicesType
          .toUpperCase()
          .split('-')
          .join(' ')}`,
      );
    }
    let orderServices = order;
    const indexService = order.services.findIndex((i) => i.id === item.id);
    orderServices.services[indexService].uid = user.uid;
    orderServices.services[indexService].status = 1;

    await assingExpertService(orderServices, user, dispatch);
    await assignExpert(user, order, dispatch);
    close(false);
  };
  return (
    <>
      <View style={styles.container}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.delivery}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
            tintColor: Colors.expert.primaryColor,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Elige un servicio'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Escoge el servicio que quieres prestar'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <ScrollView style={{alignSelf: 'center'}}>
          {serviceFilter &&
            serviceFilter.length > 0 &&
            serviceFilter.map((item, index) => {
              return (
                <Fragment key={index}>
                  <TouchableOpacity
                    style={styles.contItem}
                    onPress={() => assingService(item)}>
                    <FastImage
                      style={styles.img}
                      source={{uri: item.img}}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <View>
                      <Text
                        style={[
                          Fonts.style.bold(Colors.data, Fonts.size.small),
                          {marginLeft: 20},
                        ]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          Fonts.style.light(Colors.data, Fonts.size.small),
                          {marginLeft: 20},
                        ]}>
                        {item.duration} mins
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    opacity={0.25}
                    style={ApplicationStyles.separatorLineMini}
                  />
                </Fragment>
              );
            })}
        </ScrollView>
      </View>
      <Loading type={'expert'} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: Metrics.screenHeight - 60,
  },
  img: {
    width: 100,
    height: 100,
  },
  contItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default ModalService;
