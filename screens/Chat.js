import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react'
import { View, Text } from 'react-native'
import { auth, db } from '../firebase'
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat';
import { getDocs, doc, setDoc, getDoc, collection, onSnapshot, getFirestore } from "firebase/firestore";
const Chat = ({ navigation }) => {
    const [messages, setMessages] = React.useState([]);
    const [storeId, setStoreId] = React.useState('')
    const db = getFirestore()
    /*   useLayoutEffect(() => {
          navigation.setOptions({
              headerRight: () => (
                  <View>
                      <TouchableOpacity style={{ marginRight: 30 }} onPress={signOut}>
                          <Feather name="log-out" size={24} color="black" />
                      </TouchableOpacity>
                  </View>
  
              )
          })
      }, []) */

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('createdAt', "desc").where('user._id', '==', auth?.currentUser?.uid)
            .where('store', '==', 'iKrTY16SOOe8Hwk1qWp6')
            .onSnapshot(snapshot => setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            ))

        return unsubscribe
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user
        } = messages[0]
        db.collection('chats').add({
            store: 'iKrTY16SOOe8Hwk1qWp6',
            _id,
            createdAt,
            text,
            user
        })
    }, [])

    const signOut = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.uid
            }}
        />
    )
}

export default Chat
