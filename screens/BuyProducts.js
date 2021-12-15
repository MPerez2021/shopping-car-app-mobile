import React, { useEffect } from 'react'
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { doc, collection, onSnapshot, getFirestore, setDoc, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import { Button, TextInput, Text, Divider, Title, HelperText, Portal, Dialog } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import { DataTable } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
import { AntDesign } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BuyProducts = ({ navigation }) => {
    const [userDataProducts, setUserDataProducts] = React.useState([])
    const [campus, setCampus] = React.useState("")
    const [classroom, setClassroom] = React.useState("")
    const [sendCost, setSendCost] = React.useState(0.25)
    const [incompleteData, setIncompleteData] = React.useState(false)
    const [visible, setVisible] = React.useState(false);
    const [idBanner, setIdBnnaer] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const db = getFirestore()
    const auth = getAuth()
    useEffect(() => {
        const getUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (info) => {
            setUserDataProducts(info.data().products)
            setPhoneNumber(info.data().phoneNumber);
            setIdBnnaer(info.data().idBanner);
        })
        return () => {
            getUser()
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            setIncompleteData(false)
            setCampus('')
            setClassroom('')
        }, [])
    )

    function productSubTotal() {
        let total = 0
        userDataProducts.forEach((product) => {
            total = total + (product.cost * product.quantity)
        })
        return total.toFixed(2)
    }

    function calculateTotal() {
        let total = 0
        let productsCost = 0
        userDataProducts.forEach((product) => {
            productsCost = productsCost + (product.cost * product.quantity)
            total = productsCost + sendCost
        })
        return total.toFixed(2)
    }
    function payProducts() {
        let x = userDataProducts
        const docRef = doc(db, 'users', auth.currentUser.uid)
        const productsRef = doc(db, 'productsBought', auth.currentUser.uid)
        //Actuliza productos comprados del usuario
        if (campus === '' || classroom === '') {
            setIncompleteData(true)
        } else {
            updateDoc(docRef, {
                productsBought: arrayUnion(...[{ products: userDataProducts, totalCost: calculateTotal(), campus: campus, classroom: classroom, sendStatus: false }])
            })
            //Manda los datos a la colección y actualiza el arreglo
            addDoc(collection(db, 'productsBought'), {
                products: userDataProducts,
                totalCost: calculateTotal(),
                user: {
                    uid: auth.currentUser.uid,
                    name: auth.currentUser.displayName
                },
                classRoom: classroom,
                campus: campus,
                purchaseTime: {
                    date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                    hour: new Date().toLocaleTimeString([], { hour12: true })
                },
                idBanner: idBanner,
                phoneNumber: phoneNumber
            })
            setVisible(true)
        }

    }
    return (

        <View style={styles.container}>
            <ScrollView>
                <ScrollView horizontal={true}>
                    <DataTable>
                        <DataTable.Header>
                            <View style={{ width: 20, height: 'auto', alignItems: 'flex-start' }}>
                                <DataTable.Title>
                                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                                        #
                                    </Text>
                                </DataTable.Title>
                            </View>
                            <View style={{ width: 150, height: 'auto', alignItems: 'flex-start' }}>
                                <DataTable.Title>
                                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                                        Producto
                                    </Text>
                                </DataTable.Title>
                            </View>
                            <View style={{ width: 70, height: 'auto', alignItems: 'center' }}>
                                <DataTable.Title >
                                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                                        Cantidad
                                    </Text>
                                </DataTable.Title>
                            </View>
                            <View style={{ width: 150, height: 'auto', flexDirection: 'column', alignItems: 'center' }}>
                                <DataTable.Title>
                                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                                        Precio Unitario
                                    </Text>
                                </DataTable.Title>
                            </View>
                            <View style={{ alignItems: 'center', width: 50 }}>
                                <DataTable.Title>
                                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                                        Total
                                    </Text>
                                </DataTable.Title>
                            </View>
                        </DataTable.Header>
                        {userDataProducts.map((product, index) =>
                            <DataTable.Row>
                                <View style={{ width: 20, alignItems: 'flex-start' }}>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'black' }}>{index + 1}</Text>
                                    </DataTable.Cell>
                                </View>
                                <View style={{ width: 150 }}>
                                    <DataTable.Cell>
                                        <Text style={{ color: 'black' }}>{product.name}</Text>
                                    </DataTable.Cell>
                                </View>
                                <View style={{ width: 70, alignItems: 'center' }}>
                                    <DataTable.Cell numeric>{product.quantity}</DataTable.Cell>
                                </View>
                                <View style={{ width: 150, alignItems: 'center' }}>
                                    <DataTable.Cell numeric style={{ color: 'red' }}>
                                        <Text style={{ color: 'black' }}>${product.cost}</Text></DataTable.Cell>
                                </View>
                                <View style={{ alignItems: 'center', width: 50 }}>
                                    <DataTable.Cell numeric>
                                        <Text style={{ color: 'black' }}>${(product.cost * product.quantity).toFixed(2)}</Text></DataTable.Cell>
                                </View>
                            </DataTable.Row>
                        )}
                    </DataTable>
                </ScrollView>
                <View style={{ padding: 20 }} >
                    <Title style={{ color: 'black' }}>Datos de envío</Title>
                    <View style={{ marginTop: 10 }}>
                        {incompleteData ? <HelperText type="error">
                            *Campo obligatorio
                        </HelperText> : null}
                        <TextInput
                            mode="flat"
                            style={styles.textInput}
                            label="Campus"
                            value={campus}
                            theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                            onChangeText={text => setCampus(text)}
                        />
                        {incompleteData ? <HelperText type="error">
                            *Campo obligatorio
                        </HelperText> : null}
                        <TextInput
                            mode="flat"
                            style={styles.textInput}
                            label="Aula"
                            theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                            value={classroom}
                            onChangeText={text => setClassroom(text)}
                        />
                    </View>
                    <View style={{ justifyContent: 'flex-end', marginTop: 40 }}>
                        <View style={styles.totalAmount}>
                            <Text style={{ color: 'black' }}>Subtotal</Text>
                            <Text style={{ color: 'black' }}>${productSubTotal()}</Text>
                        </View>
                        <View style={styles.totalAmount}>
                            <Text style={{ color: 'black' }}>Costo de envío</Text>
                            <Text style={{ color: 'black' }}>${sendCost}</Text>
                        </View>
                        <Divider style={{ borderWidth: 0.1, marginBottom: 20 }} />
                        <View style={styles.totalAmount}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color:'black' }}>Total</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color:'black' }}>${calculateTotal()}</Text>
                        </View>
                        <Button mode="contained" uppercase={true} style={styles.button} onPress={payProducts}>
                            Pagar
                        </Button>
                    </View>
                </View>
                <Portal>
                    <Dialog visible={visible}>
                        <View style={styles.containerStyle}>
                            <View style={styles.dialogTitle}>
                                <AntDesign name="checkcircleo" size={24} color="white" style={{ backgroundColor: '#20a779', borderRadius: 50, marginRight: 10 }} />
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color:'black' }}>
                                    Tu compra ha sido realizada con éxito!
                                </Text>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{color:'black'}}>Gracias por tu compra, sigue visitando nuestra tienda o revisa todas tus compras </Text>
                            </View>
                        </View>
                        <Dialog.Actions>
                            <Button onPress={() => {
                                navigation.navigate('Inicio')
                                setUserDataProducts([])
                                setDoc(doc(db, 'users', auth.currentUser.uid), {
                                    products: [],
                                }, { merge: true })
                                setVisible(false)
                            }}>Aceptar</Button>
                            <Button
                                onPress={() => {
                                    navigation.navigate('Mis compras')
                                    setUserDataProducts([])
                                    setDoc(doc(db, 'users', auth.currentUser.uid), {
                                        products: [],
                                    }, { merge: true })
                                    setVisible(false)
                                }}>Mis Compras</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: windowHeight,
        width: windowWidth
    },
    textInput: {
        height: 50,
        marginBottom: 10,
        backgroundColor: 'white'
    },
    button: {
        backgroundColor: '#00acb6',
        margin: 20,
        justifyContent: 'center',
        color:'white'
    },
    totalAmount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20
    },
    containerStyle: {
        backgroundColor: 'white',
        padding: 20
    },
    dialogTitle: {
        backgroundColor: '#eaf7ee',
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',

        flexWrap: 'wrap'

    }
})
export default BuyProducts
