import React, { useEffect } from 'react'
import { View, StyleSheet, Dimensions, FlatList, Image, ScrollView, ToastAndroid } from 'react-native'
import { getDocs, doc, collection, onSnapshot, getFirestore, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { Button, Card, Subheading, Title, Modal, Portal, TextInput, Text } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AntDesign } from '@expo/vector-icons';
const MyProducts = () => {
    const [userDataProductsBought, setUserDataProductsBought] = React.useState([])
    const [newArray, setNewArray] = React.useState([])
    const db = getFirestore()
    const auth = getAuth()
    useEffect(() => {
        const getUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (info) => {
            setUserDataProductsBought(info.data().productsBought)
        })

        return () => {
            getUser()
        }
    }, [])

    function s() {
        const x = userDataProductsBought.map(elements => elements.products.map(products => products))
        let h = []
        x.forEach((elem, index) => {
            h[index] = elem
        })
        //  console.log(h[1][0].cost);
        for (let i = 0; i < h.length; i++) {           
            for (let j = 0; j < h[i].length; j++) {
                let x = []
                x = (h[i][j].name)
            }
        }
        console.log(x[1][2].cost);
        /*   console.log(h);
          setNewArray(h)
          console.log(newArray); */
    }
    return (
        <View style={{ backgroundColor: 'red' }}>
            {newArray.map((data, index) =>
                <View style={{ backgroundColor: 'yellow', margin: 10 }}>
                    <Text>
                        {data[index][index].name}
                    </Text>
                </View>
            )}
            {/*  <FlatList
                data={newArray}
                renderItem={({ item, index }) =>
                    <View style={{ backgroundColor: 'yellow' }}>
                        <Text>
                            {item[index].name}
                        </Text>                  
                    </View>
                }
            /> */}


            <Button onPress={s}>hola</Button>
        </View>
    )
}

export default MyProducts
