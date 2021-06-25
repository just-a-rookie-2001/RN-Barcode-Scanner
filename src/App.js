import React, { useEffect, useState } from 'react'

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  SplashScreen,
  SettingsScreen,
  ModalScanScreen,
  ModalResultScreen
} from './screens'


const Stack = createStackNavigator();
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  function handleSignOut(e) {
    e.preventDefault();
    auth().signOut();
    setUser(null);
  }

  useEffect(() => {
    const usersRef = firestore().collection('Users');
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  function MainTabs() {
    return (
      <Tab.Navigator tabBarOptions={{ tabStyle: { height: 50 }, style: { height: 60, paddingVertical: 5 }, activeTintColor: "#788eec" }}>
        <Tab.Screen name="Home" options={{ tabBarIcon: ({ color }) => (<Icon name="home" size={25} color={color} />) }} >
          {props => <HomeScreen {...props} extraData={user} />}
        </Tab.Screen>
        <Tab.Screen name="Settings" options={{ tabBarIcon: ({ color }) => (<Icon name="cogs" size={25} color={color} />) }} >
          {props => <SettingsScreen {...props} extraData={user} handleSignOut={handleSignOut} />}
        </Tab.Screen>
      </Tab.Navigator>
    )
  }

  if (loading) {
    return (
      <SplashScreen />
    )
  }

  return (
    <>
      {loading ?
        <SplashScreen />
        :
        <NavigationContainer transitionerStyle={{ backgroundColor: 'white' }}>
          {user !== null ? (
            <RootStack.Navigator headerMode="none">
              <RootStack.Screen name="MainTab" component={MainTabs} />
              <RootStack.Screen name="ModalScan" component={ModalScanScreen} />
              <RootStack.Screen name="ModalResult">
                {props => <ModalResultScreen {...props} extraData={user} />}
              </RootStack.Screen>
            </RootStack.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="Login" options={{ animationTypeForReplace: 'pop' }}>
                {(props) => <LoginScreen {...props} setUser={setUser} setLoading={setLoading} />}
              </Stack.Screen>
              <Stack.Screen name="Registration">
                {(props) => <RegistrationScreen {...props} setUser={setUser} setLoading={setLoading} />}
              </Stack.Screen>
            </Stack.Navigator>
          )}
        </NavigationContainer>
      }
    </>
  );

}