import { View, Text, Image, TextInput, TouchableOpacity,Alert, Button } from "react-native";
import React, { useRef, useState,useEffect } from "react";

import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth, db,firebaseConfig } from "./firebaseConfig";
import firebase from "firebase/compat/app";
import { collection, getDocs,query,where } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword,signOut } from "firebase/auth"

const Login = () => {
 
  const navigation = useNavigation();

  const [phone,setPhone] = useState("")
  const [code, SetCode] = useState("");
  const [client,setClient] = useState([])
  const [codeset, SetCodeset] = useState(false);

  const[isLoading,SetLoading] = useState(false)
 
  const [verificationId, SetverificationId] = useState("");
 
  

 
  
  const recaptchaVerifier = useRef(null);
  
  const sendVerification = () => {
   
    SetLoading(true)
    if (phone == '' || phone.length != 12) {
      alert('Enter a valid phone number')
      SetLoading(false)
      return
    } else {
      SetLoading(true)
      const userRef = collection(db, 'users')
      const queryRef  = query(userRef,where('phone',"==",`+${phone}`))
      getDocs(queryRef).then((users) => {
       
     
        if (users.docs.length == 0) {

          alert(`${phone} is not registered please create an account`)
          console.log(`${phone} is not registered please create an account`)
          navigation.navigate("Registration")
        } else {
          // send code
          SetLoading(true)
          const phoneProvider = new firebase.auth.PhoneAuthProvider();
          phoneProvider
            .verifyPhoneNumber(`+${phone}`, recaptchaVerifier.current)
            .then(SetverificationId)
            .catch((error) => {
              Alert.alert("Oops", "Failed to load capture")
              SetCodeset(false);
              SetLoading(false)
            });
          
          SetCodeset(true);
        }
      }).catch((e) => {
        alert(e.message)
        SetLoading(false)
      })
    }
    
 
   
  }

;

  const confirmCode = () => {
    SetLoading(true)
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        SetCode("");
          SetLoading(false)
        // Alert.alert("Success!", "Logging in please wait...");

        navigation.navigate('Cards', { phone: phone })
       
      })
      .catch((error) => {
        Alert.alert("Oops!", "The code is incorrect or has expired");
        SetLoading(false)
      });
    
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Image
        source={require("../assets/login.png")}
        style={{ marginTop: 30, height: 200, width: 400, alignSelf: "center" }}
      />
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View style={{ marginTop: 0, padding: 50 }}>
        
              {!codeset && (<>
                <Text style={{ color: "#0000009a", fontSize: 30, marginBottom: 25,fontWeight:"bold" }}>
         Pay Seamlessly With ePay
        </Text>
                <Text style={{ color: "#0000009a", fontSize: 15, marginBottom: 15 }}>
          Enter Phone Number
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#0000001e",
            padding: 2,
            borderRadius: 0,
          }}
        >
          <Entypo
            name="mail"
            size={20}
            color="#0000007d"
            style={{ marginRight: 3, marginLeft: 10 }}
          />
          <TextInput
            style={{ padding: 7, fontSize: 16, flex:1 }}
              placeholder="254712367487"
              value={phone}
              onChangeText={(text) => { setPhone(text) }}
              keyboardType="phone-pad"
            
          />
          <TouchableOpacity
           onPress={()=>{sendVerification()}}
            style={{
              backgroundColor: "#1f55d3af",
              padding: 15,
              borderRadius: 0,
            }}
            >
          
              <Text style={{ color: "white" }}>  {isLoading ? "Processing..." : "  Request OTP"}</Text>
            
            </TouchableOpacity>
         
        </View>
              </>)}
        {codeset && (
                  <>
                      <Text style={{ color: "#0000009a", fontSize: 30, marginBottom: 25 }}>
        {isLoading ? "Processing..." : "  Verify OTP"}
        </Text>
            <Text
              style={{ color: "#0000009a", fontSize: 15, marginBottom: 15 }}
            >
              Enter code sent to {phone}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#0000001e",
                padding: 2,
                borderRadius: 0,
              }}
            >
              <Entypo
                name="lock"
                size={20}
                color="#0000007d"
                style={{ marginRight: 3, marginLeft: 10 }}
              />
              <TextInput
                style={{ padding: 7, fontSize: 16, flex:1 }}
                placeholder="eg 985676"
                onChangeText={SetCode}
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
               SetCodeset(false)
              }}
            >
              <Text
                style={{
                  color: "#0000009a",
                  fontWeight: "bold",
                  marginTop: 0,
                  // alignSelf: "center",
                }}
              >
                Din't recieve code ?
                <Text style={{ color: "#1F54D3" }}> Retry</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmCode}
              style={{
                alignSelf: "center",
                borderRadius: 5,
                backgroundColor: "#1F54D3",
                padding: 15,
                width: 300,
                marginTop: 30,
                alignItems: "center",
                color: "white",
              }}
            >
              <Text style={{ color: "white" }}>Verify</Text>
            </TouchableOpacity>
           
          </>
              )}
               <TouchableOpacity
              onPress={() => {
                navigation.navigate("Registration");
              }}
            >
              <Text
                style={{
                  color: "#0000009a",
                  fontWeight: "bold",
                  marginTop: 20,
                  alignSelf: "center",
                }}
              >
                Not a member ?
                <Text style={{ color: "#1F54D3" }}> Create Account</Text>
              </Text>
            </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
