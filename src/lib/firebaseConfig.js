// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "poggers",
    authDomain: "link-4-students.firebaseapp.com",
    projectId: "link-4-students",
    storageBucket: "link-4-students.appspot.com",
    messagingSenderId: "711579181955",
    appId: "1:711579181955:web:pog",
    measurementId: "G-RBBTT5MKHH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
