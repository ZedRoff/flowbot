import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Pressable, SafeAreaView, Platform, ScrollView, Alert, FlatList, Switch  } from 'react-native';
import io from 'socket.io-client';
import config from './assets/config.json';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faMars, faVenus, faVoicemail, faX, faEdit, faFolder, faClock, faTrash, faFile } from '@fortawesome/free-solid-svg-icons';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import RNPickerSelect from 'react-native-picker-select'
import * as FileSystem from 'expo-file-system';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import Draggable from 'react-native-draggable';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';


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
const [showFileInfo, setShowFileInfo] = useState(false);

const [showCorrecteur, setShowCorrecteur] = useState(false);

  const initialGrades = [
    { id: '1', matiere: 'Électronique', grade: 15, coefficient: 3, locked: true },
    { id: '2', matiere: 'Physique', grade: 15, coefficient: 2, locked: true },
    { id: '3', matiere: 'Mathématiques', grade: 12, coefficient: 3, locked: false },
  ];

  const [grades, setGrades] = useState(initialGrades);
  const [desiredAverage, setDesiredAverage] = useState('');
  const [newMatiere, setNewMatiere] = useState('');
  const [newCoefficient, setNewCoefficient] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [isDesiredAverageAttainable, setIsDesiredAverageAttainable] = useState(true);

  useEffect(() => {
    checkDesiredAverageAttainability();
  }, [desiredAverage, grades]);

  useEffect(() => {
    updateMinimumGrades();
  }, [desiredAverage]);

  const calculateGeneralAverage = () => {
    let totalGrades = 0;
    let totalCoefficients = 0;

    grades.forEach(item => {
      totalGrades += (item.grade || 0) * item.coefficient;
      totalCoefficients += item.coefficient;
    });

    return totalCoefficients === 0 ? 'N/A' : (totalGrades / totalCoefficients).toFixed(2);
  };

  const calculateLockedAverage = () => {
    let totalGrades = 0;
    let totalCoefficients = 0;

    grades.forEach(item => {
      if (item.locked) {
        totalGrades += (item.grade || 0) * item.coefficient;
        totalCoefficients += item.coefficient;
      }
    });

    return totalCoefficients === 0 ? 0 : totalGrades / totalCoefficients;
  };

  const calculateMinimumGrade = (item) => {
    if (desiredAverage === '') return 'N/A';

    let totalGrades = 0;
    let totalCoefficients = 0;

    grades.forEach(i => {
      if (i.id !== item.id) {
        totalGrades += (i.grade || 0) * i.coefficient;
        totalCoefficients += i.coefficient;
      }
    });

    const requiredGrade = (desiredAverage * (totalCoefficients + item.coefficient) - totalGrades) / item.coefficient;
    if (requiredGrade > 20) {
      return 'Non atteignable';
    } else if (requiredGrade < 0) {
      return '0.00';
    } else {
      return requiredGrade.toFixed(2);
    }
  };

  const handleGradeChange = (id, value) => {
    const newGrades = grades.map(item =>
      item.id === id ? { ...item, grade: parseFloat(value) || 0 } : item
    );
    setGrades(newGrades);
  };

  const handleLockedChange = (id, value) => {
    const newGrades = grades.map(item =>
      item.id === id ? { ...item, locked: value } : item
    );
    setGrades(newGrades);
    updateMinimumGrades();
  };

  const addMatiere = () => {
    if (newMatiere === '' || newCoefficient === '' || newGrade === '') return;

    const newId = (grades.length + 1).toString();
    const newGradeItem = {
      id: newId,
      matiere: newMatiere,
      grade: parseFloat(newGrade) || 0,
      coefficient: parseInt(newCoefficient) || 1,
      locked: false
    };

    setGrades([...grades, newGradeItem]);
    setNewMatiere('');
    setNewCoefficient('');
    setNewGrade('');
    updateMinimumGrades();
  };

  const removeMatiere = (id) => {
    const newGrades = grades.filter(item => item.id !== id);
    setGrades(newGrades);
    updateMinimumGrades();
  };

  const updateMinimumGrades = () => {
    setGrades(prevGrades => prevGrades.map(item => ({
      ...item,
      minGrade: calculateMinimumGrade(item)
    })));
  };

  const checkDesiredAverageAttainability = () => {
    const lockedAverage = calculateLockedAverage();
    setIsDesiredAverageAttainable(
      desiredAverage === '' || lockedAverage >= parseFloat(desiredAverage)
    );
  };
const [showCustom, setShowCustom] = useState(false);




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

const [fileInfo, setFileInfo] = useState({});
const [fileContent, setFileContent] = useState('');

const [file, setFile] = useState(null);
const [showChronometre, setShowChronometre] = useState(false);
  
const [showMinuteur, setShowMinuteur] = useState(false);

const [showTraducteur, setShowTraducteur] = useState(false);
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

  const [fiches, setFiches] = useState([]);

  const fetchFiches = async() => {
      axios({
        method: 'get',
        url: `http://${config.URL}:5000/api/getFiches`,
      }).then((response) => {
          console.log(response.data.result)
        setFiches(response.data.result);
      })
    
    }









    const [tasks, setTasks] = useState([]);
    const fetchCategories = () => {
      axios({
        method: 'get',
        url: `http://${config.URL}:5000/api/getCategories`,
      }).then((r1) => {
        setCategories(r1.data.result);
        if (r1.data.result.length > 0) {
          setSelectedCategory(r1.data.result[0][0]); // Initialise avec la première catégorie
        }
        let newTasks = []; // Créer un nouveau tableau pour les tâches
    
        const fetchTasksForCategory = (category) => {
          return axios({
            method: 'post',
            url: `http://${config.URL}:5000/api/getTasks`,
            data: {
              category: category[0]
            }
          }).then((r2) => {
            newTasks.push({ category: category[0], tasks: r2.data.result });
          });
        };
    
        Promise.all(r1.data.result.map(fetchTasksForCategory)).then(() => {
          setTasks(newTasks); // Mettre à jour les tâches avec les nouvelles données
        }).catch((error) => {
          console.error("Error fetching tasks: ", error);
        });
      }).catch((error) => {
        console.error("Error fetching categories: ", error);
      });
    };
  



    const [infosFiles, setInfosFiles] = useState([]);
