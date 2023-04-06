import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const Registration = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const handleSubmit = () => {
    alert("Processing ...")
    if (fullName == "" || email == "" || phone == "" || phone.length != 12) {
      alert("Invalid data formats");
    } else {
      const userRef = collection(db, 'users')
      const queryRef  = query(userRef,where('phone',"==",`+${phone}`))
      getDocs(queryRef).then((users) => {
       
     
        if (users.docs.length >=1) {
          alert(`${phone} alredy registered please use a different number`)
          console.log(`${phone} alredy registered please use a different number`)
       
        } else {
          console.log("processing")
          createUserWithEmailAndPassword(auth, email, "pasword@ePay")
            .then((credentials) => {
              const colRef = collection(db, "users");
    
              const client = {
                email: email,
                phone: `+${phone}`,
                fullName: fullName,
              };
              addDoc(colRef, client)
                .then(() => {
                  alert("success ,you can now login ");
                  console.log("success ,you can now login ");
                 navigation.navigate("Login")
                })
                .catch((e) => {
                  alert(e.message);
                  console.log(e.message);
                });
            }).catch((e) => {
            alert(e.message)
          })
          // register=============
         
        }
      }).catch((e) => {
        alert(e.message)
      })

    
     
    }
  };
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Image
        source={require("../assets/reg.png")}
        style={{ marginTop: 30, height: 200, width: 400, alignSelf: "center" }}
      />
      <View style={{ marginTop: 0, padding: 45 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#0000001e",
            padding: 5,
            borderRadius: 0,
          }}
        >
          <Entypo
            name="mail"
            size={17}
            color="#0000007d"
            style={{ marginRight: 4, marginLeft: 8 }}
          />
          <TextInput
            style={{ padding: 7, fontSize: 16, flex:1 }}
            placeholder="Email Address "
            onChangeText={setEmail}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#0000001e",
            padding: 5,
            borderRadius: 0,
          }}
        >
          <Entypo
            name="user"
            size={17}
            color="#0000007d"
            style={{ marginRight: 4, marginLeft: 8 }}
          />
          <TextInput
            style={{ padding: 7, fontSize: 16, flex:1 }}
            placeholder="Full name"
            onChangeText={setFullName}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#0000001e",
            padding: 5,
            borderRadius: 0,
          }}
        >
          <Entypo
            name="phone"
            size={17}
            color="#0000007d"
            style={{ marginRight: 4, marginLeft: 8 }}
          />
          <TextInput
            style={{ padding: 7, fontSize: 16, flex:1}}
            placeholder="25471213989"
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <Text
          style={{ color: "#0000009a", fontWeight: "bold", lineHeight: 25 }}
        >
          By signing up you agree to our
          <Text style={{ color: "#1F54D3" }}>
            {" "}
            Terms & Conditions and Privacy policy
          </Text>{" "}
        </Text>
        <TouchableOpacity
          onPress={() => {}}
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
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={{ color: "white" }}>Continue</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
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
            Joined us before ?<Text style={{ color: "#1F54D3" }}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registration;
