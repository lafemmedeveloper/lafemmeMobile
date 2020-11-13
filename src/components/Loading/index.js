import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {WaveIndicator} from 'react-native-indicators';
import {StoreContext} from '../../flux';
import {Colors, Metrics} from '../../themes';

export default ({type}) => {
  const {state} = useContext(StoreContext);
  const {auth, service, util} = state;

  if (auth.loading || service.loading || util.loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              type === 'client' ? Colors.pinkMask(0.7) : Colors.expertMask(0.5),
          },
        ]}>
        <WaveIndicator
          color={
            type ? Colors[type].secondaryColor : Colors.client.secondaryColor
          }
        />
      </View>
    );
  } else {
    return null;
  }
};
const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1000,
  },
});
