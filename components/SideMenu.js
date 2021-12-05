import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import { AntDesign } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const auth = getAuth()
export function DrawerContent(props) {
    function logOut() {
        signOut(auth).then(() => {
            props.navigation.popTop();
        })
    }
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
                        <DrawerItem
                            icon={() => (
                                <AntDesign name="shoppingcart" size={24} color="white" />
                            )}
                            label="Tus compras"
                            labelStyle={styles.textDrawer}
                            onPress={() => { props.navigation.navigate('Mis Compras'), props.navigation.closeDrawer() }}
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