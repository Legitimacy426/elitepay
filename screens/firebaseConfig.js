// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";

import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCTtLGVKsgg6ufDutjRe-7bS4EZ7PsS0QQ",
  authDomain: "elitepay-59e03.firebaseapp.com",
  projectId: "elitepay-59e03",
  storageBucket: "elitepay-59e03.appspot.com",
  messagingSenderId: "896416512424",
  appId: "1:896416512424:web:1cd0256731402bcfbec59d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const db = getFirestore();
export const auth = getAuth();
