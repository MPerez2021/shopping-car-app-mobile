import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { View, Text, StyleSheet, Toa, ToastAndroid, Dimensions } from 'react-native'
import { Button, HelperText, TextInput, Subheading, Title } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAuth, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDoc, doc, setDoc, getFirestore, addDoc, collection } from "firebase/firestore";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Register = ({ navigation }) => {
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')


    const db = getFirestore()
    useFocusEffect(
        React.useCallback(() => {
            setName('')
            setEmail('')
            setPassword('')
        }, [])
    )
    const register = () => {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
            var user = userCredentials.user



            setDoc(doc(db, 'users', user.uid), {
                name: name,
                role: 'client',
                products: []
            });         
            /*   db.collection('users').doc(user.uid).set({
                  name: name,
                  role: 'client',
                  products: []
              }) */
            updateProfile(auth.currentUser, {
                displayName: name
            }).catch((error) => {
                alert(error.message)
            })
            /* navigation.navigate('Inicio')
            ToastAndroid.show('Usuario registrado, bienvenido a Proyect Papelery', ToastAndroid.LONG) */
        }).catch(error => {
            alert(error.message)
        })
    }
    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 40 }}>
                <FontAwesome5 name="user-friends" size={150} color="#fd7753" />
            </View>
            <TextInput style={styles.textInput}
                mode="flat"
                placeholder="Ingresa tu nombre"
                label="Nombre"
                left={<TextInput.Icon name="account" color={'white'} />}
                theme={{ colors: { primary: 'white', placeholder: 'white', text: 'white', accent: 'white' } }}
                value={name}
                onChangeText={text => setName(text)} />
            <TextInput style={styles.textInput}
                placeholder="Ingresa tu email"
                label="Correo electrónico"
                theme={{ colors: { primary: 'white', placeholder: 'white', text: 'white', accent: 'white' } }}
                left={<TextInput.Icon name="email" color={'white'} />}
                value={email}
                onChangeText={text => setEmail(text)} />

            <TextInput style={styles.textInput}
                placeholder="Ingresa tu contraseña"
                label="Contraseña"
                left={<TextInput.Icon name="lock" color={'white'} />}
                theme={{ colors: { primary: 'white', placeholder: 'white', text: 'white', accent: 'white' } }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry />
            <Button mode="contained" onPress={register} style={styles.button}>
                Registrarse
            </Button>
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
    button: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#fd7753',
        marginBottom: 20
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        padding: 15,
        color: 'white'
    },
    textInput: {
        width: '100%',
        height: 60,
        marginBottom: 10,
        backgroundColor: '#2e2a29'

    }
})

export default Register
