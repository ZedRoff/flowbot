import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native'; // Add Platform and StatusBar
import axios from 'axios';
import config from "../config.json"
import { socket } from './socket';

const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [commands, setCommands] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

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
      } else if (response.data.result === "alreadyexists") alert("La commande existe déjà")
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleFetch = () => {
    axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getCommands`,
     
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
      } else if (response.data.result === "notfound") alert("La commande n'existe pas")
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleSend = () => {
    if (inputValue === "") return alert("Veuillez entrer un message")
    setMessages((messages) => [...messages, { message: inputValue, isBot: false }]);
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/useCommand`,
      data: {
        message: inputValue
      }
    }).then((response) => {
      if (response.data.result === "success") {
        setInputValue("");
      } else {
        console.log(response.data.result)
        alert("Erreur lors de l'utilisation de la commande")
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    handleFetch()
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });
    socket.on('message', (data) => {
      setMessages((messages) => [...messages, { message: data.message, isBot: true }]);
    });
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' && <View style={styles.banner}></View>} 
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <ScrollView>
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
                <Text style={styles.commandName}>Nom : {command[1]}</Text>
                <Text style={styles.commandReply}>Réponse : {String(command[2])}</Text>
                <Button
                  title="Supprimer"
                  onPress={() => handleDelete(command[0])}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={styles.chatBot}>

          <View style={styles.chatBotContainer}>
              
            <ScrollView style={styles.chatBotBody}>
            
                {messages.map((message, idx) => (
                  <View key={idx} style={message.isBot ? styles.botMessage : styles.userMessage}>
                    <Text>{String(message.message)}</Text>
                  </View>
                ))}
       
            </ScrollView>
            <View style={styles.chatBotFooter}>
              <TextInput
                style={styles.input}
                placeholder="Message"
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
              />
              <Button
                title="Envoyer"
                onPress={handleSend}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  banner: {
    height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, 
    backgroundColor: '#007bff',
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
    width: "100%"
  },
  commandList: {
    marginTop: 10,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  command: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    gap: 10,
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
  chatBot: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  chatBotContainer: {
    flexDirection: 'column',
    gap: 15,
    width: 300,
    backgroundColor: '#e6e6e6',
    padding: 15,
    borderRadius: 15,
  },
  chatBotHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  chatBotHeaderText: {
    fontSize: 20,
  },
  chatBotBody: {
    flexGrow: 1,
    flexDirection: 'column',
    gap: 10,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    height: 300,
    gap: 10,
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  chatBotMessage: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
    gap: 5
  },
  chatBotFooter: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 15,
  },
  chatBotInput: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  chatBotButton: {
    padding: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    borderWidth: 0,
    borderRadius: 5,
  },
  botMessage: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
    color: '#fff',
  },
};

export default App;