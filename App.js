import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContent } from './components/SideMenu';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import ShopDetail from './screens/ShopDetail';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import Register from './screens/Register';
import Login from './screens/Login';
import Products from './screens/Products';
import Store from './screens/Store';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import BuyProducts from './screens/BuyProducts';
import MyProducts from './screens/MyProducts';
import Scanner from './screens/Scanner';

const firebaseConfig = {
  apiKey: "AIzaSyDaQbiZPLV1Iritn3dRSgCWWGOzcaW-zSo",
  authDomain: "shopping-car-mobile-app.firebaseapp.com",
  projectId: "shopping-car-mobile-app",
  storageBucket: "shopping-car-mobile-app.appspot.com",
  messagingSenderId: "130218438588",
  appId: "1:130218438588:web:500ca18b400585302e85b9"
};

initializeApp(firebaseConfig)
const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()


function logOut() {
  const auth = getAuth()
  signOut(auth)
}
function homePage() {
  return (
    <Drawer.Navigator screenOptions={{
      drawerStyle: {
        backgroundColor: '#065a7f'
      },
      headerStyle: {
        backgroundColor: '#065a7f'
      },
      headerTintColor: 'white'
    }} drawerContent={props => <DrawerContent {...props}></DrawerContent>}>
      <Drawer.Screen name="Inicio" component={Products} options={{
        headerRight: () => (
          <MaterialIcons name="logout" size={24} color="white" style={{ marginRight: 10 }}
            onPress={logOut} />)
      }} />
      <Drawer.Screen name="Local" component={Store} options={{
        headerRight: () => (
          <MaterialIcons name="logout" size={24} color="white" style={{ marginRight: 10 }}
            onPress={logOut} />)
      }} />
      <Drawer.Screen name="Proceso de Pago" component={BuyProducts} options={{
        headerRight: () => (
          <MaterialIcons name="logout" size={24} color="white" style={{ marginRight: 10 }}
            onPress={logOut} />)
      }} />
      <Drawer.Screen name="Mis compras" component={MyProducts} options={{
        headerRight: () => (
          <MaterialIcons name="logout" size={24} color="white" style={{ marginRight: 10 }}
            onPress={logOut} />)
      }} />
      <Drawer.Screen name="Scanner" component={Scanner} options={{
        headerRight: () => (
          <MaterialIcons name="logout" size={24} color="white" style={{ marginRight: 10 }}
            onPress={logOut} />)
      }} />
    </Drawer.Navigator>
  );
}

function loginAndRegister() {
  <>
    <Stack.Screen name="Login" component={Login}></Stack.Screen>
    <Stack.Screen name="Registro" component={Register}></Stack.Screen>
  </>
}
export default function App() {

  const [verifyIfUserExists, setVerifyIfUserExists] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  useEffect(() => {
    const auth = getAuth()
    setLoading(false)
    const user = onAuthStateChanged(auth, (user) => {
      if (user) {
        setVerifyIfUserExists(true)
        setLoading(true)
      } else {
        setVerifyIfUserExists(false)
      }
    })
    return (() => {
      user()
    })
  }, [])

  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{
          drawerStyle: {
            backgroundColor: '#231e1c'
          },
          headerStyle: {
            backgroundColor: '#065a7f'
          },
          headerTintColor: 'white',
          presentation: 'modal'
        }}>
          {!verifyIfUserExists ?
            <>
              <Stack.Screen name="Login" component={Login}></Stack.Screen>
              <Stack.Screen name="Registro" component={Register}></Stack.Screen>
            </> :
            <Stack.Screen name="Home" component={homePage} options={{
              headerShown: false
            }}></Stack.Screen>
          }

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
registerRootComponent(App);