/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';

import _ from 'lodash';

import HeaderExpert from '../../Components/HeaderExpert';

import {
  Colors,
  Fonts,
  Images,
  Metrics,
  ApplicationStyles,
  FlatList,
} from '../../Themes';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import {getExpertHistoryOrders} from '../../Core/Services/Actions';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIndex: 0,
    };
  }

  setMenuIndex(pos) {
    this.setState({menuIndex: pos});
  }
  render() {
    const {user, expertActiveOrders, expertHistoryOrders, appType} = this.props;
    const {menuIndex} = this.state;

    console.log('expertActiveOrders', expertActiveOrders);
    return (
      <View style={styles.container}>
        <HeaderExpert
          appType={appType}
          title={'Mi Agenda'}
          menuIndex={menuIndex}
          user={user}
          ordersActive={expertActiveOrders.length}
          selectAddress={() => this.selectAddress()}
          onAction={pos => this.setMenuIndex(pos)}
          onActionR={() => {}}
        />

        <ScrollView
          style={{
            fielx: 1,
            width: Metrics.screenWidth,
            height: '100%',
            marginTop: 60 + Metrics.addHeader,
          }}>
          <>
            {menuIndex === 0 &&
              expertActiveOrders.length > 0 &&
              expertActiveOrders.map((item, idex) => {
                return (
                  <View
                    key={idex}
                    style={{
                      width: Metrics.screenWidth * 0.95,

                      marginVertical: 5,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={Fonts.style.bold(
                        Colors.dark,
                        Fonts.size.small,
                        'left',
                      )}>
                      {item.date}
                    </Text>
                  </View>
                );
              })}
            {menuIndex === 1 &&
              expertHistoryOrders.length > 0 &&
              expertHistoryOrders.map((item, idex) => {
                return (
                  <View
                    key={idex}
                    style={{
                      width: Metrics.screenWidth * 0.95,

                      marginVertical: 5,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={Fonts.style.bold(
                        Colors.dark,
                        Fonts.size.small,
                        'left',
                      )}>
                      {item.date}
                    </Text>
                  </View>
                );
              })}

            {expertHistoryOrders.length === 0 ||
              (expertActiveOrders.length === 0 && (
                <View
                  style={{
                    width: Metrics.screenWidth,
                    // height: '100%',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={Fonts.style.bold(
                      Colors.dark,
                      Fonts.size.small,
                      'left',
                    )}>
                    Lo sentimos no tienes ordenes pendientes
                  </Text>
                </View>
              ))}
          </>
        </ScrollView>
      </View>
    );
  }
}
