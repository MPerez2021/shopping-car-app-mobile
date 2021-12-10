import React, { useEffect } from 'react'
import { View, StyleSheet, Dimensions, FlatList } from 'react-native'
import { collection, onSnapshot, getFirestore, query, where } from "firebase/firestore";
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import QRCode from 'react-native-qrcode-svg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MyProducts = () => {
    const [userDataProductsBought, setUserDataProductsBought] = React.useState([])
    const [qrCode, setQrCode] = React.useState('GO')
    const [visible2, setVisible2] = React.useState(false);
    const db = getFirestore()
    const auth = getAuth()

    useEffect(() => {
        const getProducts = query(collection(db, 'productsBought'), where('user', '==', auth.currentUser.uid))
        const unsubcribe = onSnapshot(getProducts, (data) => {
            let products = []
            data.forEach((productData) => {
                let docs = {
                    totalCost: productData.data().totalCost,
                    user: productData.data().user,
                    product: productData.data().products,
                    productId: productData.id
                }
                products.push(docs)
            })
            setUserDataProductsBought(products)
        })
        return () => {
            unsubcribe()
        }
    }, [])
    return (
        <View style={{ backgroundColor: 'white' }}>
            <FlatList data={userDataProductsBought}
                renderItem={({ item, index }) =>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text>Compra# {index + 1}</Text>
                            <Text>{item.totalCost}</Text>
                            {item.product.map(data =>
                                <Text>{data.cost}</Text>
                            )}
                        </View>
                        <Button mode='outlined' onPress={() => {
                            setQrCode(item.productId)
                            setVisible2(!visible2)
                        }}>Ver código Qr</Button>
                    </View>
                } />
            <Portal>
                <Modal visible={!visible2} contentContainerStyle={styles.containerStyle}>
                    <Text style={{ color: 'red' }} onPress={() => {
                        setVisible2(true)
                    }}>Cerrar</Text>
                    <QRCode color='black' size={300} value={qrCode} />
                </Modal>
            </Portal>
        </View>
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
    containerStyle: {
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15
    }
})
export default MyProducts
