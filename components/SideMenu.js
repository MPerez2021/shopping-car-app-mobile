import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Drawer
} from 'react-native-paper';
import {
    DrawerContentScrollView, DrawerItem
} from '@react-navigation/drawer';
import { logo } from '../assets/logo.jpeg';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getDocs, doc, setDoc, collection, onSnapshot, getFirestore } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { AntDesign } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const auth = getAuth()
const db = getFirestore()
export function DrawerContent(props) {
    const [verifyIfUserExists, setVerifyIfUserExists] = React.useState(false)

    function logOut() {
        signOut(auth).then(() => {
            props.navigation.navigate('Login')
        })
    }
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setVerifyIfUserExists(true)
        } else {
            setVerifyIfUserExists(false)
        }

    })
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                            <Image style={styles.logo}
                                source={
                                    (require('../assets/logo.jpeg'))
                                } />

                        </View>
                    </View>                  
                        <Drawer.Section style={styles.drawerSection}>
                            <DrawerItem
                                icon={() => (
                                    <FontAwesome5 name="home" size={25} color="white" />
                                )}
                                label="Home"
                                labelStyle={styles.textDrawer}
                                onPress={() => { props.navigation.navigate('Inicio') }}
                            />
                            {/*   {!verifyIfUserExists ? <DrawerItem
                        icon={() => (
                            <FontAwesome name="user-circle-o" size={25} color="white" style={{ marginRight: 4 }} />
                        )}
                        label="Iniciar Sesión"
                        labelStyle={styles.textDrawer}
                        onPress={() => { props.navigation.navigate('Login', { screen: 'Login' }) }}
                    /> : null} */}

                            {/* {!verifyIfUserExists ? <DrawerItem
                        icon={() => (
                            <FontAwesome5 name="user-plus" size={25} color="white" />
                        )}
                        label="Registarse"
                        labelStyle={styles.textDrawer}
                        onPress={() => { props.navigation.navigate('Register', { screen: 'Register' }) }}
                    /> : null} */}
                            <DrawerItem
                                icon={() => (
                                    <AntDesign name="shoppingcart" size={24} color="white" />
                                )}
                                label="Tus compras"
                                labelStyle={styles.textDrawer}
                                onPress={()=>{props.navigation.navigate('Mis Compras'), props.navigation.closeDrawer()}}
                            />
                             <DrawerItem
                                icon={() => (
                                    <MaterialIcons name="logout" size={25} color="white" style={{ marginRight: 1 }} />
                                )}
                                label="Cerrar Sesión"
                                labelStyle={styles.textDrawer}
                                onPress={logOut}
                            /> 
                        </Drawer.Section>
                        

                </View>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: '#231e1c',
        height: windowHeight
    },
    logo: {
        width: 125,
        height: 125,
        backgroundColor: 'red'
    },
    userInfoSection: {
        paddingLeft: 20

    },
    title: {
        fontSize: 25,
        marginTop: 3,
        fontWeight: 'bold',
        color: 'white'
    },
    textDrawer: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    },
    drawerSection: {
        marginTop: 15

    },

});