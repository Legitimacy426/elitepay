import { View, Text, ActivityIndicator, TouchableOpacity,DevSettings ,FlatList,ScrollView,RefreshControl, SafeAreaView} from 'react-native'
import React, { useEffect, useState,useCallback,useMemo } from 'react'


import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, query, where ,orderBy} from 'firebase/firestore';


import { auth, db } from './firebaseConfig';
import useFetchCards from './hooks/useFechCards';
import { signOut } from 'firebase/auth';





const Cards = () => {
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login')
    }).catch((e) => {
      alert(e.message)
    })
  }

const {phone} = useRoute().params
// const phone = '254746121317'
  const [refreshing, setRefreshing] = useState(false)
 const [random,setRandom] = useState('')
const newNum  = new Date().getTime()
  const navigation = useNavigation() 
 
  // select list ============
  const [selected, setSelected] = useState("");
const valid = `+${phone}`
  let { cards ,isPendingC,isErrorC } = useFetchCards(valid,random)
 
console.log(valid)


  const Item = ({ item }) => (
    <TouchableOpacity onPress={()=>{navigation.navigate('Card',{card:item})}}
         // Button Linear Gradient
         style={{ backgroundColor: "transparent", marginTop: 25, padding: 15,borderRadius:5,borderWidth:1,borderColor:"grey" }}
       >
      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={{ fontSize: 15, textTransform: "uppercase" }}>{ item.name_on_card}</Text>
        <Text style={{ fontSize: 15, }}>KES { item.amount}</Text>
      </View>
      <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:10}}>
        <Text></Text>
        <TouchableOpacity onPress={()=>{navigation.navigate('Card',{card:item})}} >
        <Feather name='arrow-right' color={"black"} size={20} />
        </TouchableOpacity>
      </View>
      
       </TouchableOpacity >
  );
 
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
   
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5, }}>
      
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={()=>{setRandom(new Date().getTime())}} >
          {/* <Text>Add Card </Text> */}
        <Ionicons name='refresh' color={"black"} size={25} />
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}} onPress={() => { navigation.navigate('CreateCard', { phone: phone }) }} >
          {/* <Text>Add Card </Text> */}
        <Feather name='plus' color={"black"} size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} syle={{padding:10,borderRadius:5,borderColor:"black",borderWidth:1,backgroundColor:"black",position:"absolute"}}>
        <FontAwesome name='sign-out' color={"black"} size={15} />
          <Text>logout</Text>
        </TouchableOpacity>
      </View>
   
      
    
     

        <View >
          {isErrorC && (
            <Text>{ isErrorC}</Text>
          )}

          {isPendingC && (
              <ActivityIndicator size="large" color="#0000ff" />
          )}
          {!isPendingC && (
             <FlatList data={cards}
             renderItem={({ item }) => <Item item={item} />}
                 keyExtractor={item => item.id} />
)}
         
        </View>
 
     
      {!isPendingC && (cards.length == 0 ) && (
          <TouchableOpacity style={{alignSelf:"center",marginTop:70}}>
          <Text style={{fontSize:30}}>You have no active cards</Text>
          <TouchableOpacity onPress={()=>{navigation.navigate('CreateCard',{phone:phone})}} style={{backgroundColor:"white",borderWidth:1,padding:8,borderColor:"#00000023",color:"#00000076",alignSelf:"center",marginTop:10,borderRadius:10}}>
            <Feather name='plus' color={"#00000076"} size={25} />
          </TouchableOpacity>
        </TouchableOpacity>
        )}
       
    
    
        
      

    
    </View>
  )
}

export default Cards