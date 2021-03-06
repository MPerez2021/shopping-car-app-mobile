import React, { useEffect, useRef } from 'react'
import { Animated, View, Text, StyleSheet, Dimensions, FlatList, Image, ScrollView, ToastAndroid } from 'react-native'
import { getDocs, doc, collection, onSnapshot, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { Button, Card, Subheading, Title, Modal, Portal, ActivityIndicator } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Products = ({ navigation }) => {
    const [userExist, setUserExist] = React.useState(false)
    const [productData, setProductData] = React.useState([])
    const [userDataProducts, setUserDataProducts] = React.useState([])
    const [counter, setCounter] = React.useState({ data: [] })
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const db = getFirestore()
    const auth = getAuth()
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const moveAnim = useRef(new Animated.Value(0)).current

    // Will change fadeAnim value to 1 in 5 seconds

    useEffect(() => {
        setLoading(false)
        getProductData()
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000
        }).start();
        const getUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (info) => {
            setUserDataProducts(info.data().products)
            let x = []
            info.data().products.forEach(() => {
                x.push(1)
            });
            setCounter({ data: x })
            setLoading(true)
        })
        return () => {
            getUser()
            getProductData()
        }
    }, [])

    async function getProductData() {
        let productList = []
        const product = await getDocs(collection(db, 'products'))
        product.forEach(data => {
            let g = {
                image: data.data().image,
                price: data.data().price,
                name: data.data().name,
                id: data.id,
                quantity: 1
            }
            productList.push(g)
        })
        setProductData(productList)
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserExist(true)
        } else {
            setUserExist(false)
        }
    })

    function plus(index) {
        counter.data[index]++
        let data = counter.data
        setCounter({ data })
        userDataProducts.forEach((product, index) => {
            product.quantity = counter.data[index]
        })
    }
    function minus(index) {
        if (counter.data[index] > 1) {
            counter.data[index] = counter.data[index] - 1
            let data = counter.data
            setCounter({ data })
            userDataProducts.forEach((product, index) => {
                product.quantity = counter.data[index]
            })
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
            {userExist ?
                <View>
                    <Animated.View style={[styles.title, {
                        opacity: fadeAnim
                    }]}>
                        <Title style={styles.title}>Te damos la bienvenida {auth.currentUser.displayName}</Title>
                        <Subheading style={{ marginBottom: 10, color:'black' }}>Los mejores productos al alcance de tu mano</Subheading>
                    </Animated.View>
                </View> :
                null
            }
            <Portal>
                <Modal visible={visible} contentContainerStyle={styles.containerStyle} dismissable={false}>
                    <ScrollView >
                        <View style={styles.modal}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Title>Tus compras</Title>
                                <Text style={{ color: 'red' }} onPress={() => {
                                    setVisible(false)
                                }}>Cerrar</Text>
                            </View>
                            {userDataProducts.length !== 0 && userDataProducts.map((userData, index) =>
                                <View style={styles.product}>
                                    <View style={{ borderRadius: 20, height:160, backgroundColor: '#ffeee8' }}>
                                        <Image
                                            style={{  width: 150, height: '100%' }}
                                            source={{ uri: userData.image }}
                                            resizeMode="contain" />
                                    </View>
                                    <View style={styles.productDetail}>
                                        <Title style={styles.productName}>{userData.name}</Title>
                                        <Text style={styles.productPrice}>$ {(userData.cost * counter.data[index]).toFixed(2)}</Text>
                                        <View style={styles.counter}>
                                            <AntDesign name="minuscircleo" size={24} color="black" onPress={() => minus(index)} />
                                            <Text style={{ color: 'black', fontSize: 20 }}>{counter.data[index]}</Text>
                                            <AntDesign name="pluscircleo" size={24} color="black" onPress={() => plus(index)} />
                                        </View>
                                    </View>
                                </View>
                            )}
                            {userDataProducts.length === 0
                                ?
                                <Text style={{ color: 'grey', fontSize: 20, marginBottom: 15, textAlign: 'justify' }}>
                                    A??n no tienes productos en tu carrito, te invitamos que sigas visitando nuestra tienda</Text>
                                :
                                <View>
                                    <View style={styles.totalToPay}>                                       
                                            <Text style={{ color: 'black', fontSize: 20 }}> Productos </Text>
                                            <Text style={{ color: 'black', fontSize: 20  }}> {userDataProducts.length} </Text>                                       
                                        {/* <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ color: 'grey' }}> Total a pagar </Text>
                                            <Text style={{ color: 'white' }}> $ {calculateTotal()} </Text>
                                        </View> */}
                                    </View>
                                    <Button style={styles.payButton} icon="arrow-right" mode="contained"
                                        onPress={async () => {
                                            setDoc(doc(db, 'users', auth.currentUser.uid), {
                                                products: userDataProducts
                                            }, { merge: true })
                                            setVisible(false)
                                            navigation.navigate('Proceso de Pago', { screen: 'BuyProducts' })
                                        }}>Comprar</Button>
                                    {userDataProducts.length > 0 ? <Button style={styles.deleteButton} icon="cart-off" mode="contained"
                                        onPress={async () => {
                                            setUserDataProducts([])
                                            setDoc(doc(db, 'users', auth.currentUser.uid), {
                                                products: []
                                            }, { merge: true })
                                        }}>
                                        Borrar Productos
                                    </Button> : null}
                                </View>
                            }
                        </View>
                    </ScrollView>
                </Modal>
            </Portal>
            <Button icon="cart" mode="contained"
                uppercase={false}
                style={{ backgroundColor: '#065a7f', marginBottom: 20 }}
                onPress={() => setVisible(true)}>
                Ver carrito {userDataProducts.length > 0 ? userDataProducts.length : null}
            </Button>
            <Button icon="comment-text-multiple-outline" mode="contained"
                uppercase={false}
                style={{ backgroundColor: '#065a7f', marginBottom: 20 }}
                onPress={() => navigation.navigate('Local', { screen: 'Store' })}>Comentarios
            </Button>
            {loading ? <FlatList
                data={productData}
                renderItem={({ item }) =>
                    <View>
                        <Card style={styles.card}>
                            <View style={styles.productCard}>
                                <Card.Cover source={{ uri: (item.image) }}
                                    resizeMode="contain"
                                    style={{ backgroundColor: '#e6e8ea' }} />
                            </View>
                            <View style={{ display: 'flex', justifyContent: "space-between" }}>
                                <View style={styles.infoProductCard}>
                                    <Title style={{ color: '#4c4d4e', width: 120, flexWrap: 'wrap' }}>{item.name}</Title>
                                    <Title style={{ color: '#4c4d4e' }}>$ {item.price}</Title>
                                </View>
                                <Card.Actions style={{ position: 'absolute', bottom: 0, right: 10 }}>
                                    <Button icon="cart-plus" mode="contained"
                                        uppercase={false}
                                        style={{ backgroundColor: '#00acb6', color:'black' }}
                                        onPress={() => {
                                            if (userDataProducts.findIndex((product) => product.key === item.id) === -1) {
                                                userDataProducts.push({ cost: item.price, name: item.name, image: item.image, key: item.id, quantity: item.quantity })
                                                setDoc(doc(db, 'users', auth.currentUser.uid), {
                                                    products: userDataProducts
                                                }, { merge: true })
                                                ToastAndroid.show(item.name + ' a??adido al carrito', ToastAndroid.SHORT)
                                            } else {
                                                ToastAndroid.show('Ya has a??adido este producto antes', ToastAndroid.SHORT)
                                            }
                                        }}>
                                        A??adir
                                    </Button>
                                </Card.Actions>
                            </View>
                        </Card>
                    </View>
                }
            /*  keyExtractor={item => item.key} */
            /> : <ActivityIndicator animating={true} color={'#065a7f'} />}
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        height: windowHeight,
        width: windowWidth
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        color:'black'
    },
    card: {
        width: '100%',
        marginTop: 20
    },
    productCard: {
        position: 'relative'
    },
    infoProductCard: {
        position: 'absolute',
        left: 20,
        bottom: 10
    },
    addToCarButton: {
        position: 'absolute',
        right: 20,
        bottom: 10
    },
    containerStyle: {
        marginLeft: 15,
        marginRight: 15
    },
    modal: {
        backgroundColor: 'white',
        flex: 1,
        padding: 20,
        height: '100%'
    },
    product: {
        flexDirection: 'row',
        marginBottom: 20,
        width: '100%',
    },
    productName: {
        fontSize: 24,
        width: 150,
        flexWrap: 'wrap'
    },
    productDetail: {
        flexDirection: 'column',
        padding: 10
    },
    productPrice: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 10,
        color: 'black'
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
        backgroundColor: '#3159b5'
    },
    deleteButton: {
        backgroundColor: '#bf6a70'
    }
})
export default Products
