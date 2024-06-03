import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Pressable, SafeAreaView, Platform } from 'react-native';
import io from 'socket.io-client';
import config from './assets/config.json';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faMars, faVenus, faVoicemail, faX } from '@fortawesome/free-solid-svg-icons';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import RNPickerSelect from 'react-native-picker-select'
import * as FileSystem from 'expo-file-system';
const App = () => {
  const [hasFinishedStarter, setHasFinishedStarter] = useState(false);
  const [processFinished, setProcessFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [name, setName] = useState("");
  const [voicePreference, setVoicePreference] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [showMeteo, setShowMeteo] = useState(false);
  const [city, setCity] = useState("");
  const [introduction, setIntroduction] = useState(false);
const [showMusique, setShowMusique] = useState(false);
const [music, setMusic] = useState("");


  const data = [
    { title: "Quel est votre nom ?", type: "text", icon: faUser },
    { title: "Quelle voix préférez-vous ?", type: "radio", options: ["Homme", "Femme"], icon: faVoicemail },
  ];

  useEffect(() => {
    axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/hasFinishedStarter`,
    }).then((response) => {
      if (response.data.result === 1) {
        setHasFinishedStarter(true);
      }
    });
  }, []);

  useEffect(() => {
    const socket = io(`http://${config.URL}:5000`);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('message', {from: "mobile", message: "mobile_connected"});
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('message', (message) => {
      console.log('Message received: ' + message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex === 0 && !name) {
      setShowToast(true);
    } else if (currentQuestionIndex === 1 && !voicePreference) {
      setShowToast(true);
    } else {
      setShowToast(false);
      if (currentQuestionIndex < data.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log("Nom:", name);
        console.log("Préférence vocale:", voicePreference);
        axios({
          method: 'post',
          url: `http://${config.URL}:5000/api/setFinishedStarter`,
          data: {
            has_finished: 1,
          },
        });
        const socket = io(`http://${config.URL}:5000`);




  


        socket.emit('message', {from: "mobile", message: "starter_finished"});
        axios({
          method: 'post',
          url: `http://${config.URL}:5000/api/updatePreferences`,
          data: {
            name: name,
            voice: voicePreference,
          },
        });





        setCurrentQuestionIndex(0);
        setName("");
        setVoicePreference("");
        setHasFinishedStarter(true);
      }
    }
  };

  const handleChangeCity = () => {
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/changeCity`,
      data: {
        city: city,
      },

    }).then((response) => {
      if(response.data.result == "success") {
        console.log("City changed successfully");
        const socket = io(`http://${config.URL}:5000`);
        socket.emit('message', {from: "mobile", message: "city_changed", city: city});
      }
    
    
    })
   
    
    setShowMeteo(false);
  };
  const handleChangeMusic = () => {
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/playAudio`,
      data: {
        query: music,
      },
    }).then((response) => {
      if(response.data.result == "success") {
        console.log("Music played successfully");
        const socket = io(`http://${config.URL}:5000`);
        socket.emit('message', {from: "mobile", message: "music_changed", music: music});
      }
    }
    )
  }
  const handlePauseMusic = () => {
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/pauseAudio`,
    }).then((response) => {
      if(response.data.result == "success") {
        console.log("Music paused successfully");
        const socket = io(`http://${config.URL}:5000`);
        socket.emit('message', {from: "mobile", message: "music_paused"});
      }
    }
    )
  }
  const handleResumeMusic = () => {
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/resumeAudio`,
    }).then((response) => {
      if(response.data.result == "success") {
        console.log("Music resumed successfully");
        const socket = io(`http://${config.URL}:5000`);
        socket.emit('message', {from: "mobile", message: "music_resumed"});
      }
    }
    )
  }
  const handleStopMusic = () => {
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/stopAudio`,
    }).then((response) => {
      if(response.data.result == "success") {
        console.log("Music stopped successfully");
        const socket = io(`http://${config.URL}:5000`);
        socket.emit('message', {from: "mobile", message: "music_stopped"});
      }
    }
    )
  }
  const [volume, setVolume] = useState(50); // Initial volume set to 50
const handleChangeVolume = (value) => {
  setVolume(value);
  console.log(value)
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/changeVolume`,
    data: {
      volume: value,
    },
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Volume changed successfully");
      const socket = io(`http://${config.URL}:5000`);
      socket.emit('message', {from: "mobile", message: "volume_changed", volume: value});
    }
  }
  )
}


