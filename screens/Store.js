import React, { useEffect } from 'react'
import { View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { TextInput, Title, Text } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, query, getDocs, addDoc, collection, orderBy } from "firebase/firestore";
import firebase from 'firebase/compat'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const auth = getAuth()
const db = getFirestore()
const Store = () => {
    const [commentText, setCommentText] = React.useState('')
    const [allCommentsData, setAllCommentsData] = React.useState([])
    useEffect(() => {
        getUsersComments()
        return () => {
            getUsersComments()
        }
    }, [])
    //const documents = query(collection(db, 'comments'), orderBy('createdAt', "desc"));
    //const getAllDocuments = getDocs(documents);    


    async function getUsersComments() {
        const commentDocs = firebase.firestore().
            collection('comments').orderBy('createdAt.time', 'desc').
            onSnapshot(data => setAllCommentsData(
                data.docs.map(commentData => ({
                    createdAt: (commentData.data().createdAt),
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
        <View>
            <Image style={styles.logo}
                source={
                    (require('../assets/logo.jpeg'))
                } />
            <Title>Proyect Papelería</Title>
            <Text>Gracias por visitarnos</Text>
            <TextInput
                label="Dejanos tu comentario"
                value={commentText}
                onChangeText={text => setCommentText(text)}
                right={
                    <TextInput.Icon name="pencil"
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
            <ScrollView>
                {allCommentsData.map((comment) =>
                    <View>
                        <FontAwesome5 name="user-circle" size={24} color="black" />
                        <Text>Fecha: {comment.createdAt.date}</Text>
                        <Text>Nombre de usuario {comment.name}</Text>
                        <Text>Comentario {comment.comment}</Text>
                    </View>
                )}

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#231e1c',
        height: windowHeight
    },
    logo: {
        width: 125,
        height: 125,
        backgroundColor: 'red'
    },

});
export default Store
