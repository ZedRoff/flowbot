import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Pressable, SafeAreaView, Platform, ScrollView, Alert  } from 'react-native';
import io from 'socket.io-client';
import config from './assets/config.json';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faMars, faVenus, faVoicemail, faX, faEdit, faFolder } from '@fortawesome/free-solid-svg-icons';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import RNPickerSelect from 'react-native-picker-select'
import * as FileSystem from 'expo-file-system';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import Draggable from 'react-native-draggable';


const Section = ({ data, updateSection, deleteSection, moveSection, index, totalSections }) => {
  return (
      <View style={styles.sectionContainer}>
          <Picker
              selectedValue={data.type}
              style={styles.picker}
              onValueChange={(itemValue) => updateSection(data.id, 'type', itemValue)}
          >
              <Picker.Item label="Théorème" value="theoreme" />
              <Picker.Item label="Définition" value="definition" />
              <Picker.Item label="Propriété" value="propriete" />
              <Picker.Item label="Exemple" value="exemple" />
              <Picker.Item label="Texte" value="texte" />
          </Picker>
          <TextInput
              style={styles.input}
              value={data.title}
              onChangeText={(text) => updateSection(data.id, 'title', text)}
              placeholder="Titre"
          />
          <TextInput
              style={styles.textArea}
              value={data.content}
              onChangeText={(text) => updateSection(data.id, 'content', text)}
              placeholder="Contenu"
              multiline
          />
          <View style={styles.buttonRow}>
              <Button title="Supprimer" onPress={() => deleteSection(data.id)} />
              {index > 0 && <Button title="Haut" onPress={() => moveSection(index, index - 1)} />}
              {index < totalSections - 1 && <Button title="Bas" onPress={() => moveSection(index, index + 1)} />}
          </View>
      </View>
  );
};





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
const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [selectedHours, setSelectedHours] = useState(0);
  const [hierarchy, setHierarchy] = useState([])
  const [showTabFichiers, setShowTabFichiers] = useState(false);
const [fichiers, setFichiers] = useState([]);
const [folder, setFolder] = useState("");

const [isModalVisible, setModalVisible] = useState(false);
const [folderName, setFolderName] = useState('');

const [showFichiers, setShowFichiers] = useState(false);

const [fileInfo, setFileInfo] = useState(null);
const [fileContent, setFileContent] = useState('');

const [file, setFile] = useState(null);
const [showChronometre, setShowChronometre] = useState(false);
  
const [showMinuteur, setShowMinuteur] = useState(false);
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
      let who = message["from"];
      let type = message["type"];
      let msg = message["message"];

  if(type == 'timetable_update') {
          fetchDays()
      }  else if(type == 'files_update') {
          fetchHierarchy()
          
      }
      console.log('Message received: ' + message);
    });

    return () => {
      socket.disconnect();
    };
  }, [hierarchy, fichiers, folder]);
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

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
    if(folder.includes("/") || folder.includes("\\") || folder.includes(" ")) {
      alert("Le nom du dossier ne doit pas contenir d'espaces ou de caractères spéciaux")
    } else if(file["assets"][0]["name"].includes("/") || file["assets"][0]["name"].includes("\\") || file["assets"][0]["name"].includes(" ")) {
      alert("Le nom du fichier ne doit pas contenir d'espaces ou de caractères spéciaux")
    } else {

formData.append('folder', encodeURIComponent(folder))

    await axios.post(`http://${config.URL}:5000/api/download`, formData);
   alert("Fichier téléchargé avec succès")
    }
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
const handleStartMinuteur = () => {

  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/startMinuteur`,
    data: {
      temps: parseInt(selectedHours * 3600) + parseInt(selectedMinutes * 60) + parseInt(selectedSeconds),
    },
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Minuteur started successfully");

    }
  }
  )
}
const handleStopMinuteur = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/stopMinuteur`,
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Minuteur stopped successfully");

    }
  }
  )
  
}
const handlePauseMinuteur = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/pauseMinuteur`,
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Minuteur paused successfully");

    }
  }
  )
}
const handleResumeMinuteur = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/continueMinuteur`,
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Minuteur resumed successfully");

    }
  }
  )
}


