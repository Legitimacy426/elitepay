import { View, Text,TouchableOpacity,Image,TextInput } from 'react-native'
import React, { useState,useEffect,useRef } from 'react'
import axios from 'axios'

import Ionicons from '@expo/vector-icons/Ionicons';
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Entypo from "@expo/vector-icons/Entypo";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { useNavigation, useRoute } from '@react-navigation/native'


import firebase from "firebase/compat/app";
import { db, firebaseConfig } from './firebaseConfig';


const Transact = () => {
  // const [cards, setCards] = useState([])
    const navigate = useNavigation()
    const {card} = useRoute().params
  const [code, SetCode] = useState("");
  const [codeset, SetCodeset] = useState(false);

let [counter,setCounter] = useState(0)
 const [disable,setDisabled] = useState(false)
  

  const [bill, setSelected] = useState('')
  const [amount, setAmount] = useState('')

  const [verificationId, SetverificationId] = useState("");
  const data = [
    { key: 1, value: "Electricity" },
    { key: 2, value: "Shopping" },
    { key: 3, value: "Water Bill" },
    { key: 4, value: "Netflix" },
    { key: 5, value: "Fuel" },
    { key: 7, value: "DSTV" },
    { key: 6, value: "Other" },
    
  ]
  const recaptchaVerifier = useRef(null);
  const sendVerification = () => {
    
    if (bill == '' || amount == '') {
      alert("All fields are required")
      return
    }
    if (amount < 1) {
      alert("Enter valid amount")
      return
    }
    if (amount > card.amount) {
      alert("Insufficient Funds please top up your card")
      console.log(card.amount)
      return
    }
   
    
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        //   card.phone
        .verifyPhoneNumber(card.phone, recaptchaVerifier.current)
        .then(SetverificationId)
        .catch((error) => {
          alert("Oops", "Failed to load capture")
          SetCodeset(false);
        });
      
      SetCodeset(true);
    }
 
      
    // check email =========
   
 
  const handleSubmit = () => {
    if (counter > 1) {
      alert("Fraud activity detected please contact admin")
      setDisabled(true)
     
      return
    }
     setCounter(counter++)
     console.log(counter)
     
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
    );
    firebase.auth().signInWithCredential(credential)
        .then(() => {
          SetCode('');
          alert("processing...")
          const transRef = collection(db, 'transactions')
          const transaction = {
            cardId: card.id,
            amount: amount,
            createdAt: serverTimestamp(),
            transid: card.id,
            bill: bill,
            type:"-",
           
            
          }
          addDoc(transRef, transaction)
            .then(() => { 
                const ref = doc(db, "cards", card.id)
                const balane = card.amount-amount
              updateDoc(ref, {
                  amount:balane
              })
                .then(() => {
                  alert("Transaction processed successifully")
                  SetCodeset(false)
                  
                })
                .catch((e) => {
                alert(e.massage)
              })
            })
            .catch(() => { 
            alert("something went wrong")
            })
          
        })
        .catch((error) => {
          alert(error.message)
          return
        }) 
   
      // withdrawww=====
 
  }
 
  const navigation = useNavigation()

  return (
    <View style={{flex:1,padding:20,backgroundColor:"white"}}>
     <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:5, }}>
      
        {/* <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
           <Ionicons name='menu' size={25} color={"black"} />
        </TouchableOpacity> */}
      </View>
      <View >
      <Image
        source={require("../assets/transact.png")}
          style={{ marginTop: 10, height: 200, width: 400, alignSelf: "center" }}
          resizeMode={"contain"}
        />
          <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      
        <View style={{ marginTop: 0, padding: 50 }}>
         <Text style={{marginBottom:10,fontSize:20,fontWeight:"bold"}}>Pay Bills</Text>
 
        
          
      
        

          {!codeset && (<>
            <View style={{marginBottom:10}}>
    <SelectList 
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#0000001e",
          padding: 2,
              borderRadius: 0,
         
        }}
        setSelected={(val) => setSelected(val)} 
        data={data} 
        save="value"
    />   
    </View>

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
              <Text style={{ marginRight: 3, marginLeft: 10 }}>KES </Text>
              <TextInput
                style={{ padding: 7, fontSize: 16, width: 185 }}
                placeholder="Amount "
               onChangeText={setAmount}
                keyboardType="number-pad"
              />
            </View>
          
            <TouchableOpacity
              disabled={disable}
               style={{
                alignSelf: "center",
                borderRadius: 5,
                backgroundColor: "#1F54D3",
                padding: 15,
                width: 270,
                marginTop: 30,
                alignItems: "center",
                color: "white",
              }}
           onPress={()=>{sendVerification()}}
       
            >
          
              <Text style={{ color: "white" }}>Request OTP</Text>
            
          </TouchableOpacity>
          </>)}
          {codeset && (
            <>
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
              placeholder={`code sent to ${card.phone}`}
             onChangeText={SetCode}
            />
          </View>
          <TouchableOpacity
                onPress={handleSubmit}
                disabled={disable}
            style={{
              alignSelf: "center",
              borderRadius: 5,
              backgroundColor: "#1F54D3",
              padding: 15,
              width: 270,
              marginTop: 30,
              alignItems: "center",
              color: "white",
            }}
          >
                <Text style={{ color: "white" }}>{ disable ? "Disabled" : "Transact"}</Text>
          </TouchableOpacity>
          </> )}
              
      </View>
    </View>
      
    </View>
  )
}

export default Transact