const fetchInfosFiles = async() => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getInfosFiles`,
  }).then((response) => {
    setInfosFiles(response.data.result);
  });
}
useEffect(() => {
  fetchInfosFiles();
}
, []);

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
          fetchHierarchy();
          fetchInfosFiles();          
      } else if(type == 'qcm_update') {
        fetchQcms()
      }  else if(type == 'fiches_update') {

        fetchFiches()
      } else if(type == "tasks_update") {
        fetchCategories()

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
   setFile(null);
   setFolder("");
   
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
  fetchFiches()
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


const [text, setText] = useState('');
const [selectedLanguage, setSelectedLanguage] = useState('en');
const languages = [
  { label: 'Anglais', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'Espagnol', value: 'es' },
  { label: 'Allemand', value: 'de' },
  { label: 'Italien', value: 'it' },
  { label: 'Portugais', value: 'pt' },
  { label: 'Néerlandais', value: 'nl' },
  { label: 'Russe', value: 'ru' },
  { label: 'Chinois', value: 'zh' },
  { label: 'Japonais', value: 'ja' },
  { label: 'Coréen', value: 'ko' },
  { label: 'Arabe', value: 'ar' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Turc', value: 'tr' },
  { label: 'Grec', value: 'el' },
  { label: 'Polonais', value: 'pl' },
  { label: 'Tchèque', value: 'cs' },
  { label: 'Slovaque', value: 'sk' },
  { label: 'Hongrois', value: 'hu' },
  { label: 'Bulgare', value: 'bg' },
  { label: 'Danois', value: 'da' },
  { label: 'Finnois', value: 'fi' },
  { label: 'Norvégien', value: 'no' },
  { label: 'Suédois', value: 'sv' },
  { label: 'Roumain', value: 'ro' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Basque', value: 'eu' },
  { label: 'Galicien', value: 'gl' },
  { label: 'Hébreu', value: 'he' },
  { label: 'Indonésien', value: 'id' },
  { label: 'Malais', value: 'ms' },
  { label: 'Thaï', value: 'th' },
  { label: 'Vietnamien', value: 'vi' }
];
const translateText = () => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/translate`,
    data: {
      text: text,
      language: selectedLanguage,
    },
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Text translated successfully");
      alert("Texte traduit")
    }
  });

};

const [feed, setFeed] = useState("");
const [showFeed, setShowFeed] = useState(false);

const [showReveil, setShowReveil] = useState(false);

const [alarmTime, setAlarmTime] = useState('');
const [alarmType, setAlarmType] = useState('');
const [alarms, setAlarms] = useState([]);

const addAlarm = async () => {
  if(alarmHour === '' || alarmMinute === '') {
    alert("L'heure de l'alarme ne peut pas être vide");
    return;
  }

  try {
    const q = await axios.post(`http://${config.URL}:5000/api/addReveil`, {
      time: alarmHour+":"+alarmMinute
    });
    if(q.data.result == "success") {
   setAlarmHour('00');
    setAlarmMinute('00');

    fetchAlarms(); 
    }
 else if(q.data.result == "already") {

      alert("Vous avez déjà un reveil a cette heure")
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'alarme :', error);
  }
};
const removeAlarm = async (time) => {
  try {
    const q = await axios.post(`http://${config.URL}:5000/api/removeReveil`, {
      time: time
    });
    if(q.data.result == "success") {
    fetchAlarms();
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'alarme :', error);
  }
};


const fetchAlarms = async () => {
  try {
    const response = await axios.get(`http://${config.URL}:5000/api/getReveil`);
  
    setAlarms(response.data.result);
  } catch (error) {
    console.error('Erreur lors de la récupération des alarmes :', error);
  }
};

useEffect(() => {
  fetchAlarms();
}, []);








const hours = [...Array(24)].map((_, hour) => hour.toString().padStart(2, '0'));
const minutes = [...Array(60)].map((_, minute) => minute.toString().padStart(2, '0'));

const [alarmHour, setAlarmHour] = useState('00');
const [alarmMinute, setAlarmMinute] = useState('00');




const [qcmTitle, setQcmTitle] = useState('');
  const [qcmQuestions, setQcmQuestions] = useState([]);
  const [showQcm, setShowQcm] = useState(false);

   const addQuestion = () => {
    setQcmQuestions([...qcmQuestions, { question: '', options: [{ text: '', isCorrect: false }] }]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...qcmQuestions];
    updatedQuestions[index].question = updatedQuestion;
    setQcmQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...qcmQuestions];
    updatedQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQcmQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, updatedOption) => {
    const updatedQuestions = [...qcmQuestions];
    updatedQuestions[questionIndex].options[optionIndex].text = updatedOption;
    setQcmQuestions(updatedQuestions);
  };

  const toggleCorrectAnswer = (questionIndex, optionIndex) => {
    const updatedQuestions = [...qcmQuestions];
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = !updatedQuestions[questionIndex].options[optionIndex].isCorrect;
    setQcmQuestions(updatedQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...qcmQuestions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQcmQuestions(updatedQuestions);
  };




  const fetchQcms = async () => {
    try {
      const response = await axios.get(`http://${config.URL}:5000/api/getQuestions`);
      let used = []
      response.data.result.map((q) => {
      
        if(!used.includes(q[2])) {
          used.push(q[2])
        }
     
      })
      setQcms(used);
    } catch (error) {
      console.error('Erreur lors de la récupération des QCMs :', error);
    }
  }


  const validateQ = () => {
    if(qcmTitle === '') {
      alert("Le titre du QCM ne peut pas être vide");
      return;
    }
    if(qcmQuestions.length === 0) {
      alert("Le QCM ne peut pas être vide");
      return;
    }
    if(qcmQuestions.some(q => q.question === '')) {

      alert("Les questions du QCM ne peuvent pas être vides");
      return;
    }
    if(qcmQuestions.some(q => q.options.some(o => o === ''))) {
      alert("Les options du QCM ne peuvent pas être vides");
      return;
    }
    if(qcmQuestions.some(q => q.options.length < 2)) {
      alert("Les questions du QCM doivent avoir au moins 2 options");
      return;
    }
    
    console.log('QCM validé :', { title: qcmTitle, questions: qcmQuestions });




    for(let i = 0; i < qcmQuestions.length; i++) {
   
      axios({
        method: 'post',
        url: `http://${config.URL}:5000/api/addQuestion`,
        data: {
          titre: qcmTitle,
          question: qcmQuestions[i].question,
          choix: JSON.stringify(qcmQuestions[i].options)
        }
    })

    }
    fetchQcms();
  }
   
const [qcms, setQcms] = useState([]);


const [showTaches, setShowTaches] = useState(false);


const [task, setTask] = useState('');

const [categories, setCategories] = useState([]);


const [selectedCategory, setSelectedCategory] = useState('');

const addTask = () => {
  if(task === '') {
    alert("La tâche ne peut pas être vide");
    return;
  }
  if(selectedCategory === '') {
    alert("La catégorie ne peut pas être vide");
    return;
  }
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/addTask`,
    data: {
      name: task,
      category: selectedCategory,
    },
  }).then((response) => {
    if(response.data.result == "success") {
      console.log("Task added successfully");
    alert("Tâche ajoutée avec succès") 
  
  
  }
  }
  )

}

const removeCategory = (categoryName) => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/removeCategory`,
    data: { name: categoryName },
  }).then((response) => {
    if (response.data.result === 'success') {
      console.log('Category deleted successfully');
      
      fetchCategories();
    }
  }).catch((error) => {
    console.error('Error deleting category: ', error);
  });
};
const [newCategory, setNewCategory] = useState('');
const createCategory = () => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/addCategory`,
    data: { name: newCategory },
  }).then((response) => {
    if (response.data.result === 'success') {
      console.log('Category created successfully');
      setNewCategory('');
    }
  }).catch((error) => {
    console.error('Error creating category: ', error);
  });
};

useEffect(() => {
  fetchCategories();
  
}, [])
const [moveCategory, setMoveCategory] = useState('');
const handleMoveCategory = (concernedTask, fromCategory) => {
  if(moveCategory === '') {
    alert("La catégorie ne peut pas être vide");
    return;
  }
  if(fromCategory === '') {
    alert("La catégorie de destination ne peut pas être vide");
    return;
  }
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/moveTask`,
    data: {
      name: concernedTask,
      fromCategory: fromCategory,
      toCategory: moveCategory,
    },
  }).then((response) => {
    if(response.data.result == "success") {
      handleCloseModal()
      setMoveCategory('');
      console.log("Category moved successfully");
    }
  }
  )
}

