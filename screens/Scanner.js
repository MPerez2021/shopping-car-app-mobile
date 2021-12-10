import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import { Camera } from 'expo-camera';
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { Button, Modal, Portal, Title } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
import { FlatList } from 'react-native-gesture-handler';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Scanner = () => {  
    const [type, setType] = useState(Camera.Constants.Type.back);   
    const [showScanner, setShowScanner] = useState(false)
    const [visible, setVisible] = React.useState(false);
    const [products, setProducts] = React.useState({})
    const db = getFirestore()
    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        return () => { };
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setShowScanner(false)
        }, [])
    )
    function show() {
        setShowScanner(!showScanner)
    }
    const handleBarCodeScanned = ({ data }) => {       
        ToastAndroid.show('Buscando el usuario...', ToastAndroid.SHORT);
        let products = []
        onSnapshot(doc(db, 'productsBought', data),
            (info) => {
                if (info.data()) {
                    let docs = {
                        product: info.data().products
                    }
                    products.push(docs)
                    setShowScanner(false)
                    setVisible(true)
                    setProducts(products)

                } else {
                    ToastAndroid.show('Buscando el usuario...', ToastAndroid.SHORT);
                }
            })
    };
    return (
        <View style={styles.container}>
            <Button icon="camera" mode="contained" onPress={show}>
                Press me
            </Button>
            <Button icon="camera" mode="contained" onPress={() => console.log(products)}>
                data
            </Button>
            {showScanner ? <Camera style={styles.camera} type={type} onBarCodeScanned={handleBarCodeScanned}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <Text style={styles.text}> Flip </Text>
                    </TouchableOpacity>
                </View>
            </Camera> : null}
            <Portal>
                <Modal visible={visible} contentContainerStyle={styles.containerStyle} dismissable={false}>
                    <View style={styles.productsDetail}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title>Detalle de compra</Title>
                            <Text style={{ color: 'red' }} onPress={() => {
                                setVisible(false)
                            }}>Cerrar</Text>
                        </View>
                        <FlatList
                            data={products}
                            renderItem={({ item }) =>
                                <View>
                                    {item.product.map(data =>
                                        <Text>{data.name}</Text>
                                    )}
                                </View>
                            } />
                    </View>
                </Modal>
            </Portal>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#231e1c',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        height: windowHeight,
        width: windowWidth,
        paddingLeft: 20,
        paddingRight: 20
    },
    camera: {
        height: 300,
        width: 300
    },
    button: {
        height: 200,
        width: 200
    },
    productsDetail: {
        padding: 20
    },
    containerStyle: {
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15
    }
})
export default Scanner
