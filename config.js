// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAbeCdpwHJ-IEurbUN1wEBGRlXkIWCsOKI",
    authDomain: "triplebrothersshop-b0ad6.firebaseapp.com",
    projectId: "triplebrothersshop-b0ad6",
    storageBucket: "triplebrothersshop-b0ad6.appspot.com",
    messagingSenderId: "1073852825422",
    appId: "1:1073852825422:web:3bb7f1de3e59a10b9a681f",
    measurementId: "G-6XC7F63KJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
