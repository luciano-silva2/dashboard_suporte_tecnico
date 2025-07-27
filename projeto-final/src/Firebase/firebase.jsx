import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyAeM6ZIkLhxt8CRJs_W4eg9cdjhhIXzZvE",

  authDomain: "pwii-93813.firebaseapp.com",

  projectId: "pwii-93813",

  storageBucket: "pwii-93813.firebasestorage.app",

  messagingSenderId: "848791378633",

  appId: "1:848791378633:web:669f92367e40a674e0cb18"

};

const app = initializeApp(firebaseConfig);



const auth =  getAuth(app);
const firestore = getFirestore(app);



export { auth, firestore }; 
export const db = firestore;