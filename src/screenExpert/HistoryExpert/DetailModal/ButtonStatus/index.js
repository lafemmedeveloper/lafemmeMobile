import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import {Colors, Fonts, Metrics} from '../../../../themes';

const ButtonStatus = ({service, changeStatus, getServiceStatus, loading}) => {
  return (
    <>
      {service.status < 4 ? (
        <TouchableOpacity
          onPress={() => changeStatus(service)}
          style={styles.btnContainer}>
          <Text
            style={[
              Fonts.style.bold(Colors.light, Fonts.size.medium),
              {alignSelf: 'center'},
            ]}>
            {loading ? (
              <ActivityIndicator color={Colors.light} />
            ) : (
              <Text
                style={[
                  Fonts.style.bold(Colors.light, Fonts.size.medium),
                  {alignSelf: 'center'},
                ]}>
                {getServiceStatus(service.status)}
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: Metrics.screenWidth * 0.5,
    height: 40,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    backgroundColor: Colors.expert.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default ButtonStatus;
