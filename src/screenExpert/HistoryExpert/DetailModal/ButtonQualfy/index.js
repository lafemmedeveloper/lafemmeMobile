import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {Fonts, Colors, Metrics} from '../../../../themes';

const ButtonQualfy = ({service, setQualifyClient, loading}) => {
  return (
    <>
      {service.status >= 4 && service.status < 7 && service.comment === null ? (
        <TouchableOpacity
          onPress={() => setQualifyClient(true)}
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
                Calificar cliente
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
export default ButtonQualfy;
