import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ToastAndroid, ScrollView, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { Button, Modal, Portal, Title, DataTable, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Scanner = () => {
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [showScanner, setShowScanner] = useState(false)
    const [visible, setVisible] = React.useState(false);
    const [products, setProducts] = React.useState([])
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
        ToastAndroid.show('Buscando compra...', ToastAndroid.SHORT);
        let products = []
        onSnapshot(doc(db, 'productsBought', data),
            (info) => {
                if (info.data()) {
                    let docs = {
                        product: info.data().products,
                        user: info.data().user,
                        totalCost: info.data().totalCost,
                        purchaseTime: info.data().purchaseTime,
                        classRoom: info.data().classRoom,
                        campus: info.data().campus
                    }
                    products.push(docs)
                    setShowScanner(false)
                    setVisible(true)
                    setProducts(products)
                } else {
                    ToastAndroid.show('Sin resultados...', ToastAndroid.SHORT);
                }
            })

    };
    return (
        <View style={styles.container}>
            <Button icon="qrcode-scan" mode="contained" onPress={show}>
                QR Scanner
            </Button>
            {showScanner ? <Camera style={styles.camera} type={type} onBarCodeScanned={handleBarCodeScanned}>
            </Camera> : null}
            <Portal>
                <Modal visible={visible} contentContainerStyle={styles.containerStyle} dismissable={false}>
                    <View style={styles.productsDetail}>
                        <ScrollView>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                {products.map(data =>
                                    <View style={{ flexDirection: 'column', width: '70%' }}>
                                        <Title style={{ fontSize: 30, fontWeight: 'bold' }}>Go Market</Title>
                                        <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Fecha</Text>
                                                <Text>{data.purchaseTime.date}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Hora</Text>
                                                <Text>{data.purchaseTime.hour}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'column', marginTop: 7 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Cliente</Text>
                                            <Text>{data.user.name}</Text>
                                        </View>
                                    </View>
                                )}
                                <View style={styles.imageView}>
                                    <Image
                                        style={{
                                            width: 100,
                                            height: 100,
                                        }}
                                        source={require('../assets/logos.png')} />
                                </View>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Title>Detalle de compra</Title>
                                <ScrollView horizontal={true}>
                                    <DataTable>
                                        <DataTable.Header>
                                            <View style={{ width: 20, alignItems: 'flex-start' }}>
                                                <DataTable.Title>
                                                    <Text style={styles.tableTitleText}>
                                                        #
                                                    </Text>
                                                </DataTable.Title>
                                            </View>
                                            <View style={{ width: 150, alignItems: 'flex-start' }}>
                                                <DataTable.Title>
                                                    <Text style={styles.tableTitleText}>
                                                        Producto
                                                    </Text>
                                                </DataTable.Title>
                                            </View>
                                            <View style={{ width: 50 }}>
                                                <DataTable.Title >
                                                    <Text style={styles.tableTitleText}>
                                                        Cantidad
                                                    </Text>
                                                </DataTable.Title>
                                            </View>
                                            <View style={{ width: 90, flexDirection: 'column', marginLeft: 10 }}>
                                                <DataTable.Title>
                                                    <Text style={styles.tableTitleText}>
                                                        Precio Unitario
                                                    </Text>
                                                </DataTable.Title>
                                            </View>
                                            <View style={{ width: 50, alignItems: 'center' }}>
                                                <DataTable.Title>
                                                    <Text style={styles.tableTitleText}>
                                                        Total
                                                    </Text>
                                                </DataTable.Title>
                                            </View>
                                        </DataTable.Header>
                                        {products.map((item) =>
                                            <View>
                                                {item.product.map((data, index) =>
                                                    <View>
                                                        <DataTable.Row>
                                                            <View style={{ width: 20, alignItems: 'flex-start' }}>
                                                                <DataTable.Cell>
                                                                    <Text>{index + 1}</Text>
                                                                </DataTable.Cell>
                                                            </View>
                                                            <View style={{ width: 150 }}>
                                                                <DataTable.Cell numb>
                                                                    <Text>{data.name}</Text>
                                                                </DataTable.Cell>
                                                            </View>
                                                            <View style={{ width: 50, alignItems: 'center' }}>
                                                                <DataTable.Cell numeric>{data.quantity}</DataTable.Cell>
                                                            </View>
                                                            <View style={{ width: 90, alignItems: 'center', marginLeft: 10 }}>
                                                                <DataTable.Cell numeric>${data.cost}</DataTable.Cell>
                                                            </View>
                                                            <View style={{ alignItems: 'center', width: 50 }}>
                                                                <DataTable.Cell numeric>${(data.cost * data.quantity).toFixed(2)}</DataTable.Cell>
                                                            </View>
                                                        </DataTable.Row>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </DataTable>
                                </ScrollView>
                                <View>
                                    {products.map(data =>
                                        <View style={{ flexDirection: 'column', marginTop: 7 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <Text style={{fontSize:20, fontWeight:'bold'}}>Valor Total</Text>
                                                <Text style={{ fontSize: 15, fontWeight: 'normal' }}> ${data.totalCost}</Text>
                                            </View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Entrega</Text>
                                            <View style={{ marginTop: 3, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Campus: </Text>
                                                <Text>{data.campus}</Text>
                                            </View>
                                            <View style={{ marginTop: 3, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Aula: </Text>
                                                <Text>{data.classRoom}</Text>
                                            </View>

                                        </View>
                                    )}
                                </View>
                            </View>                     
                            <Button 
                            mode="contained" 
                            style={{marginTop: 10}}
                            onPress={() => {
                                setVisible(false)
                            }}>
                                Aceptar
                            </Button>
                        </ScrollView>
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
        width: 300,
        marginTop: 10
    },
    button: {
        height: 200,
        width: 200
    },
    imageView: {
        width: '30%',
        backgroundColor: 'black',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row'
    },
    tableTitleText: {
        fontWeight: 'bold',
        color: 'black'
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
