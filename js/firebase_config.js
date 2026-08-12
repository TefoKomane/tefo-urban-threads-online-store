const firebaseConfig = {
    apiKey: "AIzaSyBSwCf116p2TXXquDuxTD3MgBXE9f16kns",
    authDomain: "tefo-urbanthreadstore.firebaseapp.com",
    projectId: "tefo-urbanthreadstore",
    storageBucket:  "tefo-urbanthreadstore.firebasestorage.app",
    messagingSenderId: "21299371573",
    appId: "1:21299371573:web:d8d5c0b55d972851029b7c",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();