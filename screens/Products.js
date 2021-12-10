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
                        <Subheading style={{ color: 'white' }}>Los mejores productos al alcance de tu mano</Subheading>
                    </Animated.View>
                </View> :
                null
            }
            <Portal>
                <Modal visible={visible} contentContainerStyle={styles.containerStyle} dismissable={false}>
                    <ScrollView >
                        <View style={styles.modal}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Title style={{ color: 'white' }}>Tus compras</Title>
                                <Text style={{ color: 'red' }} onPress={() => {
                                    setVisible(false)
                                }}>Cerrar</Text>
                            </View>
                            {userDataProducts.length !== 0 && userDataProducts.map((userData, index) =>
                                <View style={styles.product}>
                                    <Image
                                        style={{ width: 150, height: 150, backgroundColor: '#C2BCBA' }}
                                        source={{ uri: userData.image }}
                                        resizeMode="contain" />
                                    <View style={styles.productDetail}>
                                        <Title style={styles.productName}>{userData.name}</Title>
                                        <Text style={styles.productPrice}>$ {(userData.cost * counter.data[index]).toFixed(2)}</Text>
                                        <View style={styles.counter}>
                                            <AntDesign name="minuscircleo" size={24} color="white" onPress={() => minus(index)} />
                                            <Text style={{ color: 'white', fontSize: 20 }}>{counter.data[index]}</Text>
                                            <AntDesign name="pluscircleo" size={24} color="white" onPress={() => plus(index)} />
                                        </View>
                                    </View>
                                </View>
                            )}

                            {userDataProducts.length === 0
                                ?
                                <Text style={{ color: 'grey', fontSize: 20, marginBottom: 15, textAlign: 'justify' }}>
                                    Aún no tienes productos en tu carrito, te invitamos que sigas visitando nuestra tienda</Text>
                                :
                                <View>

                                    <View style={styles.totalToPay}>
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ color: 'grey' }}> Productos </Text>
                                            <Text style={{ color: 'white' }}> {userDataProducts.length} </Text>
                                        </View>

                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ color: 'grey' }}> Total a pagar </Text>
                                            <Text style={{ color: 'white' }}> $ {calculateTotal()} </Text>
                                        </View>
                                    </View>
                                    <Button style={styles.payButton} icon="cart-off" mode="contained"
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

                        </View >
                    </ScrollView>
                </Modal>
            </Portal>
            <Button icon="cart" mode="contained"
                uppercase={false}
                style={{ backgroundColor: '#fd7753', marginBottom: 20 }}
                onPress={() => setVisible(true)}>
                Ver carrito {userDataProducts.length > 0 ? userDataProducts.length : null}
            </Button>
            <Button icon="comment-text-multiple-outline" mode="contained"
                uppercase={false}
                style={{ backgroundColor: '#fd7753', marginBottom: 20 }}
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
                                    style={{ backgroundColor: '#43464C' }} />
                            </View>
                            <View style={{ display: 'flex', justifyContent: "space-between" }}>
                                <View style={styles.infoProductCard}>
                                    <Title style={{ color: 'white', width: 120, flexWrap: 'wrap' }}>{item.name}</Title>
                                    <Title style={{ color: 'white' }}>$ {item.price}</Title>
                                </View>
                                <Card.Actions style={{ position: 'absolute', bottom: 0, right: 10 }}>
                                    <Button icon="cart-plus" mode="contained"
                                        uppercase={false}
                                        style={{ backgroundColor: '#fd7753' }}
                                        onPress={() => {
                                            userDataProducts.push({ cost: item.price, name: item.name, image: item.image, key: item.id, quantity: item.quantity })
                                            setDoc(doc(db, 'users', auth.currentUser.uid), {
                                                products: userDataProducts
                                            }, { merge: true })
                                            ToastAndroid.show(item.name + ' añadido al carrito', ToastAndroid.SHORT)
                                        }}>
                                        Añadir
                                    </Button>
                                </Card.Actions>
                            </View>
                        </Card>
                    </View>
                }
            /*  keyExtractor={item => item.key} */
            /> : <ActivityIndicator animating={true} color={'#fd7753'} />}


        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#231e1c',
        flex: 1,
        padding: 30,
        height: windowHeight,
        width: windowWidth
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        color: 'white',

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
        backgroundColor: '#231e1c',
        marginLeft: 15,
        marginRight: 15

    },
    modal: {
        backgroundColor: '#231e1c',
        flex: 1,
        padding: 20,
        height: '100%'
    },
    product: {
        backgroundColor: '#161719',
        flexDirection: 'row',
        marginBottom: 20,
        width: '100%'
    },
    productName: {
        fontSize: 24,
        color: 'white',
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
        backgroundColor: '#3159b5'
    },
    deleteButton: {
        backgroundColor: '#fd7753'
    }
})
export default Products
