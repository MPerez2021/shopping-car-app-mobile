import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import { AntDesign } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;

export function DrawerContent(props) {
    function logOut() {
        const auth = getAuth()
        signOut(auth).then(() => {
            props.navigation.navigate('Login');
        })
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                        <Image style={styles.logo}
                            source={
                                (require('../assets/logos.png'))
                            } />
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={() => (
                                <FontAwesome5 name="home" size={25} color="white" />
                            )}
                            label="Inicio"
                            labelStyle={styles.textDrawer}
                            onPress={() => { props.navigation.navigate('Inicio') }}
                        />
                        <DrawerItem
                            icon={() => (
                                <FontAwesome5 name="comment-alt" size={24} color="white" />
                            )}
                            label="Comentarios"
                            labelStyle={styles.textDrawer}
                            onPress={() => { props.navigation.navigate('Local'), props.navigation.closeDrawer() }}
                        />
                        <DrawerItem
                            icon={() => (
                                <AntDesign name="shoppingcart" size={24} color="white" />
                            )}
                            label="Mis compras"
                            labelStyle={styles.textDrawer}
                            onPress={() => { props.navigation.navigate('Mis compras'), props.navigation.closeDrawer() }}
                        />
                        <DrawerItem
                            icon={() => (
                                <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                            )}
                            label="QR Scanner"
                            labelStyle={styles.textDrawer}
                            onPress={() => { props.navigation.navigate('Scanner'), props.navigation.closeDrawer() }}
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
        backgroundColor: '#065a7f',
        height: windowHeight
    },
    logo: {
        width: 200,
        height: 200
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