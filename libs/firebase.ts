// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4FwBD6RuCKhZpX0p_Nr8WS1njTyyOTNg",
  authDomain: "e-shop-4865d.firebaseapp.com",
  projectId: "e-shop-4865d",
  storageBucket: "e-shop-4865d.appspot.com",
  messagingSenderId: "1083921026500",
  appId: "1:1083921026500:web:44f31223e97da957f46891"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
export default firebaseapp;