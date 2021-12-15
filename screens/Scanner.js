import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ToastAndroid, ScrollView, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { Button, Modal, Portal, Title, DataTable, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Scanner = () => {
    const [hasPermission, setHasPermission] = useState(null);
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
                        campus: info.data().campus,
                        phoneNumber: info.data().phoneNumber,
                        idBanner: info.data().idBanner
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
            <Button icon="qrcode-scan" mode="contained" onPress={show} style={{ backgroundColor: '#002d66' }}>
                <Text style={{ color: 'white' }}> QR Scanner</Text>
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
                                        <Title style={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>Go Market</Title>
                                        <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Fecha</Text>
                                                <Text>{data.purchaseTime.date}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Hora</Text>
                                                <Text>{data.purchaseTime.hour}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'column', marginTop: 7 }}>

                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Cliente</Text>
                                                <Text>{data.user.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Teléfono</Text>
                                                <Text>{data.phoneNumber}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'column', width: '50%', marginTop: 7 }}>
                                            <Text style={{ fontWeight: 'bold', color: 'black' }}>ID Banner</Text>
                                            <Text>{data.idBanner}</Text>
                                        </View>
                                    </View>
                                )}
                                <View style={styles.imageView}>
                                    <Image
                                        style={{
                                            width: 150,
                                            height: 150,
                                        }}
                                        source={require('../assets/iconShop.png')} />
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
                                                                    <Text style={{ color: 'black' }}>{index + 1}</Text>
                                                                </DataTable.Cell>
                                                            </View>
                                                            <View style={{ width: 150 }}>
                                                                <DataTable.Cell numb>
                                                                    <Text style={{ color: 'black' }}>{data.name}</Text>
                                                                </DataTable.Cell>
                                                            </View>
                                                            <View style={{ width: 50, alignItems: 'center' }}>
                                                                <DataTable.Cell numeric>
                                                                    <Text style={{ color: 'black' }}> {data.quantity}</Text>
                                                                </DataTable.Cell>
                                                            </View>
                                                            <View style={{ width: 90, alignItems: 'center', marginLeft: 10 }}>
                                                                <DataTable.Cell numeric>
                                                                    <Text style={{ color: 'black' }}>${data.cost}</Text>
                                                                </DataTable.Cell>
                                                            </View>
                                                            <View style={{ alignItems: 'center', width: 50 }}>
                                                                <DataTable.Cell numeric>
                                                                    <Text style={{ color: 'black' }}>${(data.cost * data.quantity).toFixed(2)}</Text>
                                                                </DataTable.Cell>
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
                                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Valor Total</Text>
                                                <Text style={{ fontSize: 15, fontWeight: 'normal', color: 'black' }}> ${data.totalCost}</Text>
                                            </View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Entrega</Text>
                                            <View style={{ marginTop: 3, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Campus: </Text>
                                                <Text>{data.campus}</Text>
                                            </View>
                                            <View style={{ marginTop: 3, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Aula: </Text>
                                                <Text>{data.classRoom}</Text>
                                            </View>

                                        </View>
                                    )}
                                </View>
                            </View>
                            <Button
                                mode="contained"
                                style={{ marginTop: 10, backgroundColor: '#00acb6' }}
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
        height: '100%',
        flexDirection: 'row',
        borderRadius: 20,
        justifyContent:'center'
    },
    tableTitleText: {
        fontWeight: 'bold',
        color: 'black',
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
