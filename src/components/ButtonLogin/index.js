import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Fonts, Colors} from '../../themes';
import ModalApp from '../../components/ModalApp';
import Login from '../../screen/Login';
import styles from './styles';

const ButtonLogin = () => {
  const [modalAuth, setModalAuth] = useState(false);
  return (
    <>
      <View style={{justifyContent: 'center', flex: 1}}>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>¡Ups! lo sentimos</Text>
          <Text style={styles.title}> No hemos podido identificarte</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalAuth(true)}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>
      <ModalApp open={modalAuth} setOpen={setModalAuth}>
        <Login setModalAuth={setModalAuth} />
      </ModalApp>
    </>
  );
};

export default ButtonLogin;
