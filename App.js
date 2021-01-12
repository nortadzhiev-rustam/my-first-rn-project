import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import SignInScreen from './screens/SignInScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './components/context';
import SplashScreen from './screens/SplashScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import { DrawerContent } from './screens/DrawerContent';
import MainTabScreen from './screens/MainTabScreen';
import axios from 'axios';
export default function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const [test, setTest] = React.useState();
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            username: action.username,
            userType: action.userType,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            username: action.username,
            userType: action.userType,
            isSignout: false,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            username: null,
            userType: null,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      username: null,
      userType: null,
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let username;
      let userType;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        username = await AsyncStorage.getItem('username');
        userType = await AsyncStorage.getItem('userType');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({
        type: 'RESTORE_TOKEN',
        token: userToken,
        username: username,
        userType: userType,
      });
    };

    bootstrapAsync();
  }, []);
  React.useEffect(() => {
    const getAllTests = async () => {
      const response = await axios.get('http:/192.168.1.6:3000/api/v2/test');
      setTest(response.data.data);
    };
    getAllTests();
  }, []);
  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        let userToken = String(data.userToken);
        let username = String(data.username);
        let userType = String(data.userType);

        try {
          await AsyncStorage.multiSet([
            ['userToken', userToken],
            ['username', username],
            ['userType', userType],
          ]);
        } catch (e) {
          console.log(e);
        }
        //console.log(userData);
        dispatch({
          type: 'SIGN_IN',
          username: username,
          token: userToken,
          userType: userType,
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.multiRemove(['userToken', 'username', 'userType']);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken !== null ? (
          <Drawer.Navigator
            drawerContent={(props) => (
              <DrawerContent {...props} username={state.username} />
            )}
          >
            <Drawer.Screen name='Home'>
              {(props) => (
                <HomeScreen
                  {...props}
                  username={state.username}
                  userType={state.userType}
                  allTest={test}
                  // {...console.log(JSON.stringify(state.username))}
                />
              )}
            </Drawer.Screen>
            <Drawer.Screen name='HomeDrawer'>
              {(props) => (
                <MainTabScreen
                  {...props}
                  allTest={test}
                  user={{ username: state.username, userType: state.userType }}
                />
              )}
            </Drawer.Screen>
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator headerMode='none'>
            <Stack.Screen name='SplashScreen' component={SplashScreen} />
            <Stack.Screen name='SignInScreen' component={SignInScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