const [elements, setElements] = useState([]);
    
  
 
  
const timeSlots = Array.from(Array(24).keys());

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
let corr = {
    "Lundi": 0,
    "Mardi": 1,
    "Mercredi": 2,
    "Jeudi": 3,
    "Vendredi": 4,
    "Samedi": 5,
    "Dimanche": 6
    
}
let reverse_corr = {
    0: "Lundi",
    1: "Mardi",
    2: "Mercredi",
    3: "Jeudi",
    4: "Vendredi",
    5: "Samedi",
    6: "Dimanche"
    

}

const fetchDays = async() => {
  axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getDays`,
  }).then((response) => {
   setElements([]);
      for(let i = 0; i < response.data.result.length; i++) {
          let d = {};

          d["id"] = response.data.result[i][0];
          d["name"] = response.data.result[i][1];
          d["day"] = corr[response.data.result[i][2]];
          d["startTime"] = parseInt(response.data.result[i][3]);
          d["endTime"] = parseInt(response.data.result[i][4]);
      
     
          setElements((els) => [...els, d]);
      }
  });
}
useEffect(() => {
  fetchDays();
}
, []);


let [showEditTimeTable, setShowEditTimeTable] = useState(false);
let [modifyNomDay, setModifyNomDay] = useState("");
let [modifyDay, setModifyDay] = useState("");
let [modifyFrom, setModifyFrom] = useState("");
let [modifyTo, setModifyTo] = useState("");
let [modifyId, setModifyId] = useState("");

const handleEditDay = () => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/modifyDay`,
    data: {
      name: modifyNomDay,
      day: modifyDay,
      f: modifyFrom,
      t: modifyTo,
      id: modifyId
    },
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Day edited successfully");
      setShowEditTimeTable(false);
    }
  }
  )
}
const [showEditPPTimeTable, setShowEditPPTimeTable] = useState(false);



const fetchHierarchy = async() => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getFiles`,
  }).then((response) => {
    setHierarchy(response.data.result)
  })
}

useEffect(() => {
  fetchHierarchy()
  
}, [])


const handleOpenModal = () => {
  setModalVisible(true);
};

const handleCloseModal = () => {
  setModalVisible(false);
};
const validateFolderName = (name) => {
  const pattern = /^[a-zA-Z0-9_\- ]+$/;
  return pattern.test(name.trim());
};
const handleSubmit = async () => {
  if (folderName.trim() === '') {
    Alert.alert('Erreur', 'Le nom du dossier ne peut pas être vide');
    return;
  }
  if (!validateFolderName(folderName)) {
    Alert.alert('Erreur', 'Format du nom erroné');
    return;
  }

  try {
    const response = await axios.post(`http://${config.URL}:5000/api/createFolder`, {
      folder_name: folderName
    });

    if (response.status === 200) {
      Alert.alert('Success', `Dossier "${folderName}" a été crée`);
    } else {
      Alert.alert('Error', `Pas réussi a crée le dossier: ${response.data.error}`);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', `Pas réussi a crée le dossier: ${error.message}`);
  }

  setFolderName(''); 
  handleCloseModal();
};


const [validatedData, setValidatedData] = useState(null);


const [fiche, setFiche] = useState([]);


const [ficheMaker, setFicheMaker] = useState(false);
const [ficheTitle, setFicheTitle] = useState('');
const [ficheDescription, setFicheDescription] = useState('');
const addSection = () => {
  if(fiche.length > 0 && fiche[fiche.length - 1].title === '' && fiche[fiche.length - 1].content === '') {
    alert("La section précédente ne peut pas être vide");
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].title === '') {
    alert("Le titre de la section précédente ne peut pas être vide");
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].content === '') {
    alert("Le contenu de la section précédente ne peut pas être vide");
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].title.length > 50) {
    alert("Le titre de la section précédente ne peut pas dépasser 50 caractères");
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].content.length > 500) {
    alert("Le contenu de la section précédente ne peut pas dépasser 500 caractères");
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].type === '') {
    alert("Le type de la section précédente ne peut pas être vide");
    return;
  }
  
  const newSection = {
    id: new Date(),
      type: 'theoreme',
      title: '',
      content: ''
  };
  setFiche([...fiche, newSection]);
};

