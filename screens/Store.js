import React, { useEffect } from 'react'
import { View, Image, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Title, Text, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAuth } from "firebase/auth"
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Store = () => {
    const auth = getAuth()
    const db = getFirestore()
    const [commentText, setCommentText] = React.useState('')
    const [allCommentsData, setAllCommentsData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    useEffect(() => {
        setLoading(false)
        const getComments = query(collection(db, 'comments'), orderBy('createdAt.date', 'desc'), orderBy('createdAt.time', 'desc'))
        const unsubcribe = onSnapshot(getComments, (data) => {
            let comment = []
            data.forEach(commentData => {
                let docs = {
                    createdAt: commentData.data().createdAt,
                    user: commentData.data().user,
                    comment: commentData.data().comment,
                    commentId: commentData.id
                }
                comment.push(docs)
            })
            setAllCommentsData(comment)
            setLoading(true)
        })
        return () => {
            unsubcribe()
        }
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo}
                    source={
                        (require('../assets/logos.png'))
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
                                            name: auth.currentUser.displayName,
                                            avatar: auth.currentUser.photoURL
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
                                        <Avatar.Image size={35} source={{ uri: comment.user.avatar }} />
                                    </View>
                                    <View style={styles.userCommentText}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', marginRight: 20 }}>{comment.user.name}</Text>
                                            <Text style={styles.text}>{comment.createdAt.date}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={styles.text}>{comment.comment}</Text>
                                            {auth.currentUser.uid === comment.user.uid ?
                                                <FontAwesome5 name="trash" size={10} style={{ marginLeft: 5 }} color="#fd7753" onPress={() => {
                                                    deleteDoc(doc(db, 'comments', comment.commentId))
                                                }} />
                                                : null
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView> :
                    <View style={{marginTop:10}}>
                        {!loading ? <ActivityIndicator animating={true} color={'#fd7753'} /> : <Text style={{ color: '#717589', fontSize: 20, textAlign: 'center', marginTop: 10 }}>
                            Sé el primero en dejar un comentario
                        </Text>}

                    </View>

            }
        </View>
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
        width: 200,
        height: 200
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
