//import * as firebase from 'firebase/compat'
import firebase from "firebase/compat"
var firebaseConfig = {
    apiKey: "AIzaSyDaQbiZPLV1Iritn3dRSgCWWGOzcaW-zSo",
    authDomain: "shopping-car-mobile-app.firebaseapp.com",
    projectId: "shopping-car-mobile-app",
    storageBucket: "shopping-car-mobile-app.appspot.com",
    messagingSenderId: "130218438588",
    appId: "1:130218438588:web:500ca18b400585302e85b9"
};
export default firebase.initializeApp(firebaseConfig);
// Initialize Firebase
//const app = initializeApp(firebaseConfig);
/* let app;
 if(firebase.default.apps.length === 0){
    app= firebase.default.initializeApp(firebaseConfig)
}else{
    app = firebase.default.app()
}
const db = app.firestore()
const auth = firebase.default.auth()
export {db, auth} */