const deleteSection = (id) => {
  setFiche(fiche.filter(section => section.id !== id));
};

const updateSection = (id, key, value) => {
  setFiche(prevFiche => {
      const updatedFiche = prevFiche.map(section => {
          if (section.id === id) {
              return { ...section, [key]: value }; // Effectue une copie profonde de la section modifiée
          }
          return section;
      });
      return updatedFiche;
  });
};

const moveSection = (fromIndex, toIndex) => {
  const newFiche = [...fiche];
  const [movedSection] = newFiche.splice(fromIndex, 1);
  newFiche.splice(toIndex, 0, movedSection);
  setFiche(newFiche);
};

const validate = () => {
  if(ficheTitle === '') {
    alert("Le titre de la fiche ne peut pas être vide");

    return;
  }
  if(ficheDescription === '') {
    alert("La description de la fiche ne peut pas être vide");
    return;
  }

  if(fiche.length === 0) {
    alert("La fiche ne peut pas être vide");
return;
  }
  if(fiche.some(section => section.title === '' || section.content === '')) {
    alert("Les sections de la fiche ne peuvent pas être vides");
    return;
  }
  if(fiche.some(section => section.title.length > 50)) {
    alert("Les titres des sections ne peuvent pas dépasser 50 caractères");
    return;
  }
  if(fiche.some(section => section.content.length > 500)) {
    alert("Les contenus des sections ne peuvent pas dépasser 500 caractères");
    return;
  }
  if(fiche.some(section => section.type === '')) {
    alert("Les types des sections ne peuvent pas être vides");
    return;
  }

  setValidatedData(fiche);
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/createFiche`,
    data: {
      fiche: fiche,
      ficheTitle: ficheTitle,
      ficheDescription: ficheDescription,
    },
  }).then((res) => {
    if(res.data.result == "success") {
      alert("Fiche créee avec succès")
    } else if(res.data.result == "already") {
      alert("La fiche existe déjà");
    }
  })
};




  return (


    <SafeAreaView style={styles.container}>
      <ScrollView>
    {Platform.OS === 'ios' && <View style={styles.banner}></View>} 



    {hasFinishedStarter || processFinished ? (
      <View style={styles.container}>
        <Button title="Fiche" onPress={() => {
          setFicheMaker(true);

          setShowMeteo(false);
          setShowMusique(false);
           setShowFichiers(false);
           setShowTimeTable(false)
           
         setShowChronometre(false)
         
         setShowMinuteur(false);
         setShowEditTimeTable(false)
         
         setShowEditPPTimeTable(false)
        }} />

        <Button title="Météo" onPress={() => {
           setShowMeteo(true);
           setShowMusique(false);
            setShowFichiers(false);
            setShowTimeTable(false)
            
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          setShowEditTimeTable(false)
          
          setShowEditPPTimeTable(false)
        }} />
 <Button title="Musique" onPress={() => {
           setShowMusique(true);
            setShowMeteo(false);
            setShowFichiers(false);
            setShowTimeTable(false)
            setFicheMaker(false);
          setShowChronometre(false)
          
          setShowMinuteur(false);
          
          setShowEditTimeTable(false)

          
          setShowEditPPTimeTable(false)
        }} />
        <Button title="Fichiers" onPress={() => {
          setShowFichiers(true);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false)
          
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          
          setShowEditTimeTable(false)
          
          setShowEditPPTimeTable(false)
        }} />
        <Button title="Emploi du temps" onPress={() => {
          setShowTimeTable(true);
          setShowMeteo(false);
          setShowMusique(false);
          setShowFichiers(false);
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          
          setShowEditTimeTable(false)
          setShowEditPPTimeTable(false)
        }} />
            <Button title="Modifier emploi du temps" onPress={() => {
          setShowTimeTable(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowFichiers(false);
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          
          setShowEditTimeTable(false)
          setShowEditPPTimeTable(true)
        }} />

        <Button title="Chronometre" onPress={() => {
          setShowFichiers(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false);
          setShowChronometre(true);
          setShowMinuteur(false);
          setFicheMaker(false);
          setShowEditTimeTable(false)
          
          setShowEditPPTimeTable(false)
        }
        } />
        <Button title="Minuteur" onPress={() => {
          setShowFichiers(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false);
          setShowMinuteur(true);
          setShowChronometre(false);
          setFicheMaker(false);
          setShowEditTimeTable(false)
          
          setShowEditPPTimeTable(false)
        }
        } />






{ficheMaker && (
  <View style={styles.popupContainer}>
  <View style={styles.popupHeader}>
    <Text style={styles.headerText}>Créer une fiche</Text>
    <Pressable onPress={() => setFicheMaker(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
  </View>
  <View style={styles.popupMain}>
  <View style={styles.ficheContainer}>
    <Text>Titre</Text>
            <TextInput
                style={styles.titleInput}
                value={ficheTitle}
                onChangeText={setFicheTitle}
            />
            <Text>Description</Text>
              <TextInput
                style={styles.titleInput}
                value={ficheDescription}
                onChangeText={setFicheDescription}
            />
            <Button title="Ajouter une section" onPress={addSection} />
            <ScrollView>
                {fiche.map((section, index) => (
                    <Section
                        key={section.id}
                        data={section}
                        updateSection={updateSection}
                        deleteSection={deleteSection}
                        moveSection={moveSection}
                        index={index}
                        totalSections={fiche.length}
                    />
                ))}
            </ScrollView>
            <Button title="Ajouter la fiche" onPress={validate} />
           
        </View>
  </View>
</View>

)}



{showEditPPTimeTable && (

<View style={styles.timetable}>

<Pressable onPress={() => setShowEditPPTimeTable(false)}>
  <FontAwesomeIcon icon={faX} size={20} />
</Pressable>




<ScrollView horizontal>
  <View style={styles.grid}>
    {/* Colonne des heures */}
    <View style={styles.timeColumn}>
      {timeSlots.map((time, index) => (
        <View key={index} style={styles.timeSlot}>
          <Text>{time - 1}:00</Text>
        </View>
      ))}
    </View>
    
    {/* Jours de la semaine */}
    {daysOfWeek.map((day, index) => (
      <View key={index} style={styles.day}>
        <Text>{day}</Text>
      </View>
    ))}
    
    {/* Éléments du calendrier */}
    {elements.map((element, index) => (
      <View
        key={index}
        style={[
          styles.element,
          {
            gridRowStart: element.startTime + 2,
            gridRowEnd: element.endTime + 2,
            gridColumn: element.day + 2,
          },
        ]}
      >
        <View style={styles.dayBanner}>
          <Pressable onPress={() => {
            axios({
              method: 'post',
              url: `http://${config.URL}:5000/api/deleteDay`,
              data: {
                id: element.id,
              },
            }).then((response) => {
              if(response.data.result == "success") {
                console.log("Day deleted successfully");
                setElements(elements.filter((el) => el.id !== element.id));
              }
            }
            )
          }}>
          <FontAwesomeIcon icon={faX} size={15}  />
