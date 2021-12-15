import React from 'react'
import { View, StyleSheet, ToastAndroid, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Button, HelperText, TextInput, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, getFirestore, doc } from "firebase/firestore";
import { Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Register = ({ navigation }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [incompleteData, setIncompleteData] = React.useState(false);
    const [emailAlreadyExists, setEmailAlreadyExists] = React.useState(false);
    const [weakPassword, setWeakPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [userAvatar, setUserAvatar] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [idBanner, setIdBanner] = React.useState("")
    const [noPhoto, setNoPhoto] = React.useState(false)
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (pickerResult.cancelled) {
            setUserAvatar("")
        } else {
            setUserAvatar(pickerResult.uri);
        }
        console.log(pickerResult);
    }
    useFocusEffect(
        React.useCallback(() => {
            setName('')
            setEmail('')
            setPassword('')
            setIncompleteData(false)
            setEmailAlreadyExists(false)
            setWeakPassword(false)
            setLoading(false)
            setPhoneNumber("")
            setIdBanner("")
        }, [])
    )

    const register = () => {
        setLoading(true)
        const auth = getAuth()
        const db = getFirestore()
        console.log(userAvatar);
        if (userAvatar === "") {
            setIncompleteData(true)
            setEmailAlreadyExists(false)
            setWeakPassword(false)
            setLoading(false)
        } else {
            createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
                var user = userCredentials.user
                setDoc(doc(db, 'users', user.uid), {
                    name: name,
                    role: 'client',
                    products: [],
                    productsBought: [],
                    avatar: userAvatar,
                    phoneNumber: phoneNumber,
                    idBanner: idBanner
                });
                updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: userAvatar
                }).catch((error) => {

                })
                navigation.navigate('Inicio');
                ToastAndroid.show('Usuario registrado, bienvenido a Proyect Papelery', ToastAndroid.LONG)
                setLoading(false)
            }).catch(error => {
                switch (error.code) {
                    case 'auth/invalid-email':
                        setIncompleteData(true)
                        setEmailAlreadyExists(false)
                        setWeakPassword(false)
                        setLoading(false)
                        break;
                    case 'auth/internal-error':
                        setIncompleteData(true)
                        setEmailAlreadyExists(false)
                        setWeakPassword(false)
                        setLoading(false)
                        break;
                    case 'auth/missing-email':
                        setIncompleteData(true)
                        setEmailAlreadyExists(false)
                        setWeakPassword(false)
                        setLoading(false)
                        break;
                    case 'auth/email-already-in-use':
                        setEmailAlreadyExists(true)
                        setIncompleteData(false)
                        setWeakPassword(false)
                        setLoading(false)
                        break;
                    case 'auth/weak-password':
                        setWeakPassword(true)
                        setIncompleteData(false)
                        setEmailAlreadyExists(false)
                        setLoading(false)
                    default:
                        break;
                }
            })
        }

    }

    return (
        <ScrollView>
            <View style={styles.container}>

                <View style={{ marginBottom: 40 }}>
                    <FontAwesome5 name="user-friends" size={150} color="#002d66" />
                </View>

                {incompleteData ?
                    <HelperText type='error' style={{ marginBottom: 10, color: 'red' }}>
                        Datos incompletos o incorrectos, por favor verifica tus datos para continuar
                    </HelperText> : null}
                {emailAlreadyExists ?
                    <HelperText type='error' style={{ marginBottom: 10, color: 'red' }}>
                        EL email que ingresaste ya existe, por favor intenta con otro correo
                    </HelperText> : null}
                {weakPassword ?
                    <HelperText type='error' style={{ marginBottom: 10, color: 'red' }}>
                        La contraseña debe tener al menos 6 caracteres
                    </HelperText> : null}
                <KeyboardAvoidingView style={{ padding: 10 }} behavior="padding">
                    <TextInput style={styles.textInput}
                        mode="flat"
                        placeholder="Ingresa tu nombre"
                        label="Nombre y Apellido"
                        left={<TextInput.Icon name="account" color={'#065a7f'} />}
                        theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                        value={name}
                        onChangeText={text => setName(text)} />
                    <TextInput style={styles.textInput}
                        placeholder="Ingresa tu email"
                        label="Correo electrónico"
                        theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                        left={<TextInput.Icon name="email" color={'#065a7f'} />}
                        value={email}
                        onChangeText={text => setEmail(text)} />
                    <TextInput style={styles.textInput}
                        placeholder="Ingresa tu contraseña"
                        label="Contraseña"
                        left={<TextInput.Icon name="lock" color={'#065a7f'} />}
                        theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry />
                    <TextInput style={styles.textInput}
                        placeholder="Ingresa tu número de teléfono"
                        label="Teléfono"
                        left={<TextInput.Icon name="cellphone" color={'#065a7f'} />}
                        theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                        value={phoneNumber}
                        onChangeText={text => setPhoneNumber(text)}
                    />
                    <TextInput style={styles.textInput}
                        placeholder="BANNER"
                        label="BANNER"
                        left={<TextInput.Icon name="pencil-outline" color={'#065a7f'} />}
                        theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                        value={idBanner}
                        onChangeText={text => setIdBanner(text)}
                    />  
                </KeyboardAvoidingView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 300 }}>
                    <Button mode="contained" uppercase={false} onPress={openImagePickerAsync} style={{
                        width: 'auto',
                        backgroundColor: '#065a7f'
                    }}>
                        Elegir foto de perfil
                    </Button>
                    {userAvatar ? <View style={{
                        width: 50
                    }}>
                        <Avatar.Image size={40} source={{ uri: userAvatar }} />
                    </View> : null}
                </View>
                {loading ? <ActivityIndicator animating={true} color={'#065a7f'}></ActivityIndicator> :
                    <Button mode="contained" onPress={register} style={styles.button}>
                        Registrarse
                    </Button>
                }
            </View >
        </ScrollView>
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
    button: {
        width: 300,
        marginTop: 20,
        backgroundColor: '#002d66',
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
        width: 300,
        height: 60,
        marginBottom: 10
    }
})

export default Register