const [showLed, setShowLed] = useState(false)
const [white, setWhite] = useState(false)
const [blue, setBlue] = useState(false)
const [blinkWhite, setBlinkWhite] = useState(false)
const [blinkBlue, setBlinkBlue] = useState(false)

const [alternate, setAlternate] = useState(false)

const [mixed, setMixed] = useState(false)
const handleWhite = () => {
  axios({
    method: "POST",
    url: `http://${config.URL}:5000/api/manageLeds`,
    data: {
      "light": "white",
      "mode": white ? "off": "on"
    }
  })
setAlternate(false);
setBlue(false)
setBlinkBlue(false)
setBlinkWhite(false)
setWhite(!white)

  
}
const handleBlue = () => {
  axios({
    method: "POST",
    url: `http://${config.URL}:5000/api/manageLeds`,
    data: {
      "light": "blue",
      "mode": blue ? "off": "on"
    }
  })
setAlternate(false);
setBlue(!blue)
setBlinkBlue(false)
setBlinkWhite(false)
setWhite(false)

  
}

const handleBlinkWhite = () => {
  axios({
    method: "POST",
    url: `http://${config.URL}:5000/api/manageLeds`,
    data: {
      "light": "white",
      "mode": blinkWhite ? "stop_blink":"blink"
    }
  })
setAlternate(false);
setBlue(false)
setBlinkBlue(false)
setBlinkWhite(!blinkWhite)
setWhite(false)

  
}
const handleBlinkBlue = () => {
  axios({
    method: "POST",
    url: `http://${config.URL}:5000/api/manageLeds`,
    data: {
      "light": "blue",
      "mode": blinkBlue ? "stop_blink": "blink"
    }
  })
setAlternate(false);
setBlue(false)
setBlinkBlue(!blinkBlue)
setBlinkWhite(false)
setWhite(false)

  
}

const handleAlternate = () => {
  axios({
    method: "POST",
    url: `http://${config.URL}:5000/api/manageLeds`,
    data: {
      "light": "",
      "mode": alternate ? "stop_alternate":"alternate"
    }
  })
setAlternate(!alternate);
setBlue(false)
setBlinkBlue(false)
setBlinkWhite(false)
setWhite(false)

  
}

const handleMixed = () => {
  axios({
    method: "POST",
    url: `http://${config.URL}:5000/api/manageLeds`,
    data: {
      "light": "",
      "mode": mixed ? "stop_mixed":"mixed"
    }
  })
setAlternate(false);
setBlue(false)
setBlinkBlue(false)
setBlinkWhite(false)
setWhite(false)
setMixed(!mixed)
  
}

const [showNotes, setShowNotes] = useState(false);





const [tradText, setTradText] = useState('');
const [correctedText, setCorrectedText] = useState('');
const [corrections, setCorrections] = useState({});
const correctText = () => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/correctText`,
    data: {
      text: tradText,
      lang: "fr-FR"
    },
  }).then((response) => {
   
    setCorrectedText(response.data.corrected_text);
    setCorrections(response.data.corrections);
  

  });
}
const [showAddCommand, setShowAddCommand] = useState(false); 

const [command, setCommand] = useState('');
const [response, setResponse] = useState('');

const [commands, setCommands] = useState([]);


const fetchCommands = async() => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getCommands`,
  }).then((response) => {
    setCommands(response.data.result);
  });
}



const createCommand = () => {
  if(command === '') {
    alert("La commande ne peut pas être vide");
    return;
  }
  if(response === '') {
    alert("La réponse ne peut pas être vide");
    return;
  }

  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/addCommand`,
    data: {
      name: command,
      reply: response,
    },
  }).then((r1) => {
    
if(r1.data.result == "success") {

      setCommands([...commands, { name: command, reply: response, uuid: r1.data.uuid }]);
      setCommand('');
      setResponse('');
}
  }
  )
}
const deleteCommand = (commandUuid) => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/deleteCommand`,
    data: { uuid: commandUuid },
  }).then((response) => {
    if (response.data.result === 'success') {
      console.log('Command deleted successfully');
      setCommands(commands.filter(c => c.uuid !== commandUuid));
    }
  }).catch((error) => {
    console.error('Error deleting command: ', error);
  });
}
useEffect(() => {
  fetchCommands();
}
, []);




const fetchFileInfo = async(f) => {

  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/fileInfo`,
    data: {
      file_path: `./uploads/info/${f}`
    }
  }).then((response) => {

    setFileInfo(response.data);
  });
}




const [showCalendrier, setShowCalendrier] = useState(false);
const [markedDates, setMarkedDates] = useState({});

const getRappels = async() => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getEvents`,
  }).then((response) => {

    let d = {}
    for(let i = 0; i < response.data.result.length; i++) {
      d[response.data.result[i][1]] = {marked: true, dotColor: response.data.result[i][2]};
    }
  
    setMarkedDates(d)

    
   
  });
}
const removeRappel = async(text, date) => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/removeRappel`,
    data: {
      text: text,
      date: date
    }
  }).then((response) => {
    if(response.data.result == "success") {
      getRappels();
      window.location.reload()
    }
  });
}
const [currentDayDate, setCurrentDayDate] = useState('');

const addRappel = async() => {
  if(currentDay === '' || rappelText === '') {
    alert("Le texte du rappel ne peut pas être vide");
    return;
  }

  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/addRappel`,
    data: {
      text: rappelText,
      date: currentDayDate,
      color: colorDay
    }
  }).then((response) => {
    if(response.data.result == "success") {
     let cpy = {...currentDay}
     console.log(currentDay)
      setColorDay('');
      setRappelText('');
      window.location.reload()
    }
  });
}
const [rappelText, setRappelText] = useState('');
const [colorDay, setColorDay] = useState('');
useEffect(() => {
  getRappels()
}, [])

