import React from 'react'
import { View, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Image } from 'react-native'
import { Button, HelperText, TextInput, Subheading, Title, ActivityIndicator } from 'react-native-paper';
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
    const [loading, setLoading] = React.useState(false)
    function signIn() {
        setLoading(true)
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password).then(() => {
            navigation.navigate('Inicio')
            setLoading(false)
        }).catch(error => {
            if (error.code === 'auth/user-not-found') {
                setVerifyUser(true)
                setLoading(false)
            }
            if (error.code === 'auth/wrong-password' || error.code === 'auth/internal-error' || error.code === 'auth/invalid-email') {
                setVerifyEmailAndPassword(true)
                setLoading(false)
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
            {/* <MaterialCommunityIcons name="shield-account" size={150} color="#002d66" /> */}
            <Image style={styles.logo}
                source={
                    (require('../assets/logos.png'))
                } />
            <View>
                <Title style={styles.title}>Bienvenido</Title>
                <Subheading style={{ marginBottom: 20 }}>Inicia sesión para continuar</Subheading>
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
                    theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                    onChangeText={text => setEmail(text)}
                    left={<TextInput.Icon name="email" color={'#065a7f'} />} />
                <TextInput style={styles.textInput}
                    mode="flat"
                    placeholder="Ingresa tu contraseña"
                    label="Contraseña"
                    theme={{ colors: { primary: '#065a7f', placeholder: 'grey', text: 'black' } }}
                    secureTextEntry
                    value={password}
                    left={<TextInput.Icon name="lock" color={'#065a7f'} />}
                    onChangeText={text => setPassword(text)}
                />
            </KeyboardAvoidingView>
            {loading ? <ActivityIndicator animating={true} color={'#065a7f'}></ActivityIndicator> :
                <Button mode="contained" uppercase={true} style={styles.button} onPress={signIn}>
                    Iniciar Sesión
                </Button>
            }
            <HelperText type="info" visible={true} style={{ color: 'black' }}>
                No tienes una cuenta? <Text style={{ color: '#002d66', fontWeight: 'bold' }}
                    onPress={() => navigation.navigate('Registro')}>Registrate aquí</Text>
            </HelperText>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
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
        backgroundColor: '#002d66',
        marginBottom: 20
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        color: 'black'
    },
    textInput: {
        width: 300,
        height: 60,
        marginBottom: 10
    },
    helperTextInputs: {
        marginBottom: 10,
        color: 'red'
    },
    logo: {
        width: 200,
        height: 200,
        backgroundColor:'#065a7f',
        borderRadius: 20
    }
})
export default Login
