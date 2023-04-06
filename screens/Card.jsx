import { View, Text,ActivityIndicator, TouchableOpacity,DevSettings ,FlatList,ScrollView,RefreshControl, SafeAreaView} from 'react-native'
import React, { useEffect, useState,useCallback,useMemo } from 'react'


import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, query, where ,orderBy} from 'firebase/firestore';
import useFetchTransactions from './hooks/useFetchTransactions';





const Card = () => {
const [random,setRandom] = useState()

  const navigation = useNavigation() 
  const { card } = useRoute().params

const {transactions,isPendingT,isErrorT} = useFetchTransactions(card.id,random)
  const Item = ({ item }) => (
    <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:20}}>
    <View style={{flexDirection:"row"}}>
      <View style={{borderWidth:1,padding:10,borderRadius:50}}>
      <MaterialCommunityIcons name='airballoon-outline' color={"black"} size={25} />
      </View>
      <View style={{marginLeft:10}}>
          <Text style={{ fontSize: 17 }}>{item.bill}</Text>
          <View><Text style={{ color: "#0000003c", marginTop: 10 }}>{ Date(item.createdAt).slice(0,16) }</Text></View>
      </View>
        </View>
        <View>
        <Text style={{ fontSize: 15 }}>KES {item.type }{ item.amount}</Text>
    </View>
  </View>
  );
 

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
   
      <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:15, }}>
        <Text style={{ fontSize: 20 }}>Balance</Text>
        <TouchableOpacity onPress={() => { setRandom(Math.random())}} >
           <Ionicons name='refresh' size={25} color={"black"} />
        </TouchableOpacity>
       
      </View>
   
      <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:10, }}>
        <Text style={{ fontSize: 35, fontWeight: "bold", color: "#000000b2" }}>KES { card.amount }</Text>
      <Text></Text>
      </View>
  
      {/* <SelectList 
       
        setSelected={(val) => setSelected(val)} 
        data={cards.map(card => ({key:card.cardId,value:card.cardName}))} 
        save="value2"
    /> */}
     
         <LinearGradient
         // Button Linear Gradient
         style={{ backgroundColor: "white", height: 200, marginTop: 25, padding: 22,borderRadius:5,borderWidth:1,borderColor:"#1F54D3" }}
         colors={['transparent','#1F54D3']}>
       <View >
         <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
           
           <Text style={{textTransform:"uppercase"}}>{ card.card_type }</Text>
           <FontAwesome name='cc-mastercard' size={30} color={"#00000067"} />
         </View>
         <Text style={{ fontSize: 20,marginTop:15,marginBottom:15 }}>{ card.name_on_card }</Text>
         <MaterialCommunityIcons name='barcode-scan' color={"black"} size={40} />
         <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:20, }}>
           <View style={{flexDirection:"row",justifyContent:"space-between"}}>
             <Text style={{marginRight:10,fontSize:17}}>{ card.masked_pan }</Text>
            
        
           </View>
           <Text>{ card.expiration }</Text>
         </View>
       </View>
       </LinearGradient>
 
       
      <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:35}}>
        {/* <TouchableOpacity onPress={()=>{navigation.navigate('Transact')}} style={{backgroundColor:"white",borderWidth:1,padding:8,borderColor:"#00000023",color:"#00000076"}}>
          <Feather name='arrow-down-left' color={"#00000076"} size={25} />
        </TouchableOpacity> */}
       
        <TouchableOpacity  onPress={()=>{navigation.navigate('Transact',{card : card})}} style={{backgroundColor:"white",borderWidth:1,padding:8,borderColor:"#00000023",color:"#00000076",flexDirection:"row"}}>
          <Text>Transact </Text><Feather name='arrow-up-right' color={"#00000076"} size={25} />
        </TouchableOpacity>
        <TouchableOpacity   onPress={()=>{navigation.navigate('Topup',{card:card})}} style={{backgroundColor:"white",borderWidth:1,padding:8,borderColor:"#00000023",color:"#00000076",flexDirection:"row"}}>
        <Text>Topup </Text><Feather name='plus' color={"#00000076"} size={25} />
        </TouchableOpacity>
        </View>
     
      <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:35}}>
        <Text style={{fontSize:25}}>Transactions</Text>
        <Text style={{color:"green"}}></Text>
      </View>
        
        <ScrollView
         showsVerticalScrollIndicator ={false}
      >

         <SafeAreaView>
        <View>
        
            <View style={{ marginTop: 20 }}>
              {isErrorT && (
                <Text>{ isErrorT }</Text>
              )}
              {isPendingT && (
                 <ActivityIndicator size="large" color="#0000ff" /> 
               )}
     
              {!isPendingT && (
                   <FlatList data={transactions}
                   renderItem={({ item }) => <Item item={item} />}
                       keyExtractor={item => item.id} />
             )}
           
        </View>
        
          </View>
              </SafeAreaView>
          </ScrollView>

    
    </View>
  )
}

export default Card