const [showPopupDate, setShowPopupDate] = useState(false);

const [currentDay, setCurrentDay] = useState({});

  return (


    <SafeAreaView style={styles.container}>
      <ScrollView>
    {Platform.OS === 'ios' && <View style={styles.banner}></View>} 



    {hasFinishedStarter || processFinished ? (
      <View style={styles.container}>

      <Button title="Calendrier" onPress={() => {
 setShowFileInfo(false)

 setFicheMaker(false);
 setShowMeteo(false);
 setShowMusique(false);
 setShowFichiers(false);
 setShowTimeTable(false)
 setShowQcm(false)
 setShowChronometre(false)
 setShowTraducteur(false);
 setShowMinuteur(false);
 setShowEditTimeTable(false)
 setShowReveil(false)
 setShowEditPPTimeTable(false)
 setShowFeed(false)
 setShowTaches(false)
 setShowLed(false)
 setShowNotes(false)
 setShowCorrecteur(false)
 setShowAddCommand(false)
 setShowCalendrier(true)
      }} />
        
      <Button title="Informations fichier" onPress={() => {
        setShowFileInfo(true)
        setShowCalendrier(false)
setFicheMaker(false);
setShowMeteo(false);
setShowMusique(false);
setShowFichiers(false);
setShowTimeTable(false)
setShowQcm(false)
setShowChronometre(false)
setShowTraducteur(false);
setShowMinuteur(false);
setShowEditTimeTable(false)
setShowReveil(false)
setShowEditPPTimeTable(false)
setShowFeed(false)
setShowTaches(false)
setShowLed(false)
setShowNotes(false)
setShowCorrecteur(false)
setShowAddCommand(false)
      }} />


        <Button title="Commandes" onPress={() => {
setFicheMaker(false);
setShowMeteo(false);
setShowMusique(false);
setShowFichiers(false);
setShowTimeTable(false)
setShowQcm(false)
setShowChronometre(false)
setShowTraducteur(false);
setShowMinuteur(false);
setShowEditTimeTable(false)
setShowReveil(false)
setShowEditPPTimeTable(false)
setShowFeed(false)
setShowTaches(false)
setShowLed(false)
setShowNotes(false)
setShowCorrecteur(false)
setShowAddCommand(true)
setShowFileInfo(false)
setShowCalendrier(false)
        }} />
        <Button title="Correcteur" onPress={() => {
           setFicheMaker(false);
           setShowMeteo(false);
           setShowMusique(false);
           setShowFichiers(false);
           setShowTimeTable(false)
           setShowQcm(false)
           setShowChronometre(false)
           setShowTraducteur(false);
           setShowMinuteur(false);
           setShowEditTimeTable(false)
           setShowReveil(false)
           setShowEditPPTimeTable(false)
           setShowFeed(false)
           setShowTaches(false)
           setShowLed(false)
           setShowNotes(false)
           setShowCorrecteur(true)
           setShowFileInfo(false)
           setShowCalendrier(false)
setShowAddCommand(false)
        }} /> 
        
                <Button title="Notes" onPress={() => {
          setFicheMaker(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowFichiers(false);
          setShowTimeTable(false)
          setShowQcm(false)
          setShowChronometre(false)
          setShowTraducteur(false);
          setShowMinuteur(false);
          setShowEditTimeTable(false)
          setShowReveil(false)
          setShowEditPPTimeTable(false)
          setShowFeed(false)
          setShowTaches(false)
          setShowLed(false)
          setShowNotes(true)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
        }
        } />

        <Button title="Leds" onPress={() => {
 setShowFileInfo(false)
 setShowCalendrier(false)
setFicheMaker(false);
 setShowMeteo(false);
 setShowMusique(false);
  setShowFichiers(false);
  setShowTimeTable(false)
  setShowQcm(false)
setShowChronometre(false)
setShowTraducteur(false);
setShowMinuteur(false);
setShowEditTimeTable(false)
setShowReveil(false)
setShowEditPPTimeTable(false)
setShowFeed(false)
setShowTaches(false)
setShowLed(true)
setShowNotes(false)
setShowCorrecteur(false)
setShowAddCommand(false)
        }} />

        <Button title="Tâches" onPress={() => {
 setFicheMaker(false);
setShowLed(false)
 setShowMeteo(false);
 setShowMusique(false);
  setShowFichiers(false);
  setShowTimeTable(false)
  setShowQcm(false)
setShowChronometre(false)
setShowTraducteur(false);
setShowMinuteur(false);
setShowEditTimeTable(false)
setShowReveil(false)
setShowEditPPTimeTable(false)
setShowFeed(false)
setShowTaches(true)
setShowCorrecteur(false)
setShowNotes(false)
setShowAddCommand(false)
setShowFileInfo(false)
setShowCalendrier(false)
        }} />
        <Button title="Fiche" onPress={() => {
          setFicheMaker(true);
          setShowLed(false)
          setShowTaches(false)
          setShowMeteo(false);
          setShowMusique(false);
           setShowFichiers(false);
           setShowTimeTable(false)
           setShowQcm(false)
         setShowChronometre(false)
         setShowTraducteur(false);
         setShowMinuteur(false);
         setShowEditTimeTable(false)
         setShowReveil(false)
         setShowEditPPTimeTable(false)
         setShowFeed(false)
         setShowNotes(false)
         setShowCorrecteur(false)
         setShowAddCommand(false)
         setShowFileInfo(false)
         setShowCalendrier(false)

        }} />

        <Button title="Météo" onPress={() => {
           setShowMeteo(true);
           setShowMusique(false);
            setShowFichiers(false);
            setShowTimeTable(false)
            setShowTraducteur(false);
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          setShowEditTimeTable(false)
          setShowReveil(false)
         setShowFeed(false)
          setShowEditPPTimeTable(false)
          setShowQcm(false)
          setShowTaches(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
        }} />
 <Button title="Musique" onPress={() => {
           setShowMusique(true);
            setShowMeteo(false);
            setShowFichiers(false);
            setShowTimeTable(false)
            setFicheMaker(false);
          setShowChronometre(false)
          setShowTaches(false)
          setShowMinuteur(false);
          setShowQcm(false)
         setShowFeed(false)
          setShowEditTimeTable(false)
          setShowTraducteur(false);
          setShowReveil(false)
          setShowEditPPTimeTable(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
        }} />
        <Button title="Fichiers" onPress={() => {
          setShowFichiers(true);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false)
          setShowTaches(false)
         setShowFeed(false)
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          setShowReveil(false)
          setShowEditTimeTable(false)
          setShowTraducteur(false);
          setShowEditPPTimeTable(false)
          setShowQcm(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
        }} />
        <Button title="Emploi du temps" onPress={() => {
          setShowTimeTable(true);
          setShowMeteo(false);
          setShowMusique(false);
          setShowFichiers(false);
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          setShowTraducteur(false);
          setShowEditTimeTable(false)
          setShowEditPPTimeTable(false)
          setShowFeed(false)
          setShowReveil(false)
          setShowQcm(false)
          setShowTaches(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
        }} />
            <Button title="Modifier emploi du temps" onPress={() => {
          setShowTimeTable(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowFichiers(false);
          setShowChronometre(false)
          setFicheMaker(false);
          setShowMinuteur(false);
          setShowReveil(false)
         setShowFeed(false)
          setShowEditTimeTable(false)
          setShowEditPPTimeTable(true)
          setShowTraducteur(false);
          setShowQcm(false)
          setShowTaches(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
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
          setShowReveil(false)
         setShowFeed(false)
          setShowEditPPTimeTable(false)
          setShowTraducteur(false);
          setShowQcm(false)
          setShowTaches(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
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
          setShowReveil(false)
         setShowFeed(false)
          setShowEditPPTimeTable(false)
          setShowTraducteur(false);
          setShowQcm(false)
          setShowTaches(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
        }
        } />
        <Button title="Traducteur" onPress={() => {
          setShowFichiers(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false);
          setShowMinuteur(false);
          setShowChronometre(false);
          setShowTraducteur(true);
          setFicheMaker(false);
          setShowEditTimeTable(false)
          setShowReveil(false)
         setShowFeed(false)
          setShowEditPPTimeTable(false)
          setShowQcm(false)
          setShowTaches(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)
        }}
         />
         <Button title="Feed" onPress={() => {
          setShowFichiers(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false);
          setShowFichiers(false);
          setShowMeteo(false);
          setShowMusique(false);
          setShowTimeTable(false);
          setShowMinuteur(false);
          setShowChronometre(false);
          setShowTraducteur(false);
          setFicheMaker(false);
          setShowEditTimeTable(false)
          setShowTaches(false)
         setShowFeed(true)
          setShowEditPPTimeTable(false)
          setShowQcm(false)
          setShowReveil(false)
          setShowLed(false)
          setShowNotes(false)
          setShowCorrecteur(false)
          setShowAddCommand(false)
          setShowFileInfo(false)
          setShowCalendrier(false)

         }}
          />
          <Button title="Reveil" onPress={() => {
  setShowFichiers(false);
  setShowMeteo(false);
  setShowMusique(false);
  setShowTimeTable(false);
  setShowFichiers(false);
  setShowMeteo(false);
  setShowMusique(false);
  setShowTimeTable(false);
  setShowMinuteur(false);
  setShowChronometre(false);
  setShowTraducteur(false);
  setFicheMaker(false);
  setShowEditTimeTable(false)
  setShowQcm(false)
 setShowFeed(false)
  setShowEditPPTimeTable(false)
setShowReveil(true)
setShowTaches(false)
setShowLed(false)
setShowNotes(false)
setShowCorrecteur(false)
setShowAddCommand(false)
setShowFileInfo(false)
setShowCalendrier(false)
}} />
          <Button title="QCM" onPress={() => {
             setShowFichiers(false);
             setShowMeteo(false);
             setShowMusique(false);
             setShowTimeTable(false);
             setShowFichiers(false);
             setShowMeteo(false);
             setShowMusique(false);
             setShowTimeTable(false);
             setShowMinuteur(false);
             setShowChronometre(false);
             setShowTraducteur(false);
             setFicheMaker(false);
             setShowEditTimeTable(false)
             setShowTaches(false)
            setShowFeed(false)
             setShowEditPPTimeTable(false)
           setShowReveil(false)
           setShowQcm(true)
           fetchQcms();
           setShowLed(false)
           setShowNotes(false)
           setShowCorrecteur(false)
           setShowAddCommand(false)
           setShowFileInfo(false)
           setShowCalendrier(false)
           
           
           }} />







           {showCalendrier && (
            <View style={styles.popupContainer}>
              <View style={styles.popupHeader}>
<Text style={styles.headerText}>
Calendrier
  </Text>
  <Pressable onPress={() => setShowCalendrier(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
                </View>
                <View style={styles.popupMain}>
<Calendar 
onDayPress={(day) => {
  
  
  setShowPopupDate(true); 
  axios({
    method: "post",
    url: `http://${config.URL}:5000/api/getRappels`,
    data: {
      date: day.dateString
    }
  }).then((res) => {
    setCurrentDay(res.data.result)
  })

setCurrentDayDate(day.dateString)
}} 
markedDates={markedDates}

/>
      
                  </View>


                  {showPopupDate && (
  <ScrollView style={{background: "black", position: "absolute", zIndex:99, left: 0, right: 0, top: 0, bottom: 0}}>
      <View style={{display: "flex", padding: "15px", borderTopRightRadius: "15px", borderTopLeftRadius: "15px", alignItems: "center"}}>
        <Pressable style={{alignSelf: "flex-end", background: "red"}} onPress={() => setShowPopupDate(false)}>
<FontAwesomeIcon icon={faX} size={20} style={{color: "white"}} />
</Pressable>
        </View>

        <View style={{display: "flex", flexDirection: "column", gap: "15px", background: "white", borderRadius: "15px", padding: "15px"}}>
                          <Text style={styles.text}>Ajouter un rappel :</Text>
                           <TextInput
                            style={styles.textInput}
                            value={rappelText}
                            onChangeText={setRappelText}
                            placeholder="Texte du rappel"
                          />
                          <TextInput
                            style={styles.textInput}
                            value={colorDay}
                            onChangeText={setColorDay}
                            placeholder="Couleur du rappel"
                          />

                          <Button title="Ajouter" onPress={addRappel} />

                        </View>
  


                  {currentDay.length > 0 && (
                    <View style={styles.popupMain}>
                      <Text style={{ fontSize: 18, marginBottom: 10 }}>Rappels :</Text>
                      <FlatList
                        data={currentDay}
                        keyExtractor={item => item[0]}
                        renderItem={({ item }) => (
                          <View style={{display: "flex", flexDirection: "column", gap: "15px", background: "white", borderRadius: "15px", padding: "15px"}}>
                            <Text style={styles.text}>Rappel : {item[0]}</Text>
                            <Text style={styles.text}>Heure : {item[1]}</Text>
                            <Text style={styles.text}>Couleur : {item[2]}</Text>
                            <TouchableOpacity onPress={() => removeRappel(item[0], item[1])}>
                              <Text style={styles.removeButton}>Supprimer</Text>
                            </TouchableOpacity>
                          
                       
                          </View>
                        )}
                        
                      />
                      
                    </View>
                  )}
    

    </ScrollView>
)}

              </View>
           )
           
           
           
           }

{showFileInfo && (
  <View style={styles.popupContainer}>
  <View style={styles.popupHeader}>
    <Text style={styles.headerText}>Informations fichier</Text>
    <Pressable onPress={() => setShowFileInfo(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
  </View>
  <View style={styles.popupMain}>

  {infosFiles.length > 0 && (
    <View style={styles.popupMain}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Fichiers existants :</Text>
      <FlatList
        data={infosFiles}
        keyExtractor={item => item.file}
        renderItem={({ item }) => (
          <Pressable onPress={() => fetchFileInfo(item.file)}>
          <View style={{display: "flex", flexDirection: "column", gap: "15px", background: "white", borderRadius: "15px", padding: "15px"}}>
            <Text style={styles.text}>Nom : {item.file}</Text>
        
          </View>
          </Pressable>
          
        )}
      />
      {Object.values(fileInfo).length > 0 && (
        <View style={styles.popupMain}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Informations :</Text>
          <Text style={styles.text}>Nombre de caractères : {fileInfo.nbChars}</Text>
          <Text style={styles.text}>Nombre de mots : {fileInfo.nbWords}</Text>
          <Text style={styles.text}>Nombre de phrases : {fileInfo.nbSentences}</Text>
          <Text style={styles.text}>Temps de lecture nécessaire : </Text>
          <Text style={styles.text}>Lent : {fileInfo.timeFormat[0]}</Text>
          <Text style={styles.text}>Elocution : {fileInfo.timeFormat[1]}</Text>
          <Text style={styles.text}>Rapide : {fileInfo.timeFormat[2]}</Text>

          </View>
      )}

      </View>
  )}


      
    </View>
    </View>


)}

{showAddCommand && (
  <View style={styles.popupContainer}>
  <View style={styles.popupHeader}>
    <Text style={styles.headerText}>Ajouter une commande</Text>
    <Pressable onPress={() => setShowAddCommand(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
  </View>
  <View style={styles.popupMain}>
    <TextInput
      style={styles.textInput}
      value={command}
      onChangeText={setCommand}
      placeholder="Commande"
    />
    <TextInput
      style={styles.textInput}
      value={response}
      onChangeText={setResponse}
      placeholder="Réponse"
    />
    <Button title="Ajouter" onPress={createCommand} />
  </View>
  {commands.length > 0 && (
    <View style={styles.popupMain}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Commandes existantes :</Text>
      <FlatList
        data={commands}
        keyExtractor={item => item.uuid}
        renderItem={({ item }) => (
          <View style={{display: "flex", flexDirection: "column", gap: "15px"}}>
            <Text style={styles.text}>Nom : {item.name}</Text>
            <Text style={styles.text}>Réponse : {item.reply}</Text>
            <TouchableOpacity onPress={() => deleteCommand(item.uuid)}>
              <Text style={styles.removeButton}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )}

</View>
)}


{showCorrecteur && (
  <View style={styles.popupContainer}>
  <View style={styles.popupHeader}>
    <Text style={styles.headerText}>Correcteur</Text>
    <Pressable onPress={() => setShowCorrecteur(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
  </View>
  <View style={styles.popupMain}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>Entrez le texte à corriger :</Text>
    <TextInput
      style={styles.textInput}
      value={tradText}
      onChangeText={setTradText}
      placeholder="Entrez le texte"
    />
  
    <Button title="Corriger" onPress={correctText} />

  </View>
  {correctedText !== '' && (
    <View style={styles.popupMain}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Texte corrigé :</Text>
      <Text style={styles.text}>{correctedText}</Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Corrections :</Text>
      <Text style={styles.text}>{JSON.stringify(corrections)}</Text>
      </View>
  )}

</View>

)}
          {showNotes && (
          <View style={styles.containerTable}>
          <Text style={styles.titleTable}>Notes des Matières</Text>
          <FlatList
            data={grades}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.matiere}>{item.matiere}</Text>
                <TextInput
                  style={styles.inputTable}
                  value={String(item.grade)}
                  editable={!item.locked}
                  onChangeText={(value) => handleGradeChange(item.id, value)}
                  keyboardType="numeric"
                />
                <Text style={styles.coefficient}>Coefficient: {item.coefficient}</Text>
                <Switch
                  value={item.locked}
                  onValueChange={(value) => {
                    handleLockedChange(item.id, value);
                  }}
                />
                {!item.locked && (
                  <Text style={styles.minimumGrade}>
                    Note min: {calculateMinimumGrade(item)}
                  </Text>
                )}
                <TouchableOpacity onPress={() => removeMatiere(item.id)}>
                  <Text style={styles.removeButton}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.average}>Moyenne Générale: {calculateGeneralAverage()}</Text>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Moyenne Voulue:</Text>
            <TextInput
              style={styles.inputTable}
              value={desiredAverage}
              onChangeText={(value) => {
                setDesiredAverage(value);
                checkDesiredAverageAttainability();
                updateMinimumGrades();
              }}
              keyboardType="numeric"
            />
          </View>
          {!isDesiredAverageAttainable && (
            <Text style={styles.warning}>Moyenne souhaitée non atteignable avec les résultats verrouillés actuels</Text>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputTable}
              placeholder="Nouvelle Matière"
              value={newMatiere}
              onChangeText={setNewMatiere}
            />
            <TextInput
              style={styles.inputTable}
              placeholder="Coefficient"
              value={newCoefficient}
              onChangeText={setNewCoefficient}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.inputTable}
              placeholder="Note"
              value={newGrade}
              onChangeText={setNewGrade}
              keyboardType="numeric"
            />
            <Button title="Ajouter" onPress={addMatiere} />
          </View>
        </View>
        
          )}
{

showLed && (
  <View style={styles.popupContainer}>
  <View style={styles.popupHeader}>
    <Text style={styles.headerText}>Gérer les leds</Text>
    <Pressable onPress={() => setShowLed(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
  </View>
  
<Button title={blue ? "Bleu : ON": "Bleu : OFF"} onPress={handleBlue} />
<Button title={white ? "Blanc : ON": "Blanc : OFF"} onPress={handleWhite} />
<Button title={blinkBlue ? "Clignotte Bleu : ON": "Clignotte bleu : OFF"} onPress={handleBlinkBlue} />
<Button title={blinkWhite ? "Clignotte blanc : ON": "Clignotte blanc : OFF"} onPress={handleBlinkWhite} />
<Button title={alternate ? "Alterné : ON": "Alterné : OFF"} onPress={handleAlternate} />
<Button title={mixed ? "Mixé : ON": "Mixé : OFF"} onPress={handleMixed} />

</View>


)
}












{showTaches && (
  <View style={styles.popupContainer}>
    <View style={styles.popupHeader}>
      <Text style={styles.headerText}>Tâches</Text>
      <Pressable onPress={() => setShowTaches(false)}>
        <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
      </Pressable>
    </View>
    <View style={styles.popupMain}>

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
  <Text style={{ fontSize: 18, marginBottom: 10 }}>Ajouter une catégorie :</Text>
  <TextInput

    style={styles.textInput}
    value={newCategory}
    onChangeText={setNewCategory}
    placeholder="Entrez la catégorie"
  />
  <Button onPress={createCategory} title="Ajouter la catégorie" />

  </View>


      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Ajouter une tâche :</Text>
        <TextInput
          style={styles.textInput}
          value={task}
          onChangeText={setTask}
          placeholder="Entrez la tâche"
        />
        <Picker
          selectedValue={selectedCategory}
          style={{ height: 50, width: 150, marginBottom:15 }}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          {categories.map((category) => (
            <Picker.Item key={category[0]} label={category[0]} value={category[0]} />
          ))}
        </Picker>
        <Button onPress={addTask} title="Ajouter la tâche" />
        <Text style={{ fontSize: 18, marginTop: 20 }}>Liste des tâches :</Text>
        <View>
          {categories.map((category) => (
            <View key={category[0]} style={styles.category}>
               <View style={styles.categoryHeader}>
                      <Text style={styles.categoryTitle}>{category[0]}</Text>
                      <Pressable onPress={() => removeCategory(category[0])}>
                        <FontAwesomeIcon icon={faTrash} size={20} color="red" />
                      </Pressable>
                    </View>
              {tasks.length > 0 &&
                tasks.find(t => t.category === category[0])?.tasks.map((t) => (
                  <View key={t.name} style={styles.task}>
                    <Text style={styles.taskTitle}>{t.name}</Text>
                    <Pressable onPress={() => {
                      axios({
                        method: 'post',
                        url: `http://${config.URL}:5000/api/removeTask`,
                        data: { name: t.name, category: category[0] }
                      }).then((response) => {
                        if (response.data.result === "success") {
                          console.log("Task deleted successfully");
                          fetchCategories();
                        }
                      }).catch((error) => {
                        console.error("Error deleting task: ", error);
                      });
                    }}>
                   
                      <FontAwesomeIcon icon={faTrash} size={20} color="red" />
                    </Pressable>
                    <Button title="Déplacer" onPress={handleOpenModal} />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Catégorie vers laquelle vous souhaitez déplacer ?</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de la catégorie"
            value={moveCategory}
            onChangeText={setMoveCategory}
          />
          <View style={styles.buttonContainer}>
            <Button title="Annuler" onPress={handleCloseModal} />
            <Button title="Déplacer" onPress={() => handleMoveCategory(t.name, category[0])} />
          </View>
        </View>
      </Modal>
                  </View>
                ))
              }
            </View>
          ))}
        </View>
      </View>
    </View>
  </View>
)}


          {showQcm && (
                 <View style={styles.container}>
                 <View style={styles.header}>
                   <Text style={styles.headerText}>Créer un QCM</Text>
                   <Pressable onPress={() => setShowQcm(false)}>
                     <FontAwesomeIcon style={styles.closeIcon} icon={faX} size={20} />
                   </Pressable>
                 </View>
                 <View style={styles.main}>
                   <View style={styles.qcmContainer}>
                     <Text style={styles.label}>Titre du QCM</Text>
                     <TextInput
                       style={styles.input}
                       value={qcmTitle}
                       onChangeText={setQcmTitle}
                       placeholder="Entrez le titre du QCM"
                     />
                     <Button title="Ajouter une question" onPress={addQuestion} />
                     <ScrollView style={styles.questionsContainer}>
                       {qcmQuestions.map((question, questionIndex) => (
                         <View key={questionIndex} style={styles.questionContainer}>
                           <Text style={styles.label}>Question {questionIndex + 1}</Text>
                           <TextInput
                             style={[styles.input, styles.questionInput]}
                             value={question.question}
                             onChangeText={(text) => updateQuestion(questionIndex, text)}
                             placeholder="Entrez la question"
                           />
                           <View style={styles.optionsContainer}>
                             {question.options.map((option, optionIndex) => (
                               <View key={optionIndex} style={styles.optionContainer}>
                                 <TextInput
                                   style={[styles.input, styles.optionInput]}
                                   value={option.text}
                                   onChangeText={(text) => updateOption(questionIndex, optionIndex, text)}
                                   placeholder="Entrez une option"
                                 />
                                 <Pressable onPress={() => toggleCorrectAnswer(questionIndex, optionIndex)}>
                                   <View style={[styles.checkbox, { backgroundColor: option.isCorrect ? '#4CAF50' : '#eee' }]}>
                                     {option.isCorrect && <Text style={styles.checkboxCheck}>✓</Text>}
                                   </View>
                                 </Pressable>
                                 <Button title="Supprimer l'option" onPress={() => deleteOption(questionIndex, optionIndex)} />
                               </View>
                             ))}
                             <Button title="Ajouter une option" onPress={() => addOption(questionIndex)} />
                           </View>
                           <Button title="Supprimer la question" onPress={() => deleteQuestion(questionIndex)} />
                         </View>
                       ))}
                     </ScrollView>
                     <Button title="Valider le QCM" onPress={validateQ} />
                   </View>
                 </View>

                       <View>
                        {qcms.map((qcm) => (
                          <View key={qcm} style={styles.qcm}>
                            <Text style={styles.qcmTitle}>{qcm}</Text>
                            <Pressable onPress={() => {
                              axios({
                                method: 'post',
                                url: `http://${config.URL}:5000/api/removeQcm`,
                                data: {
                                 
                                  titre: qcm
                                },
                              }).then((response) => {
                                if(response.data.result == "success") {
                                  console.log("QCM deleted successfully");
                                  fetchQcms();
                                }
                              }
                              )
                            }}>
                              <FontAwesomeIcon icon={faTrash} size={20} color="red" />
                            </Pressable>
                          </View>
                        ))}

                        </View>


               </View>
          )}


{showReveil && (
  <View style={styles.popupContainer}>
  <View style={styles.popupHeader}>
    <Text style={styles.headerText}>Reveil</Text>
    <Pressable onPress={() => setShowReveil(false)}>
      <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
    </Pressable>
  </View>
  <View style={styles.popupMain}>


  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
  <Text style={{ fontSize: 18, marginBottom: 10 }}>Ajouter une alarme :</Text>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Picker
    style={{ height: 50, width: 100, marginRight: 10 }}
    selectedValue={alarmHour}
    onValueChange={(itemValue, itemIndex) => setAlarmHour(itemValue)}
  >
    {hours.map((hour) => (
      <Picker.Item key={hour} label={hour} value={hour} />
    ))}
  </Picker>
  <Text>:</Text>
  <Picker
    style={{ height: 50, width: 100, marginLeft: 10 }}
    selectedValue={alarmMinute}
    onValueChange={(itemValue, itemIndex) => setAlarmMinute(itemValue)}
  >
    {minutes.map((minute) => (
      <Picker.Item key={minute} label={minute} value={minute} />
    ))}
  </Picker>
</View>
  <Button onPress={addAlarm} title="Ajouter l'alarme" />
  <Text style={{ fontSize: 18, marginTop: 20 }}>Liste des alarmes :</Text>
  <FlatList
    data={alarms}
    renderItem={({ item }) => (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, background: "white", borderRadius: "15px", padding: "15px", marginTop: "10px" }}>
        <Pressable onPress={() => removeAlarm(item[0])}>
          <FontAwesomeIcon icon={faTrash} size={20} color="red" />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <FontAwesomeIcon icon={faClock} size={20}  />
          <Text style={{ marginLeft: 5 }}>{item[0]}</Text>
        </View>
      </View>
    )}
    keyExtractor={item => item.time}
    style={{ width: '100%', display: "flex", gap: "15px", flexDirection: "column" }}
  />
  </View>




  </View>
  </View>
  )}


     {showFeed && (
        <View style={styles.popupContainer}>
        <View style={styles.popupHeader}>
          <Text style={styles.headerText}>Feed</Text>
          <Pressable onPress={() => setShowFeed(false)}>
            <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
          </Pressable>
        </View>
        <TextInput
        style={styles.textInput}
        placeholder="Entrez le feed"
        onChangeText={setFeed}
        value={feed}
      />
      <Button title="Envoyer" onPress={() => {
        axios({
          method: 'post',
          url: `http://${config.URL}:5000/api/addFeed`,
          data: {
            url: feed,
          },
        }).then((response) => {
          if(response.data.result == "success") {
            console.log("Feed sent successfully");
            alert("Feed envoyé")
          } else if(response.data.result == "already") {
            alert("Vous êtes déjà abonné a ce feed")
          
          } else if(response.data.result == "invalid") {
            alert("Feed invalide")
          
          }
        }
        )
      }} />
      </View>
     )}


{

  showTraducteur && (
    <View style={styles.popupContainer}>
    <View style={styles.popupHeader}>
      <Text style={styles.headerText}>Traduire un texte</Text>
      <Pressable onPress={() => setShowTraducteur(false)}>
        <FontAwesomeIcon style={{ color: "white" }} icon={faX} size={20} />
      </Pressable>
    </View>
    <TextInput
    style={styles.textInput}
    placeholder="Entrez le texte à traduire"
    onChangeText={setText}
    value={text}
  />
  <Picker
    selectedValue={selectedLanguage}
    style={styles.picker}
    onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
  >
    {languages.map((language) => (
      <Picker.Item key={language.value} label={language.label} value={language.value} />
    ))}
  </Picker>
  <Button title="Traduire" onPress={translateText} />
  


  </View>
  

  )
}



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
        {fiches.map((fiche) => (
          <View key={fiche} style={{display: "flex", justifyContent: "space-between", padding: "15px", borderRadius: "15px", backgroundColor:"white", marginTop: "15px"}}>
            <Text style={styles.ficheTitle}>{fiche.title}</Text>
            <Pressable onPress={() => {
              axios({
                method: 'post',
                url: `http://${config.URL}:5000/api/removeFiche`,
                data: {
                  titre: fiche.title
                },
              }).then((response) => {
                if(response.data.result == "success") {
                  console.log("Fiche deleted successfully");

                  fetchFiches();
                }
              }
              )
            }}>
              <FontAwesomeIcon icon={faTrash} size={20} color="red" />
            </Pressable>
          </View>
        ))}

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
 <Button title="Crée un dossier" onPress={handleOpenModal} />
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
      
   <View key={id} style={styles.fileContainer}>
  
   <FontAwesomeIcon icon={faFile} size={20} style={styles.fileIcon} />
   <Text style={styles.fileName}>{element}</Text>
   <TouchableOpacity onPress={() => {
     axios({
       method: 'post',
       url: `http://${config.URL}:5000/api/removeFile`,
       data: {
         folder_name: folder,
         file_name: element,
       },
     }).then((response) => {
       if(response.data.result === "success") {
         fetchHierarchy();
         setFichiers(fichiers.filter((file) => file !== element));
         setFolder("");
         
       }
     });
   }}>
     <FontAwesomeIcon icon={faX} size={20} style={styles.removeIcon} />
   </TouchableOpacity>
 </View>
    ))}
   <Button title="Ajouter un fichier" onPress={pickFile} />
      {file && <Button title="Uploads le fichier" onPress={() => uploadFile(folder)} />}
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
    top: '0%',
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

},
headerText: {
  color: 'white',
  fontSize: 18,
},
closeIcon: {
  color: 'black',
},
main: {
  flex: 1,
  padding: 10,
},
qcmContainer: {
  backgroundColor: 'white',
  padding: 10,
  borderRadius: 5,
  elevation: 3,
},
label: {
  fontWeight: 'bold',
  marginBottom: 5,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 8,
  marginBottom: 10,
},
questionsContainer: {
  maxHeight: 300,
},
questionContainer: {
  marginBottom: 20,
},
questionInput: {
  minHeight: 50,
},
optionsContainer: {
  marginBottom: 10,
},
optionContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 5,
},
optionInput: {
  flex: 1,
  marginRight: 5,
},
radio: {
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#ddd',
},
checkbox: {
  width: 20,
  height: 20,
  borderRadius: 3,
  borderWidth: 2,
  borderColor: '#ddd',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 5,
},
checkboxCheck: {
  color: 'white',
  fontSize: 14,
},
fileContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 15,
  backgroundColor: '#f0f0f0',
  marginBottom: 10,
  borderRadius: 8,
},
fileIcon: {
  marginRight: 10,
  color: '#333',
},
fileName: {
  fontSize: 16,
  flex: 1,
  color: '#333',
},
removeIcon: {
  color: 'red',
},
category: {
  backgroundColor: 'white',
  padding: 10,
  borderRadius: 5,
  marginBottom: 10,
},
categoryTitle: {
  fontWeight: 'bold',
  marginBottom: 5,
},
task: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 5,
},
taskText: {
  flex: 1,
},
qcm: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 5,
},
categoryHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

containerTable: {
  flex: 1,
  padding: 20,
  backgroundColor: '#fff',
},
titleTable: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
},
row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
matiere: {
  flex: 1,
  fontSize: 16,
},
inputTable: {
  width: 50,
  height: 40,
  borderColor: '#000',
  borderWidth: 1,
  textAlign: 'center',
  marginRight: 10,
},
coefficient: {
  fontSize: 16,
  marginRight: 10,
},
minimumGrade: {
  fontSize: 16,
  color: 'red',
},
removeButton: {
  fontSize: 16,
  color: 'blue',
},
average: {
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 20,
},
inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
},
label: {
  fontSize: 16,
  marginRight: 10,
},
warning: {
  fontSize: 16,
  color: 'red',
  marginTop: 10,
},

}
);

export default App;
