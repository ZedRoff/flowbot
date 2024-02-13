
import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
const List = () => {
  let [date, setDate] = useState([new Date().toLocaleTimeString(), new Date().toLocaleDateString()])
  useEffect(() => { 
    const interval = setInterval(() => {
      setDate([new Date().toLocaleTimeString(), new Date().toLocaleDateString()])
    }, 1000);
    return () => clearInterval(interval);
  }, []);
    
    return(
        <View style={styles.list}>
        <Text style={styles.listTitle}>
          Informations générales
        </Text>
        <View style={styles.news}>
          <Text>
          Aucune news pour le moment
          </Text>
    
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