</Pressable>
<Pressable onPress={() => {
setShowEditTimeTable(true)
setModifyId(element.id)
setModifyNomDay(element.name)
setModifyDay(reverse_corr[element.day])
setModifyFrom(element.startTime)
setModifyTo(element.endTime)

}
}>
          <FontAwesomeIcon icon={faEdit} size={15}  />
</Pressable>

          </View>
          <Text>{element.name}</Text>
        <Text>{element.startTime}:00 - {element.endTime}:00</Text>
      </View>
    ))}
  </View>
</ScrollView>

</View>


)}




        {showMinuteur && (
        <View style={styles.popupContainer}>


          
        <View style={styles.popupHeader}>
          <Text style={styles.headerText}>Minuteur</Text>
          <Pressable onPress={() => setShowMinuteur(false)}>
            <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
          </Pressable>
        </View>


        <View style={styles.popupMain}>
        <Text style={styles.headerText}>Heures:</Text>
          <Picker
            selectedValue={selectedMinutes}
            onValueChange={(itemValue) => setSelectedHours(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}

          </Picker>

        <Text style={styles.label}>Minutes:</Text>
          <Picker
            selectedValue={selectedMinutes}
            onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}
          </Picker>

          <Text style={styles.label}>Secondes:</Text>
          <Picker
            selectedValue={selectedSeconds}
            onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}
          </Picker>
       <Button title="Start" onPress={handleStartMinuteur} />
        <Button title="Stop" onPress={handleStopMinuteur} />
        <Button title="Pause" onPress={handlePauseMinuteur} />
        <Button title="Reprendre" onPress={handleResumeMinuteur} />
   
</View>


        </View>
            
        )}


