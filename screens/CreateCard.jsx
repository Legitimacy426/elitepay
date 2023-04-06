import { View, Text,TouchableOpacity,Image,TextInput } from 'react-native'
import React, { useState ,useEffect} from 'react'
import axios from 'axios';

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Entypo from "@expo/vector-icons/Entypo";

import { addDoc,collection, serverTimestamp } from 'firebase/firestore';

import { useNavigation, useRoute } from '@react-navigation/native'
import { db } from './firebaseConfig';

const CreateCard = () => {
const {phone} = useRoute().params

  const navigation = useNavigation()
  const [cardName, setName] = useState('')
  const [amount, setAmount] = useState(0)
 
  
    const handleSubmit = () => {
        if (!cardName) {
            alert("All fields are required")
            return
      }
   alert("Creating please wait ...")
        var data = JSON.stringify({
            "currency": "USD",
            "amount":1000,
            "debit_currency": "KES",
            "billing_name": cardName,
            "billing_address": "mombasa kenya",
            "billing_city": "San1 Francisco",
            "billing_state": "CA3",
            "billing_postal_code": "941055",
            "billing_country": "US",
            "first_name": cardName,
            "last_name": cardName,
            "date_of_birth": "2000/12/30",
            "email": "someemail@gmail.com",
            "phone": phone,
            "title": "MR",
            "gender": "M",
            "callback_url": "https://webhook.site/b67965fa-e57c-4dda-84ce-0f8d6739b8a5"
        });
        var config = {
          method: 'post',
          url: 'https://api.flutterwave.com/v3/virtual-cards ',
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: "Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X",
            
            },
          data : data
          
        };
        
        axios(config)
          .then(function (response) {
            if (response.data.status == 'success') {
              console.log(JSON.stringify(response.data));
              const { id, masked_pan, card_type, name_on_card, cvv, expiration } = response.data.data
              const card = {
                cardId: id,
                name_on_card: name_on_card,
                masked_pan: masked_pan,
                card_type: card_type,
                cvv: cvv,
                expiration: expiration,
                phone: `+${phone}`,
                createdAt: serverTimestamp(),
                amount : amount
              }
              const cardRef = collection(db, "cards")
              addDoc(cardRef, card)
                .then(() => { 
                  alert("Card created successifully")
                })
                .catch((e) => {
                  alert(e)
              })
            } else {
              alert("Oops something went wrong retry")
          }
        
        })
        .catch(function (error) {
          console.log(error.message);
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
            placeholder="Card Name or your name"
            onChangeText={setName}
        
          />
          
        </View>
        
          
          
          
        
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
              <Text style={{ color: "white" }}>Create Card</Text>
            </TouchableOpacity>
             
      </View>
    </View>
      
    </View>
  )
}

export default CreateCard