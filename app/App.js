import React, { useEffect, useState, createContext } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView, Platform, StatusBar, Image } from 'react-native'; // Add Platform and StatusBar
import axios from 'axios';
import config from "../config.json"
import { socket } from './socket';
import RNPickerSelect from 'react-native-picker-select';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import Footer from './Homepage/Footer';
import Header from './Homepage/Header';

import Homepage from './Homepage/Homepage';
export const PageContext = createContext();

const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [commands, setCommands] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [color1, setColor1] = useState("")
  const [color2, setColor2] = useState("")

  let [currentPage, setCurrentPage] = useState("home");

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
      url: `http://${config.URL}:5000/api/getCommands`
     
    }).then((response) => {
      setCommands(response.data.result)
    }).catch((error) => {
      console.info(error)
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
      if(data.command == "command_usage") {
      setMessages((messages) => [...messages, { message: data.message, isBot: true }]);
      }
    });
  }, [])

  const handleChangeBackground = () => {
    if(color1 === "" || color2 === "") return alert("Veuillez remplir tous les champs")
    axios({
      method: "post",
      url: `http://${config.URL}:5000/api/changeBackground`,
      data: {
        color1: color1,
        color2: color2
      }
    }).then((response) => {
      if(response.data.result === "success") {
        axios({
          method: "post",
          url: `http://${config.URL}:5000/api/emitMessage`,
          data: {message: {color1, color2}, command: "background"}
        })

        alert("Fond d'écran changé")

      }
      else alert("Erreur lors du changement de fond d'écran")
    })
  }
  const [selectedValueTopLeft, setSelectedValueTopLeft] = useState(null);
  const [selectedValueTopRight, setSelectedValueTopRight] = useState(null);
  const [selectedValueBottomLeft, setSelectedValueBottomLeft] = useState(null);
  const [selectedValueBottomRight, setSelectedValueBottomRight] = useState(null);

  const placeholder = {
    label: 'Sélectionnez une option',
    value: null,
  };
  const options = [
    { label: 'chronometre', value: 'chronometre' },
    { label: 'minuteur', value: 'minuteur' },
    { label: 'fiches', value: 'fiches' },
    { label: 'rappels', value: 'rappels' },
  ];



  useEffect(() => {
    axios({
      method: "get",
      url: `http://${config.URL}:5000/api/getPositions`,
    }).then((response) => {
      setSelectedValueTopLeft(response.data.result[0])
      setSelectedValueBottomLeft(response.data.result[1])
      setSelectedValueTopRight(response.data.result[2])
      setSelectedValueBottomRight(response.data.result[3])
        
    })
  }, [])

  
const handleSetSelectedValueTopLeft = (value) => {
  
  setSelectedValueTopLeft(value)
  axios({
    url: `http://${config.URL}:5000/api/changePositions`,
    method: "post",
    data: {
      topLeft: value,
      bottomLeft: selectedValueBottomLeft,
      topRight: selectedValueTopRight,
      bottomRight: selectedValueBottomRight,
    },

  }).then((response) =>  {
    if(response.data.result === "success") {
      axios({
        method: "post",
        url: `http://${config.URL}:5000/api/emitMessage`,
        data: {
          message: 
          {selectedValueTopLeft, selectedValueBottomLeft, selectedValueTopRight, selectedValueBottomRight}, command: "positions" }
      })
      
    } else {
      alert("Erreur lors du changement de positions");
    }
  })

}

const handleSetSelectedValueBottomLeft = (value) => {
  
  setSelectedValueBottomLeft(value)
  axios({
    url: `http://${config.URL}:5000/api/changePositions`,
    method: "post",
    data: {
      topLeft: selectedValueTopLeft,
      bottomLeft: value,
      topRight: selectedValueTopRight,
      bottomRight: selectedValueBottomRight,
    },

  }).then((response) =>  {
    if(response.data.result === "success") {
      axios({
        method: "post",
        url: `http://${config.URL}:5000/api/emitMessage`,
        data: {
          message: 
          {selectedValueTopLeft, selectedValueBottomLeft, selectedValueTopRight, selectedValueBottomRight}, command: "positions" }
      })
   
    } else {
      alert("Erreur lors du changement de positions");
    }
  
  })
}
const handleSetSelectedValueTopRight = (value) => {
 
  setSelectedValueTopRight(value)
  axios({
    url: `http://${config.URL}:5000/api/changePositions`,
    method: "post",
    data: {
      topLeft: selectedValueTopLeft,
      bottomLeft: selectedValueBottomLeft,
      topRight: value,
      bottomRight: selectedValueBottomRight,
    },

  }).then((response) =>  {
    if(response.data.result === "success") {
      axios({
        method: "post",
        url: `http://${config.URL}:5000/api/emitMessage`,
        data: {
          message: 
          {selectedValueTopLeft, selectedValueBottomLeft, selectedValueTopRight, selectedValueBottomRight}, command: "positions" }
      })
 
    } else {
      alert("Erreur lors du changement de positions");
    }
  
  

  })
}
const handleSetSelectedValueBottomRight = (value) => {
 
  setSelectedValueBottomRight(value)
  axios({
    url: `http://${config.URL}:5000/api/changePositions`,
    method: "post",
    data: {
      topLeft: selectedValueTopLeft,
      bottomLeft: selectedValueBottomLeft,
      topRight: selectedValueTopRight,
      bottomRight: value,
    },

  }).then((response) =>  {
    if(response.data.result === "success") {
      axios({
        method: "post",
        url: `http://${config.URL}:5000/api/emitMessage`,
        data: {
          message: 
          {selectedValueTopLeft, selectedValueBottomLeft, selectedValueTopRight, selectedValueBottomRight}, command: "positions" }
      })
   
    } else {
      alert("Erreur lors du changement de positions");
    }
  
  })
 
}
const [file, setFile] = useState(null);

const pickFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync();
    setFile(result);
  } catch (error) {
    console.error('Error picking file:', error);
  }
};
const uploadFile = async () => {
  try {
    const formData = new FormData();
    console.log(file)
    formData.append('file', {
      uri: file["assets"][0]["uri"],
      name: file["assets"][0]["name"],
      type: 'application/octet-stream',
    });

    await axios.post(`http://${config.URL}:5000/api/download`, formData);
   alert("Fichier téléchargé avec succès")
  } catch (error) {
    alert("Erreur lors du téléchargement du fichier")
  }
};
  return (
    <PageContext.Provider value={{currentPage, setCurrentPage}}>
    <View style={styles.container}>
    {Platform.OS === 'ios' && <View style={styles.banner}></View>}
      <SafeAreaView style={styles.main}>
    <Header />

   
    {currentPage === "home" && ( 
      <Homepage />
   )}
   {currentPage === "apps" && (<h1>test</h1>)}



     
      </SafeAreaView>

<Footer active="home" />

    </View>

    </PageContext.Provider>

    /*<SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' && <View style={styles.banner}></View>} 
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <ScrollView>
      <View style={styles.backgroundContainer}>
          <Text style={styles.title}>Changer le fond d'écran</Text>
          <Text style={styles.label}>Couleur 1</Text>
          <TextInput placeholder="Exemple : #00FFFF" style={styles.input}  onChangeText={(text) => setColor1(text)}/>
          <Text style={styles.label}>Couleur 2</Text>
          <TextInput placeholder="Exemple : #00FFFF" style={styles.input} onChangeText={(text) => setColor2(text)} />
          <Button title="Changer" onPress={handleChangeBackground} />
        </View>

    <View style={styles.positionsContainer}>
      <View style={{display: "flex", gap: "15px", alignItems: "center", justifyContent: "center"}}> 
       <Text style={styles.title}>Haut-Gauche</Text>
        <RNPickerSelect
        onValueChange={(value) => handleSetSelectedValueTopLeft(value)}
        items={options}
        placeholder={placeholder}
        value={selectedValueTopLeft}
      /></View>
      <View style={{display: "flex", gap: "15px", alignItems: "center"}}> 
       <Text style={styles.title}>Bas-Gauche</Text>
        <RNPickerSelect
        onValueChange={(value) => handleSetSelectedValueBottomLeft(value)}
        items={options}
        placeholder={placeholder}
        value={selectedValueBottomLeft}
      /></View>
      <View style={{display: "flex", gap: "15px", alignItems: "center"}}> 
       <Text style={styles.title}>Haut-Droite</Text>
        <RNPickerSelect
        onValueChange={(value) => handleSetSelectedValueTopRight(value)}
        items={options}
        placeholder={placeholder}
        value={selectedValueTopRight}
      /></View>
      <View style={{display: "flex", gap: "15px", alignItems: "center"}}> 
       <Text style={styles.title}>Bas-Droite</Text>
        <RNPickerSelect
        onValueChange={(value) => handleSetSelectedValueBottomRight(value)}
        items={options}
        placeholder={placeholder}
        value={selectedValueBottomRight}
      /></View>
    
      </View>


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
      <View style={styles.stopwatchContainer}>
        <Text style={styles.stopwatchText}>Lance le chronomètre</Text>
        <Text style={styles.stopwatchText}>Pause le chronomètre</Text>
        <Text style={styles.stopwatchText}>Stop le chronomètre</Text>
      </View>
      </ScrollView>

    
      <View>
      <Button title="Pick File" onPress={pickFile} />
      {file && <Button title="Upload File" onPress={uploadFile} />}
    </View>


    </SafeAreaView>*/
  );

}

const styles = {

  container: {
    flexDirection: 'column',
    flex: 1,

  },
  main: {
    flex: 10,
    gap: 10,
    
   
  },
  
  banner: {
    height: Platform.OS === 'ios' ? 45 : StatusBar.currentHeight, 
    backgroundColor: '#007bff',

  },
  
  
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  
  
}

/*

stopwatchContainer: {
  marginTop: 10,
  backgroundColor: '#f5f5f5',
  padding: 10,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
},
stopwatchText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10,
},
  backgroundContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  
  },
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
  },*/


export default App;
