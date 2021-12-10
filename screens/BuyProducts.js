import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { doc, collection, onSnapshot, getFirestore, setDoc, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import { Button, TextInput } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import { DataTable } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BuyProducts = ({ navigation }) => {
    const [userDataProducts, setUserDataProducts] = React.useState([])
    const [campus, setCampus] = React.useState("")
    const [classroom, setClassroom] = React.useState("")
    const [subTotal, setSubTotal] = React.useState("")
    const [sendCost, setSendCost] = React.useState(0.25)
    const db = getFirestore()
    const auth = getAuth()
    useEffect(() => {
        const getUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (info) => {
            setUserDataProducts(info.data().products)
        })
        return () => {
            getUser()
        }
    }, [])


    function productSubTotal() {
        let total = 0
        userDataProducts.forEach((product, index) => {
            total = total + (product.cost * product.quantity)
        })
        return total.toFixed(2)
    }

    function calculateTotal() {
        let total = 0
        let productsCost = 0
        userDataProducts.forEach((product, index) => {
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
        updateDoc(docRef, {
            productsBought: arrayUnion(...[{ products: userDataProducts, totalCost: calculateTotal(), campus: campus, classroom: classroom, sendStatus: false }])
        })
        setUserDataProducts([])
        setDoc(doc(db, 'users', auth.currentUser.uid), {
            products: [],
        }, { merge: true })
        //Manda los datos a la colección y actualiza el arreglo
        addDoc(collection(db, 'productsBought'), {
            products: userDataProducts,
            totalCost: calculateTotal(),
            user: auth.currentUser.uid
        })
        /*    setDoc(doc(db, 'productsBought', auth.currentUser.uid), {
               productsBought: userDataProducts
           }, { merge: true }) */
        navigation.navigate('Inicio')
    }
    return (
        <View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>#</DataTable.Title>
                    <DataTable.Title>Producto</DataTable.Title>
                    <DataTable.Title numeric>Cantidad</DataTable.Title>
                    <DataTable.Title numeric>Costo Unitario</DataTable.Title>
                    <DataTable.Title numeric>Costo</DataTable.Title>
                </DataTable.Header>

                {userDataProducts.map((product, index) =>
                    <DataTable.Row>
                        <DataTable.Title>{index + 1}</DataTable.Title>
                        <DataTable.Cell>{product.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{product.quantity}</DataTable.Cell>
                        <DataTable.Cell numeric>{product.cost}</DataTable.Cell>
                        <DataTable.Cell numeric>{(product.cost * product.quantity).toFixed(2)}</DataTable.Cell>
                    </DataTable.Row>
                )}

            </DataTable>
            <View >
                <TextInput
                    mode="flat"
                    label="Campus"
                    value={campus}
                    onChangeText={text => setCampus(text)}
                />
                <TextInput
                    mode="flat"
                    label="Aula"
                    value={classroom}
                    onChangeText={text => setClassroom(text)}
                />
                <Text style={styles.text}>Subtotal: {productSubTotal()}</Text>
                <Text>Costo de envío: {sendCost}</Text>
                <Text>Total a pagar: {calculateTotal()}</Text>
                <Button mode="contained" uppercase={true} style={styles.button} onPress={payProducts}>
                    Pagar
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        height: windowHeight,
        width: windowWidth
    },
    text: {
        color: 'black'
    },
    button: {
        width: 300,
        marginTop: 20,
        backgroundColor: '#fd7753',
        marginBottom: 20
    },
})
export default BuyProducts
