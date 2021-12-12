import React, { useEffect } from 'react'
import { View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import { collection, onSnapshot, getFirestore, query, where, orderBy } from "firebase/firestore";
import { Button, Modal, Portal, Text, Title, ActivityIndicator } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import QRCode from 'react-native-qrcode-svg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MyProducts = () => {
    const [userDataProductsBought, setUserDataProductsBought] = React.useState([])
    const [qrCode, setQrCode] = React.useState('GO')
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const db = getFirestore()
    const auth = getAuth()
    useEffect(() => {
        setLoading(true)
        const getProducts = query(collection(db, 'productsBought'), where('user.uid', '==', auth.currentUser.uid),
            orderBy('purchaseTime.date', "desc"), orderBy('purchaseTime.hour', 'desc'))
        const unsubcribe = onSnapshot(getProducts, (data) => {
            let products = []
            data.forEach((productData) => {
                let docs = {
                    totalCost: productData.data().totalCost,
                    user: productData.data().user,
                    product: productData.data().products,
                    productId: productData.id,
                    purchaseTime: productData.data().purchaseTime,
                    campus: productData.data().campus,
                    classRoom: productData.data().classRoom
                }
                products.push(docs)
            })
            setUserDataProductsBought(products)
            setLoading(false)
        })
        return () => {
            unsubcribe()
        }
    }, [])
    return (
        <View style={styles.container}>
            {loading
                ? <ActivityIndicator
                    size={'large'}
                    style={{
                        height: windowHeight,
                        width: windowWidth,
                    }} animating={true} color={'#fd7753'}></ActivityIndicator>
                :
                <View style={{ margin: 20 }}>
                    <Title style={{textAlign:'center', fontSize:20, marginBottom:10}}>ÚlTIMAS COMPRAS</Title>
                    <FlatList data={userDataProductsBought}
                        renderItem={({ item, index }) =>
                            <View style={styles.flatListCard}>
                                <View style={styles.cardData}>
                                    {/* <Text>Compra# {index + 1}</Text> */}
                                    <Text>Campus: {item.campus}</Text>
                                    <Text>Aula: {item.classRoom}</Text>
                                    <Text>Fecha: {item.purchaseTime.date}</Text>
                                    <Text>Hora: {item.purchaseTime.hour}</Text>
                                    {/*  {item.product.map(data =>
                                        <Text>{data.cost}</Text>
                                    )} */}
                                </View>
                                <View style={{ width: '50%', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Title style={{ fontWeight: 'bold' }}>Valor Total</Title>
                                        <Text style={{ fontSize: 15 }}>$ {item.totalCost}</Text>
                                    </View>
                                    <View style={{ width: '100%', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => {
                                            setQrCode(item.productId)
                                            setVisible(true)
                                        }}>
                                            <Image
                                                style={{ height: 45, width: 45, marginTop: 10 }}
                                                source={{ uri: 'https://cdn0.iconfinder.com/data/icons/qr-code/154/view-qr-code-scan-quick-response-512.png' }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
            }

            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.containerStyle}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Title style={{ width: 250 }}>Escanea el código para ver el detalle de tu compra</Title>
                        <Text style={{ color: 'red' }} onPress={() => {
                            setVisible(false)
                        }}>Cerrar</Text>
                    </View>
                    <View style={styles.qrCode}>
                        <QRCode color='black' size={300} value={qrCode} />
                    </View>

                </Modal>
            </Portal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: windowHeight,
        width: windowWidth
    },
    flatListCard: {
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        padding: 15,
        marginLeft: 10,
        marginRight: 10
    },
    cardData: {
        flexDirection: 'column',
        width: '50%'
    },
    containerStyle: {
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        padding: 15
    },
    qrCode: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },

})
export default MyProducts
