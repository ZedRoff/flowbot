import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import io from 'socket.io-client';
import config from './assets/config.json';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faMars, faVenus, faVoicemail, faX } from '@fortawesome/free-solid-svg-icons';
import Slider from '@react-native-community/slider';
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




  return (
    hasFinishedStarter || processFinished ? (
      <View style={styles.container}>
        <Button title="Météo" onPress={() => {
           setShowMeteo(true);
        }} />
 <Button title="Musique" onPress={() => {
           setShowMusique(true);
        }} />
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
