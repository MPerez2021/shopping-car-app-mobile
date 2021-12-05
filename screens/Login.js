import React from 'react'
import { View, StyleSheet, Text, Dimensions, KeyboardAvoidingView } from 'react-native'
import { Button, HelperText, TextInput, Subheading, Title } from 'react-native-paper';
import { getFirestore } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = ({ navigation }) => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [verifyUser, setVerifyUser] = React.useState(false)
    const [verifyEmailAndPassword, setVerifyEmailAndPassword] = React.useState(false)

    const auth = getAuth()
    const db = getFirestore()
    function signIn() {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            navigation.navigate('Inicio')
        }).catch(error => {
            //alert(error.message)
            if (error.code === 'auth/user-not-found') {
                setVerifyUser(true)
            }
            if (error.code === 'auth/wrong-password' || error.code === 'auth/internal-error' || error.code === 'auth/invalid-email') {
                setVerifyEmailAndPassword(true)
            }
        })
    }  
    useFocusEffect(
        React.useCallback(() => {
            setEmail('')
            setPassword('')
            setVerifyUser(false)
            setVerifyEmailAndPassword(false)
        }, [])
    )
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="shield-account" size={150} color="#fd7753" />
            <View>
                <Title style={styles.title}>Bienvenido</Title>
                <Subheading style={{ marginBottom: 20, color: 'white' }}>Inicia sesión para continuar</Subheading>
            </View>
            {verifyUser ? <HelperText type="error" style={styles.helperTextInputs}>
                Usuario no encontrado, por favor verifica tus datos
            </HelperText> : null}
            {verifyEmailAndPassword ? <HelperText type="error" style={styles.helperTextInputs}>
                Email o contraseña incorrectos, por favor intenta de nuevo
            </HelperText> : null}
            <KeyboardAvoidingView style={{ padding: 10 }} behavior="padding">
                <TextInput style={styles.textInput}
                    mode="flat"
                    placeholder="Ingresa tu email"
                    label="Correo electrónico"
                    value={email}
                    theme={{ colors: { primary: 'white', placeholder: 'white', text: 'white', accent: 'white' } }}
                    onChangeText={text => setEmail(text)}
                    left={<TextInput.Icon name="email" color={'white'} />} />
                <TextInput style={styles.textInput}
                    mode="flat"
                    placeholder="Ingresa tu contraseña"
                    label="Contraseña"
                    theme={{ colors: { primary: 'white', placeholder: 'white', text: 'white', accent: 'white' } }}
                    secureTextEntry
                    value={password}
                    left={<TextInput.Icon name="lock" color={'white'} />}
                    onChangeText={text => setPassword(text)}
                />
            </KeyboardAvoidingView>
            <Button mode="contained" uppercase={true} style={styles.button} onPress={signIn}>
                Iniciar Sesión
            </Button>
            <HelperText type="info" visible={true} style={{ color: 'white' }}>
                No tienes una cuenta? <Text style={{ color: '#fd7753' }}
                    onPress={() => navigation.navigate('Register', { screen: 'Register' })}>Registrate aquí</Text>
            </HelperText>
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
        width: windowWidth
    },
    button: {
        width: 300,
        marginTop: 20,
        backgroundColor: '#fd7753',
        marginBottom: 20
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        color: 'white'
    },
    textInput: {
        width: 300,
        height: 60,
        marginBottom: 10,
        backgroundColor: '#2e2a29'
    },
    helperTextInputs: {
        marginBottom: 10,
        color: 'red'
    }
})
export default Login
