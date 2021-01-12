import React from 'react';
import { AuthContext } from '../components/context';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Home = ({ username, navigation }) => {
  // console.log(allTest)
  return (
    <View style={styles.container}>
      <Animatable.View
        style={styles.welcome}
        duration={1000}
        animation='fadeInUpBig'
      >
        <Text style={styles.header}>
          Merhaba {username}, Hoşgeldin!
        </Text>

        <Text>
          Bir <Text style={{ fontWeight: 'bold' }}>test seçerek </Text>
          uygulamayı kullanmaya başlayabilirsiniz.
        </Text>

        <TouchableHighlight style={styles.passButton} onPress={() => navigation.navigate('HomeDrawer')}>
          <View
            style={styles.passButtonView}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>Test Seciniz</Text>
            <MaterialIcons
              style={{ paddingTop: 3 }}
              name='navigate-next'
              color='#fff'
              size={18}
            />
          </View>
        </TouchableHighlight>
      </Animatable.View>
    </View>
  );
};

Home.propTypes = {
  username: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009387',
  },

  welcome: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
    marginTop: 300,
    padding: 20,

    borderTopStartRadius: 25,
    borderTopEndRadius: 35,
  },

  header: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,

    marginBottom: 40,
  },
  passButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    width: 200,
    height: 50,
    backgroundColor: '#006d77',
    marginTop: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButtonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
});

export default Home;
