import React, { useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, Image, ToastAndroid } from 'react-native'
import { Title, Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ShopDetail = () => {
    const [userDataProducts, setUserDataProducts] = React.useState([])
    const [counter, setCounter] = React.useState({ data: [] })
    const auth = getAuth()
    const db = getFirestore()
    useEffect(() => {
        lg()
        return () => {
        }
    }, [])
    async function lg() {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef).then((info) => {
            setUserDataProducts(info.data().products)
            let x = []
            info.data().products.forEach(() => {
                x.push(1)
            });
            setCounter({ data: x })
        });
    }
    function plus(index) {
        counter.data[index]++
        let data = counter.data
        setCounter({ data })
    }
    function minus(index) {
        if (counter.data[index] === 1) {
            ToastAndroid.show('TEST', ToastAndroid.SHORT)
        } else {
            counter.data[index] = counter.data[index] - 1
            let data = counter.data
            setCounter({ data })
        }
    }
    function calculateTotal() {
        let total = 0
        userDataProducts.forEach((product, index) => {
            total = total + (product.cost * counter.data[index])
        })
        return total.toFixed(2)
    }
    return (
        <View style={styles.container}>
            {userDataProducts.length !== 0 && userDataProducts.map((userData, index) =>
                <View style={styles.product}>
                    <Image
                        style={{ width: 150, height: 150 }}
                        source={{ uri: 'https://picsum.photos/700' }} />
                    <View style={styles.productDetail}>
                        <Title style={styles.productName}>{userData.name}</Title>
                        <Text style={styles.productPrice}>$ {userData.cost}</Text>
                        <View style={styles.counter}>
                            <AntDesign name="minuscircleo" size={24} color="white" onPress={() => minus(index)} />
                            <Text style={{ color: 'white', fontSize: 20 }}>{counter.data[index]}</Text>
                            <AntDesign name="pluscircleo" size={24} color="white" onPress={() => plus(index)} />
                        </View>
                    </View>
                </View>
            )}
            <View>
                <View style={styles.totalToPay}>
                    <Text style={{ color: 'white' }}> {userDataProducts.length} </Text>
                    <Text style={{ color: 'white' }}> $ {calculateTotal()} </Text>
                </View>

                <Button style={styles.payButton} icon="cart-off" mode="contained"
                    onPress={async () => {
                        setUserDataProducts([])
                        setDoc(doc(db, 'users', auth.currentUser.uid), {
                            products: []
                        }, { merge: true })
                    }}>
                    Borrar Productos
                </Button>
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#231e1c',
        flex: 1,
        padding: 20,
        height: windowHeight,
        width: windowWidth,
        justifyContent: 'space-between'
    },
    product: {
        backgroundColor: '#161719',
        flexDirection: 'row'
    },
    productName: {
        fontSize: 24,
        color: 'white'
    },
    productDetail: {
        flexDirection: 'column',
        padding: 10
    },
    productPrice: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 10,
        color: 'white'
    },
    counter: {
        flexDirection: 'row',
        width: 100,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalToPay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    payButton: {
        marginBottom: 20,
        backgroundColor: '#fd7753'

    }
})
export default ShopDetail
