
import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config.json';

const List = () => {
  let [date, setDate] = useState([new Date().toLocaleTimeString(), new Date().toLocaleDateString()])
  useEffect(() => { 
    const interval = setInterval(() => {
      setDate([new Date().toLocaleTimeString(), new Date().toLocaleDateString()])
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const [flux, setFlux] = useState([]);
  useEffect(() => {
 
axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getFeeds`
  }).then((res) => {
    setFlux(res.data.result)
    console.log(res.data)
  }).catch((err) => {
    console.log(err)
})
  }, [])
  const [currentFlux, setCurrentFlux] = useState(flux)
  const handlePress = (index) => {
    console.log(flux[index])
  }

    
    return(
        <View style={styles.list}>

<View style={styles.popup}  >
  <Text style={styles.articleTitle}>
    {currentFlux == 0 ? currentFlux.title : "test"}
  </Text>
</View>

        <Text style={styles.listTitle}>
          Informations générales
        </Text>
        <View style={styles.news}>
       
         {flux.map((item, index) => {

            return(
              
              <Pressable key={index} onPress={() => handlePress(index)}>
              <View style={styles.link}>
               <Text >{item.title}</Text>
               </View>
               </Pressable>
            )
         })
         }
       
    
        </View>
        <View style={styles.rappels}>
         <Text>
         Aucun rappel pour le moment
         </Text>
        </View>
        <View style={styles.date}>
          <Text>
            Il est {date[0]} et nous sommes le {date[1]}.
          </Text>
        </View>
        </View>
    )

}
const styles = {
  link: {
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
    marginBottom: 10
  },
    news: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
      
      },
      rappels: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
       
      },
      date: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
       
      },
      list: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        gap: 10,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
    
    
        
      },
      listTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      }
}

export default List;