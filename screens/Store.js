import React, { useEffect } from 'react'
import { View, Image, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Title, Text, TextInput } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAuth } from "firebase/auth"
import { getFirestore, addDoc, collection } from "firebase/firestore";
import firebase from 'firebase/compat'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const auth = getAuth()
const db = getFirestore()
const Store = () => {
    const [commentText, setCommentText] = React.useState('')
    const [allCommentsData, setAllCommentsData] = React.useState([])
    const windowHeight = Dimensions.get('window').height
    const windowWidth = Dimensions.get('window').width
    useEffect(() => {
        getUsersComments()
        return () => {
            getUsersComments()
        }
    }, [])

    async function getUsersComments() {
        const commentDocs = firebase.firestore().
            collection('comments').orderBy('createdAt.date', 'desc').orderBy('createdAt.time', 'desc').
            onSnapshot(data => setAllCommentsData(
                data.docs.map(commentData => ({
                    createdAt: commentData.data().createdAt,
                    name: commentData.data().user.name,
                    comment: commentData.data().comment
                }))
            ))
        // let commentsList = []
        /* const commentDocs = await getDocs(collection(db, 'comments'), orderBy('createdAt','asc')) */
        /*  commentDocs.forEach(commentData => {
             let docs = {
                 date: commentData.data().createdAt.toDate(),
                 name: commentData.data().user.name,
                 comment: commentData.data().comment
             }
             console.log(docs);
             commentsList.push(docs)
         })
         setAllCommentsData(commentsList) */
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo}
                    source={
                        (require('../assets/logo.jpeg'))
                    } />
                <Title style={{ color: 'white', fontSize: 30, marginTop: 10 }}>Proyect Papelería</Title>
            </View>
            <Text style={{ color: 'white', margin: 15, textAlign: 'center' }}>Que te pareció nuestra tienda?, danos tu opinión</Text>
            <View style={{ justifyContent: 'center', backgroundColor: '#252836', marginLeft: 10, marginRight: 10, borderRadius: 20, paddingBottom: 5 }}>
                <KeyboardAvoidingView behavior="padding">
                    <TextInput style={styles.textInput}
                        label="Escibe tu comentario"
                        value={commentText}
                        onChangeText={text => setCommentText(text)}
                        multiline={true}
                        dense={true}
                        selectionColor='#fd7753'
                        underlineColor='transparent'
                        theme={{ colors: { primary: 'grey', placeholder: 'grey', text: 'white' } }}
                        right={
                            <TextInput.Icon name="send-outline"
                                style={{ alignItems: 'center' }}
                                color='white'
                                onPress={async () => {
                                    addDoc(collection(db, 'comments'), {
                                        comment: commentText,
                                        createdAt: {
                                            date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                                            time: new Date().toLocaleTimeString([], { hour12: true })
                                        },
                                        user: {
                                            uid: auth.currentUser.uid,
                                            name: auth.currentUser.displayName
                                        }
                                    })
                                    setCommentText('')
                                }} />}
                    />
                </KeyboardAvoidingView>
            </View>
            {
                allCommentsData.length > 0 ?
                    <ScrollView>
                        {allCommentsData.map((comment) =>
                            <View style={{ backgroundColor: '#231e1c' }}>
                                <View style={styles.commentCard}>
                                    <View style={styles.userPhoto}>
                                        <FontAwesome5 name="user-circle" size={26} color="white" />
                                    </View>
                                    <View style={styles.userCommentText}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', marginRight: 20 }}>{comment.name}</Text>
                                            <Text style={styles.text}>{comment.createdAt.date}</Text>
                                        </View>
                                        <Text style={styles.text}>{comment.comment}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView> :
                    <Text style={{ color: '#717589', fontSize: 20, textAlign: 'center', marginTop: 10 }}>
                        Sé el primero en dejar un comentario
                    </Text>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#231e1c',
        height: windowHeight,
        width: windowWidth
    },
    logo: {
        width: 125,
        height: 125
    },
    header: {
        alignItems: 'center',
        marginTop: 20

    },
    textInput: {
        width: 350,
        marginLeft: 10,
        backgroundColor: 'transparent'
    },
    commentCard: {
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row'
    },
    userPhoto: {
        height: 28,
        marginRight: 7

    },
    userCommentText: {
        flexDirection: 'column',
        padding: 10,
        marginRight: 50,
        backgroundColor: '#252836',
        borderTopLeftRadius: 0,
        borderTopEndRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomEndRadius: 20
    },
    text: {
        color: '#717589',
    }

});
export default Store