{showEditTimeTable && (
  <View style={styles.popupContainer}>
  <View style={styles.popupHeader}>
    <Text style={styles.headerText}>Modifier une tâche</Text>
    <Pressable onPress={() => setShowEditTimeTable(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
  </View>
  <View style={styles.popupMain}>

    <Text style={styles.label}>Nom</Text>
    <TextInput
      style={styles.textInput}
      placeholder="Exemple : Coder un truc cool"
      value={modifyNomDay}
      onChangeText={setModifyNomDay}
    />
    <Text style={styles.label}>Jour</Text>
    <RNPickerSelect
      onValueChange={(value) => {
       
        
        setModifyDay(value)
      
      }}
      value={modifyDay}
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
    <Text style={styles.label}>De</Text>
    <TextInput
      style={styles.textInput}
      placeholder="Exemple : 14"
      value={modifyFrom}
      onChangeText={setModifyFrom}
    />
    <Text style={styles.label}>À</Text>
    <TextInput
      style={styles.textInput}
      placeholder="Exemple : 15"
      value={modifyTo}
      onChangeText={setModifyTo}
    />
    <Button title="Modifier" onPress={handleEditDay} />


      </View>
  
  <View style={styles.popupMain}>
  
  </View>
  </View>
  )}
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
       <Pressable onPress={() => setShowFichiers(true)}>
         <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
       </Pressable>
     </View>



     <View style={{...styles.popupMain, gap: "15px", alignItems: "center"}}>

{hierarchy.map((element, id_g) => (
 <Pressable key={id_g} onPress={() => {
  
  setShowTabFichiers(!showTabFichiers)
  setFichiers(element["files"])
  setFolder(element["folder"])

  
  } }>
    <View style={{display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "grey", padding: "15px", width: "100px"}} key={id_g}>
<FontAwesomeIcon icon={faFolder} size={50} />
  <Text>
    {element["folder"]}
  </Text>
  </View>
 </Pressable>
  
))}
 <Button title="Create Folder" onPress={handleOpenModal} />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Entrez un nom de dossier</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du dossier"
            value={folderName}
            onChangeText={setFolderName}
          />
          <View style={styles.buttonContainer}>
            <Button title="Annuler" onPress={handleCloseModal} />
            <Button title="Créer" onPress={handleSubmit} />
          </View>
        </View>
      </Modal>


   
      
</View>
      
{showTabFichiers && (
  <View>
    {fichiers.map((element, id) => (
      <View key={id}>
        <Text>{element}</Text>
      </View>
    ))}
   <Button title="Pick File" onPress={pickFile} />
      {file && <Button title="Upload File" onPress={() => uploadFile(folder)} />}
  </View>
)}


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
  </ScrollView>
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
    transform: [{ translateX: -150 }, { translateY: 150 }],
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
  },timetable: {
    width: '100%',
    marginTop: 50,
  },
  timetable: {
    width: '100%',
    marginTop: 50,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '40px repeat(7, 1fr)',
    gridAutoRows: 40,
    gap: 2,
  },
  element: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  day: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    borderRadius: 5,
  },
  timeColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeSlot: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  // Correction de la répartition des heures
  timeColumn: {
    gridRow: '1 / span 24',
  },
  dayBanner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: "white",
    alignItems: "center"
  }, modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ficheContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5'
},
sectionContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd'
},
input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5
},
textArea: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlignVertical: 'top'
},
titleInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5

}
  
});

export default App;
