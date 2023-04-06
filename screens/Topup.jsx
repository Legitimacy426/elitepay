import { View, Text,TouchableOpacity,Image,TextInput } from 'react-native'
import React, { useState ,useEffect} from 'react'
import axios from 'axios';
// import Flutterwave from "flutterwave-node-v3";
// const flw = new Flutterwave(
//   "FLWPUBK-5cba71173e0e4ce61c33c4a4f5926ee2-X",
//   "FLWSECK-107a1795472bc0eb0e69e1599ab543d6-X"
// );
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Entypo from "@expo/vector-icons/Entypo";

import { addDoc,collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useNavigation, useRoute } from '@react-navigation/native'
import { db } from './firebaseConfig';

const Topup = () => {
    const { card } = useRoute().params
    console.log(card.id)
 const [phone,setPhone] = useState('')
    const navigation = useNavigation()
    const [transId,setTransId] = useState()
 
  const [amount, setAmount] = useState('')
 
  
    const handleSubmit = () => {
        if (!amount || !phone) {
            alert("All fields are required")
            return
      }
      if (amount < 1) {
        alert("Enter valid amount")
        return
      }
        alert(`Complete the payment at ${phone}`)
      var data = JSON.stringify({
        tx_ref: "MC-15852113s09v5050e8",
        amount: amount,
        currency: "KES",
        email: "user@example.com",
        phone_number: phone,
        fullname: "client",
      });
      
      var config = {
        method: "post",
        url: "https://api.flutterwave.com/v3/charges?type=mpesa",
        headers: {
          Authorization: "Bearer FLWSECK-107a1795472bc0eb0e69e1599ab543d6-X",
          "Content-Type": "application/json",
        },
        data: data,
      };
      
      axios(config)
        .then(function (response) {
            console.log(response.data.data.id);
            setTransId(response.data.data.id)
        })
        .catch(function (error) {
          console.log(error);
        });
       
    
        }
    const handleVreify = () => {
        alert("verifying...")
      
          var config = {
            method: "get",
            url: `https://api.flutterwave.com/v3/transactions/${transId}/verify`,
            headers: {
              Authorization: "Bearer FLWSECK-107a1795472bc0eb0e69e1599ab543d6-X",
              "Content-Type": "application/json",
            },
          };
          
          axios(config)
            .then(function (response) {
                console.log(response.data);
                if (response.data.status == 'success') {
                    // succcifully paid
                    setTransId('')
                    // update card balace
                    const balance = parseInt(card.amount) + parseInt(amount)
                    const cardRef = doc(db,'cards',card.id)
                    updateDoc(cardRef, {
                        amount:balance
                    }).then(() => {
                        // insert into transactions
                        const transaction = {
                            cardId: card.id,
                            amount: amount,
                            createdAt: serverTimestamp(),
                            transid: card.id,
                            bill: "Mpesa",
                            type:"+",
                           
                            
                          }
                        const docRef = collection(db, 'transactions')
                        addDoc(docRef, transaction)
                            .then(() => {
                            alert("Your top up was successifully")
                            }).catch((e) => {
                              alert(e.message)
                              setAmount('')
                              setPhone('')
                        })

                    }).catch((e) => {
                        alert(e.message)
                    })


                }
            })
            .catch(function (error) {
              console.log(error);
            });
          

    }
  
  return (
    <View style={{flex:1,padding:20,backgroundColor:"white"}}>
     
      <View >
      <Image
        source={require("../assets/creditCard.png")}
          style={{ marginTop: 10, height: 200, width: 400, alignSelf: "center" }}
          resizeMode={"contain"}
      />
     
      <View style={{ marginTop: 0, padding: 50 }}>
    
                  {!transId && (
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
                         name="credit-card"
                         size={20}
                         color="#0000007d"
                         style={{ marginRight: 3, marginLeft: 10 }}
                       />
                       <TextInput
                         style={{ padding: 7, fontSize: 16, flex:1 }}
                         placeholder="Amount"
                                       onChangeText={setAmount}
                                       keyboardType="number-pad"
                     
                       />
                       
                     </View>
       )}
                  {!transId && (
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
                          name="phone"
                          size={20}
                          color="#0000007d"
                          style={{ marginRight: 3, marginLeft: 10 }}
                        />
                        <TextInput
                          style={{ padding: 7, fontSize: 16, flex:1 }}
                          placeholder={`Phone Number eg ${card.phone.slice(0,-1)}`}
                          onChangeText={setPhone}
                      
                        />
                        
                      </View>
      )}
        
          
          
          
        
                  {!transId && (
                          <TouchableOpacity
                          onPress={handleSubmit}
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
                               <Text style={{ color: "white" }}>Topup</Text>
                             </TouchableOpacity>
        )}
        
                  {transId && (
                      <>
                          <TouchableOpacity
                          onPress={handleVreify}
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
                               <Text style={{ color: "white" }}>Verify Payment</Text>
                             </TouchableOpacity>
                          <TouchableOpacity
                          onPress={()=>{setTransId('')}}
                              style={{
                                  borderColor: "#1F54D3",
                                  borderWidth:1,
                                 alignSelf: "center",
                                 borderRadius: 5,
                                 backgroundColor: "transparent",
                                 padding: 15,
                                 width: 270,
                                 marginTop: 30,
                                 alignItems: "center",
                                 color: "white",
                               }}
                             >
                               <Text style={{ color: "black" }}>Retry</Text>
                             </TouchableOpacity>
                      </>
                          
        )}
             
      </View>
    </View>
      
    </View>
  )
}

export default Topup