const [showFichiers, setShowFichiers] = useState(false);

const [fileInfo, setFileInfo] = useState(null);
const [fileContent, setFileContent] = useState('');

const [file, setFile] = useState(null);
const [showChronometre, setShowChronometre] = useState(false);
  


const pickFile = async () => {

  try {
    let result = await DocumentPicker.getDocumentAsync();
    setFile(result);
    
  } catch (err) {
    console.error("Error picking document: ", err);
  }
};


const uploadFile = async () => {
  try {
    const formData = new FormData();
 
    formData.append('file',{
      uri: file["assets"][0]["uri"],
      name: file["assets"][0]["name"],
      type: file["assets"][0]["mimeType"] || 'application/octet-stream',
    });


    await axios.post(`http://${config.URL}:5000/api/download`, formData);
   alert("Fichier téléchargé avec succès")
  } catch (error) {
    console.log(error)
    alert("Erreur lors du téléchargement du fichier")
  }
};

const [showTimeTable, setShowTimeTable] = useState(false);
let [nomDay, setNomDay] = useState("");
let [from, setFrom] = useState("");
let [to, setTo] = useState("");
let [day, setDay] = useState("");

const handleAddDay = () => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/addDays`,
    data: {
      name: nomDay,
      day: day,
      f: from,
      t: to,
    },
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Day added successfully");
      setShowTimeTable(false);
    }
  }
  )
}
const handleStartChronometre = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/startChronometre`,
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Chronometre started successfully");

    }
  }
  )
}
const handleStopChronometre = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/stopChronometre`,
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Chronometre stopped successfully");

    }
  }
  )
}
const handlePauseChronometre = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/pauseChronometre`,
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Chronometre paused successfully");

    }
  }
  )
}
const handleResumeChronometre = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/continueChronometre`,
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Chronometre resumed successfully");

    }
  }
  )
}


  
  return (


    <SafeAreaView style={styles.container}>
    {Platform.OS === 'ios' && <View style={styles.banner}></View>} 



    {hasFinishedStarter || processFinished ? (
      <View style={styles.container}>
        
        <Button title="Météo" onPress={() => {
           setShowMeteo(true);
           setShowMusique(false);
            setShowFichiers(false);
            setShowTimeTable(false)
            
          setShowChronometre(false)

        }} />
 <Button title="Musique" onPress={() => {
           setShowMusique(true);
            setShowMeteo(false);
            setShowFichiers(false);
            setShowTimeTable(false)
            
          setShowChronometre(false)

        }} />
        <Button title="Fichiers" onPress={() => {
          setShowFichiers(true);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false)
          
          setShowChronometre(false)
        }} />
        <Button title="Emploi du temps" onPress={() => {
          setShowTimeTable(true);
          setShowMeteo(false);
          setShowMusique(false);
          setShowFichiers(false);
          setShowChronometre(false)
        }} />

        <Button title="Chronometre" onPress={() => {
          setShowFichiers(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false);
          setShowChronometre(true);
        }
        } />

        {showChronometre && (
          <View style={styles.popupContainer}>
            <View style={styles.popupHeader}>
              <Text style={styles.headerText}>Chronomètre</Text>
              <Pressable onPress={() => setShowChronometre(false)}>
                <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
              </Pressable>
            </View>


            <View style={styles.popupMain}>
           <Button title="Start" onPress={handleStartChronometre} />
            <Button title="Stop" onPress={handleStopChronometre} />
            <Button title="Pause" onPress={handlePauseChronometre} />
            <Button title="Reprendre" onPress={handleResumeChronometre} />
       
</View>


            </View>
        )}

        {showMeteo && ( 
          <View style={styles.popupContainer}>
            <View style={styles.popupHeader}>
              <Text style={styles.headerText}>Changer la ville météo</Text>
              <Pressable onPress={() => setShowMeteo(false)}>
                <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
              </Pressable>
            </View>

            <View style={styles.popupMain}>
              <Text style={styles.labelText}>Ville</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Exemple : Paris"
                value={city}
                onChangeText={setCity}
              />
              <Button title="Changer" onPress={handleChangeCity} />
            </View>
          </View>
        )}
        {showMusique && (
          <View style={styles.popupContainer}>
            <View style={styles.popupHeader}>
              <Text style={styles.headerText}>Jouer de la musique</Text>
              <Pressable onPress={() => setShowMusique(false)}>
                <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
              </Pressable>
            </View>

            <View style={styles.popupMain}>
              <Text style={styles.labelText}>Nom de la musique</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Exemple : Crab rave"
                value={music}
                onChangeText={setMusic}
              />
              <Button title="Jouer" onPress={handleChangeMusic} />
              <Button title="Pause" onPress={handlePauseMusic} />
              <Button title="Reprendre" onPress={handleResumeMusic} />
              <Button title="Arrêter" onPress={handleStopMusic} />
              <Slider
    style={{ width: '100%', marginTop: 10 }}
    minimumValue={0}
    maximumValue={1}
    minimumTrackTintColor="#FFFFFF"
    maximumTrackTintColor="#000000"
    thumbTintColor="#FFFFFF"
    value={volume}
    onValueChange={(value) => handleChangeVolume(value)}
  />

            </View>
          </View>
        )}
        {showTimeTable && ( 
          <View style={styles.popupContainer}>
            <View style={styles.popupHeader}>
              <Text style={styles.headerText}>Emploi du temps</Text>
              <Pressable onPress={() => setShowTimeTable(false)}>
                <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
              </Pressable>
            </View>

            <View style={styles.popupMain}>
            <Text style={styles.labelText}>Nom</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Exemple : Coder un truc cool"
                value={nomDay}
                onChangeText={setNomDay}
              />
              <Text style={styles.labelText}>Jour</Text>
              <RNPickerSelect
                onValueChange={(value) => setDay(value)}
                items={[
                  { label: 'Lundi', value: 'Lundi' },
                  { label: 'Mardi', value: 'Mardi' },
                  { label: 'Mercredi', value: 'Mercredi' },
                  { label: 'Jeudi', value: 'Jeudi' },
                  { label: 'Vendredi', value: 'Vendredi' },
                  { label: 'Samedi', value: 'Samedi' },
                  { label: 'Dimanche', value: 'Dimanche' },
                ]}
              />
              <Text style={styles.labelText}>De</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Exemple : 14"
                value={from}
                onChangeText={setFrom}
              />
              <Text style={styles.labelText}>À</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Exemple : 15"
                value={to}
                onChangeText={setTo}  
              />
              <Button title="Ajouter" onPress={handleAddDay} />
              
            </View>
          </View>
        
        )}
{showFichiers && (
     <View style={styles.popupContainer}>
     <View style={styles.popupHeader}>
       <Text style={styles.headerText}>Sélectionner un fichier</Text>
       <Pressable onPress={() => setShowFichiers(false)}>
         <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
       </Pressable>
     </View>
     <View style={styles.popupMain}>
     <Button title="Pick File" onPress={pickFile} />
      {file && <Button title="Upload File" onPress={uploadFile} />}
          </View>
      
     </View>
    )}

      </View>
    ) : (


     <View style={styles.questionsContainer}>
        <View style={styles.questionsCard}>
          <FontAwesomeIcon icon={data[currentQuestionIndex].icon} size={50} />
          <Text style={styles.questionTitle}>
            {currentQuestionIndex === 0 ? `Commençons` : `Très bien ${name}`}, {data[currentQuestionIndex].title}
          </Text>
          {data[currentQuestionIndex].type === "text" ? (
            <TextInput
              style={[styles.input, showToast && !name ? styles.invalid : null]}
              placeholder="Réponse"
              value={name}
              onChangeText={setName}
            />
          ) : (
            data[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity key={index} style={styles.radioContainer} onPress={() => setVoicePreference(option)}>
                <Text style={styles.radioText}>
                  {voicePreference === option ? '●' : '○'} {option}
                </Text>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity style={styles.button} onPress={handleNextQuestion}>
            <Text style={styles.buttonText}>Suivant</Text>
          </TouchableOpacity>
          {showToast && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>Veuillez remplir tous les champs avant de passer à la question suivante.</Text>
            </View>
          )}
        </View>
      </View>













      
    )
  }
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
  questionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionsCard: {
    padding: 25,
    borderRadius: 15,
    width: '90%',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  questionTitle: {
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 18,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#2e2e2e',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  toast: {
    position: 'absolute',
    top: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  toastText: {
    color: 'white',
  },
  invalid: {
    borderColor: 'red',
  },
  popupContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
    backgroundColor: '#1C3746',
    borderRadius: 10,
    overflow: 'hidden',
  },
  popupHeader: {
    backgroundColor: '#2E2E2E',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
  },
  popupMain: {
    padding: 10,
  },
  labelText: {
    color: 'white',
  },
  textInput: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default App;
