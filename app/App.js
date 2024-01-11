import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView } from 'react-native';
import axios from 'axios';
import config from "../config.json"

const App = () => {


  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  let [commands, setCommands] = useState([]);

  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (name === "" || message === "") return alert("Veuillez remplir tous les champs")
    
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/addCommand`,
      data: {
        name: name,
        reply: message
      }
    }).then((response) => {
      
      if (response.data.result === "success") {
        alert("Commande ajoutée")
        handleFetch()
      }
      else if (response.data.result === "alreadyexists") alert("La commande existe déjà")
    }).catch((error) => {
  
      console.log(error);
    });
    
  };

  const handleFetch = () => {
    
    axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getCommands`,
      "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json"
      
    }).then((response) => {
      
      setCommands(response.data.result)
    }).catch((error) => {
      
      console.log(error);
    });
  }

  const handleDelete = (commandId) => {
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/deleteCommand`,
      data: {
        uuid: commandId
      }
    }).then((response) => {
      if (response.data.result === "success") {
        alert("Commande supprimée")
        handleFetch()
      }
      else if (response.data.result === "notfound") alert("La commande n'existe pas")
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
  
    handleFetch()
  }, [])

 



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.commandMaker}>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button
          title="Crée la commande"
          onPress={handleSubmit}
        />
        <View style={styles.commandList}>
          {commands.map((command, idx) => (
            <View style={styles.command} key={idx}>
              <Text style={styles.commandName}>{command[1]}</Text>
              <Text style={styles.commandReply}>{String(command[2])}</Text>
              <Button
                title="Supprimer"
                onPress={() => handleDelete(command[0])}
              />
            </View>
          ))}
        </View>
      </View>
      
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  commandMaker: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  commandList: {
    marginTop: 10,
  },
  command: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commandName: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commandReply: {
    marginRight: 10,
    fontSize: 16,
    color: '#666',
  },
 
};
export default App;
