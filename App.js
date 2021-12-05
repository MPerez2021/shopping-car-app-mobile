import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContent } from './components/SideMenu';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import ShopDetail from './screens/ShopDetail';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-native-paper';
import Register from './screens/Register';
import Login from './screens/Login';
import Products from './screens/Products';
import Store from './screens/Store';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

//initializeApp(firebaseConfig)

function logOut() {
  const auth = getAuth()
  signOut(auth)/* .then(() => {
    //navigation.navigate('Home')
    //console.log('se ha cerrado sesión');
  }) */
}
function homePage() {
  return (
    <Drawer.Navigator screenOptions={{
      drawerStyle: {
        backgroundColor: '#231e1c'
      },
      headerStyle: {
        backgroundColor: '#A24730'
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

    </Drawer.Navigator>
  );
}

export default function App() {
  const [verifyIfUserExists, setVerifyIfUserExists] = React.useState(false)
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setVerifyIfUserExists(true)
    } else {
      setVerifyIfUserExists(false)
    }
  })
  return (
    <Provider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{
          drawerStyle: {
            backgroundColor: '#231e1c'
          },
          headerStyle: {
            backgroundColor: '#A24730'
          },
          headerTintColor: 'white',
          presentation: 'transparentModal'
        }}>
          {!verifyIfUserExists ?
            <>
              <Stack.Screen name="Login" component={Login}></Stack.Screen>
              <Stack.Screen name="Register" component={Register}></Stack.Screen>
            </> :
            <Stack.Screen name="Inicio" component={homePage} options={{
              headerShown: false
            }}></Stack.Screen>
          }
          <Stack.Screen name="Mis Compras" component={ShopDetail}></Stack.Screen>
          <Stack.Screen name="Local" component={Store}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
