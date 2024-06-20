import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Pressable, SafeAreaView, Platform, ScrollView, Alert, FlatList, Switch, Image, Touchable,  Clipboard

   } from 'react-native';

import io from 'socket.io-client';
import config from './assets/config.json';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faVoicemail, faX, faEdit, faFolder, faClock, faTrash, faFile, faCalendar, faTerminal, faTasks, faLightbulb, faHome, faCog, faExchange, faPlus, faArrowUp, faArrowDown, faPlay, faStop, faPause, faPlayCircle, faCopy, faUpload, faUndo, faCalendarCheck, faSpellCheck, faLanguage, faClose, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import RNPickerSelect from 'react-native-picker-select'
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import {Calendar} from 'react-native-calendars';
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
    
      <View style={{
        backgroundColor: '#ECEFF1',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        display:"flex",
        flexDirection:"column",
        gap:15
      }}>

<Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>Section {index + 1}</Text>

<Text style={{fontSize: 16, marginBottom: 5}}>Type</Text>

        <RNPickerSelect

          style={styles}
          value={data.type}
          onValueChange={(value) => updateSection(data.id, 'type', value)}
          items={[
            { label: 'Théorème', value: 'theoreme' },
            { label: 'Définition', value: 'definition' },
            { label: 'Exemple', value: 'exemple' },
            { label: 'Propriété', value: 'propriete'},
            { label: 'Texte', value: 'texte'}

          ]}
        />

<Text style={{fontSize: 16, marginBottom: 5}}>Titre</Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
          }}
          value={data.title}
          onChangeText={(text) => updateSection(data.id, 'title', text)}
          placeholder="La trigonométrie"
        />
  <Text style={{fontSize: 16, marginBottom: 5}}>Contenu</Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
            height: 100,
            textAlignVertical: 'top', // for multiline input
          }}
          value={data.content}
          onChangeText={(text) => updateSection(data.id, 'content', text)}
          placeholder="cos²(x) + sin²(x) = 1"
          multiline
        />
  
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>

        <Pressable onPress={() => deleteSection(data.id)} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5}}>
          <FontAwesomeIcon icon={faTrash} size={24} style={{color: "#FF6254"}} />
        </Pressable>


          {index > 0 && (
            <Pressable onPress={() => moveSection(index, index - 1)} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5}}>
              <FontAwesomeIcon icon={faArrowUp} size={24} style={{color: "#6FDDE8"}} />

            </Pressable>

          )}
          {index < totalSections - 1 && (
            <Pressable onPress={() => moveSection(index, index + 1)} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5}}>
              <FontAwesomeIcon icon={faArrowDown} size={24} style={{color: "#6FDDE8"}}/>
            </Pressable>

          )}
        </View>
      </View>
    )
};





const App = () => {



const [showFileInfo, setShowFileInfo] = useState(false);

const [showCorrecteur, setShowCorrecteur] = useState(false);


  const [grades, setGrades] = useState([]);
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



  const [hasFinishedStarter, setHasFinishedStarter] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [name, setName] = useState("");
  const [voicePreference, setVoicePreference] = useState("");

  const [showMeteo, setShowMeteo] = useState(false);
  const [city, setCity] = useState("");
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
        setFiches(response.data.result);
      })
    
    }





const [currentCity, setCurrentCity] = useState("");
const fetchCity = () => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getCity`,
  }).then((response) => {
    setCurrentCity(response.data.result);
  });

  
}

useEffect(() => {
fetchCity()
}, [])


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
  

const [translation, setTranslation] = useState({
  intialText: "",
  translatedText: "",
  
});

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
      showToastI("success", "Bienvenue", "Bonjour, bienvenue sur FlowBot !")
      socket.emit('message', {from: "mobile", message: "mobile_connected"});
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('message', (message) => {
      let type = message["type"];

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

      } else if(type == "feeds_update") {
        fetchFeeds()
      } else if(type == "translation") {
        setTranslation({initialText: message["initialText"], translatedText: message["translatedText"]})
      }

      console.log('Message received: ' + message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const handleNextQuestion = () => {
    if (currentQuestionIndex === 0 && !name) {
      showToastI("error", "Nom vide", "Le nom ne peut pas être vide")
      return;
    } else if (currentQuestionIndex === 1 && !voicePreference) {
      showToastI("error", "Voix vide", "La voix ne peut pas être vide")
     return;
    } else {
   
      if (currentQuestionIndex < data.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
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
    if(city === "") {
      showToastI("error", "Ville vide", "La ville ne peut pas être vide")
      return;
    }
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/changeCity`,
      data: {
        city: city,
      },

    }).then((response) => {
      if(response.data.result == "success") {
        const socket = io(`http://${config.URL}:5000`);
        socket.emit('message', {from: "mobile", message: "city_changed", city: city});
        showToastI("success", "Ville changée",  "La ville a été changée avec succès")
        setCurrentCity([city])
      }
    
    
    })
   
    
    setShowMeteo(false);
  };
  const handleChangeMusic = () => {
    if(!music) {
      showToastI("error", "Musique vide", "Le nom de la musique ne peut pas être vide")
      return;
    }
    
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/playAudio`,
      data: {
        query: music,
      },
    }).then((response) => {
      if(response.data.result == "success") {
        showToastI("success", "Musique jouée", "La musique a été jouée avec succès")
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
        showToastI("success", "Musique en pause", "La musique a été mise en pause avec succès")
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
        showToastI("success", "Musique reprise", "La musique a été reprise avec succès")
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
        showToastI("success", "Musique arrêtée", "La musique a été arrêtée avec succès")
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
      showToastI("success", "Volume changé", "Le volume a été changé avec succès")
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
      showToastI("error", "Nom de dossier invalide", "Le nom du dossier ne doit pas contenir d'espaces ou de caractères spéciaux")
    
    } else if(file["assets"][0]["name"].includes("/") || file["assets"][0]["name"].includes("\\") || file["assets"][0]["name"].includes(" ")) {
      showToastI("error", "Nom de fichier invalide", "Le nom du fichier ne doit pas contenir d'espaces ou de caractères spéciaux")
  
    } else {

formData.append('folder', encodeURIComponent(folder))

    await axios.post(`http://${config.URL}:5000/api/download`, formData);
    showToastI("success", "Fichier téléchargé", "Le fichier a été téléchargé avec succès")

   setFile(null);
   setFolder("");
   
    }
  } catch (error) {
    showToastI("error", "Erreur", "Erreur lors du téléchargement du fichier")
  }
};


const deleteFolder = async(f) => {
  axios({
    method: "post",
    url: `http://${config.URL}:5000/api/deleteFolder`,
    data: {
      folder:f
    }
  }).then((res) => {
    if(res.data.result == "success") {
      showToastI("success", "Dossier supprimé", "Le dossier a été supprimé avec succès")

    } else if(res.data.result == "reserved") {
      showToastI("error", "Dossier réservé", "Vous ne pouvez pas supprimer ce dossier")

    }
  })
}

const [showTimeTable, setShowTimeTable] = useState(false);
let [nomDay, setNomDay] = useState("");
let [from, setFrom] = useState("0:00");
let [to, setTo] = useState("0:00");
let [day, setDay] = useState("");

const handleAddDay = () => {
  if(nomDay === "" || from === "" || to === "" || day === "") {
   showToastI("error", "Champs vides", "Tous les champs doivent être remplis")
    
    return;
  }
  if(parseInt(from.split(":")[0]) > parseInt(to.split(":")[0])) {
    showToastI("error", "Heure de début supérieure à l'heure de fin", "L'heure de début ne peut pas être supérieure à l'heure de fin")
    return;
  }
  if(parseInt(from.split(":")[0]) == parseInt(to.split(":")[0])) {
    showToastI("error", "Heure de début supérieure à l'heure de fin", "L'heure de début ne peut pas être supérieure à l'heure de fin")
    return;
  }
  if(parseInt(from.split(":")[0]) == parseInt(to.split(":")[0]) && parseInt(from.split(":")[1]) >= parseInt(to.split(":")[1])) {

    showToastI("error", "Heure de début supérieure à l'heure de fin", "L'heure de début ne peut pas être supérieure à l'heure de fin")
    return;
  }
  

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
      showToastI("success", "Jour ajouté", "Le jour a été ajouté avec succès")
      
    } else if(response.data.result == "already_name") {
      showToastI("error", "Jour déjà existant", "Un jour avec ce nom existe déjà")
    } else if(response.data.result == "already_date") {
      showToastI("error", "Heures déjà prises", "Les heures choisies sont déjà prises")
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
      showToastI("success", "Chronomètre démarré", "Le chronomètre a été démarré avec succès")

    } else {
      showToastI("error", "Problème", "Un chronomètre est déjà en cours")
    
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
      showToastI("success", "Chronomètre arrêté", "Le chronomètre a été arrêté avec succès")

    } else {
      showToastI("error", "Problème", "Aucun chronomètre n'est en cours")
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
      showToastI("success", "Chronomètre en pause", "Le chronomètre a été mis en pause avec succès")

    } else {
      showToastI("error", "Problème", "Aucun chronomètre n'est en cours")
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
      showToastI("success", "Chronomètre repris", "Le chronomètre a été repris avec succès")

    } else {
      showToastI("error", "Problème", "Aucun chronomètre n'est en pause")
    
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
      showToastI("success", "Minuteur démarré", "Le minuteur a été démarré avec succès")

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
      showToastI("success", "Minuteur arrêté", "Le minuteur a été arrêté avec succès")

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
      showToastI("success", "Minuteur en pause", "Le minuteur a été mis en pause avec succès")

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
      showToastI("success", "Minuteur repris", "Le minuteur a été repris avec succès")

    }
  }
  )
}


const [elements, setElements] = useState([]);
    
  
 
  
const timeSlots = Array.from(Array(25).keys());

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
  if(modifyNomDay === "" || modifyDay === "" || modifyFrom === "" || modifyTo === "") {
    showToastI("error", "Champs vides", "Tous les champs doivent être remplis")
    return;
  }
  if(parseInt(modifyFrom.split(":")[0]) > parseInt(modifyTo.split(":")[0])) {
    showToastI("error", "Heure de début supérieure à l'heure de fin", "L'heure de début ne peut pas être supérieure à l'heure de fin")
    return;
  }
  if(parseInt(modifyFrom.split(":")[0]) == parseInt(modifyTo.split(":")[0])) {
    showToastI("error", "Heure de début égale à l'heure de fin", "L'heure de début ne peut pas être égale à l'heure de fin")
    
    return;
  }
  if(parseInt(modifyFrom.split(":")[0]) < elements[modifyId].startTime || parseInt(modifyTo.split(":")[0]) > elements[modifyId].endTime) {
    showToastI("error", "Heures invalides", "Les heures ne peuvent pas être en dehors des heures de travail")
    return;
  }
  if(modifyNomDay === elements[modifyId].name && modifyDay === reverse_corr[elements[modifyId].day] && modifyFrom === elements[modifyId].startTime && modifyTo === elements[modifyId].endTime) {
    showToastI("error", "Aucune modification", "Aucune modification n'a été apportée")
    return;
  }
 


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
     showToastI("success", "Jour modifié", "Le jour a été modifié avec succès")
    } else if(response.data.result == "already_name") {
      showToastI("error", "Jour déjà existant", "Un jour avec ce nom existe déjà")
    } else if(response.date.result == "already_date") {
      showToastI("error", "Heures déjà prises", "Les heures choisies sont déjà prises")
    
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
    showToastI("error", "Erreur", "Le nom du dossier ne peut pas être vide")
    return;
  }
  if (!validateFolderName(folderName)) {
    showToastI("error", "Erreur", "Format du nom erroné")
    return;
  }

  try {
    const response = await axios.post(`http://${config.URL}:5000/api/createFolder`, {
      folder_name: folderName
    });

    if (response.status === 200) {
      showToastI("success", "Dossier créé", `Le dossier "${folderName}" a été créé avec succès`)
    } else {
      showToastI("error", "Erreur", `Impossible de créer le dossier: ${response.data.error}`)
    }
  } catch (error) {
    console.error(error);
    showToastI("error", "Erreur", `Impossible de créer le dossier`)
  }

  setFolderName(''); 
  handleCloseModal();
};




const [fiche, setFiche] = useState([]);


const [ficheMaker, setFicheMaker] = useState(false);
const [ficheTitle, setFicheTitle] = useState('');
const [ficheDescription, setFicheDescription] = useState('');
const addSection = () => {
  if(fiche.length > 0 && fiche[fiche.length - 1].title === '' && fiche[fiche.length - 1].content === '') {
    showToastI("error", "Erreur", "La section précédente ne peut pas être vide")
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].title === '') {
    showToastI("error", "Erreur", "Le titre de la section précédente ne peut pas être vide")
   
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].content === '') {
    showToastI("error", "Erreur", "Le contenu de la section précédente ne peut pas être vide")
   
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].title.length > 50) {
    showToastI("error", "Erreur", "Le titre de la section précédente ne peut pas dépasser 50 caractères")
  
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].content.length > 500) {
    showToastI("error", "Erreur", "Le contenu de la section précédente ne peut pas dépasser 500 caractères")
   
    return;
  }
  if(fiche.length > 0 && fiche[fiche.length - 1].type === '') {
    showToastI("error", "Erreur", "Le type de la section précédente ne peut pas être vide")

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
    showToastI("error", "Erreur", "Le titre de la fiche ne peut pas être vide")


    return;
  }
  if(ficheDescription === '') {
    showToastI("error", "Erreur", "La description de la fiche ne peut pas être vide")
 
    return;
  }

  if(fiche.length === 0) {
    showToastI("error", "Erreur", "La fiche ne peut pas être vide")
   
return;
  }
  if(fiche.some(section => section.title === '' || section.content === '')) {
    showToastI("error", "Erreur", "Les sections de la fiche ne peuvent pas être vides")
   
    return;
  }
  if(fiche.some(section => section.title.length > 50)) {
    showToastI("error", "Erreur", "Les titres des sections ne peuvent pas dépasser 50 caractères")
  
    return;
  }
  if(fiche.some(section => section.content.length > 500)) {
    showToastI("error", "Erreur", "Les contenus des sections ne peuvent pas dépasser 500 caractères")
 
    return;
  }
  if(fiche.some(section => section.type === '')) {
    showToastI("error", "Erreur", "Les types des sections ne peuvent pas être vides")
  
    return;
  }

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
      showToastI("success", "Fiche créée", "La fiche a été créée avec succès")

    } else if(res.data.result == "already") {
      showToastI("error", "Erreur", "La fiche existe déjà")
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
      showToastI("success", "Texte traduit", "Le texte a été traduit avec succès")
    }
  });

};

const [feed, setFeed] = useState("");
const [showFeed, setShowFeed] = useState(false);

const [showReveil, setShowReveil] = useState(false);

const [alarms, setAlarms] = useState([]);

const addAlarm = async () => {
  if(alarmHour === '' || alarmMinute === '') {
    showToastI("error", "Erreur", "L'heure de l'alarme ne peut pas être vide")
    return;
  }

  try {
    const q = await axios.post(`http://${config.URL}:5000/api/addReveil`, {
      time: alarmHour+":"+alarmMinute
    });
    if(q.data.result == "success") {
   setAlarmHour('00');
    setAlarmMinute('00');
      showToastI("success", "Alarme ajoutée", "L'alarme a été ajoutée avec succès")
    fetchAlarms(); 
    }
 else if(q.data.result == "already") {
showToastI("error", "Erreur", "Vous avez déjà un reveil a cette heure")
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
    showToastI("success", "Alarme supprimée", "L'alarme a été supprimée avec succès")
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
const deleteQuestion = (questionIndex) => {
    const updatedQuestions = [...qcmQuestions];
    updatedQuestions.splice(questionIndex, 1);
    setQcmQuestions(updatedQuestions);
  }




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
  useEffect(() => {
    fetchQcms()
  }, [])


  const validateQ = () => {
    if(qcmTitle === '') {
      showToastI("error", "Erreur", "Le titre du QCM ne peut pas être vide")
      return;
    }
    if(qcmQuestions.length === 0) {
      showToastI("error", "Erreur", "Le QCM ne peut pas être vide")
      return;
    }
    if(qcmQuestions.some(q => q.question === '')) {
      showToastI("error", "Erreur", "Les questions du QCM ne peuvent pas être vides")

      return;
    }
    if(qcmQuestions.some(q => q.options.some(o => o === ''))) {
      showToastI("error", "Erreur", "Les options du QCM ne peuvent pas être vides")
      return;
    }
    if(qcmQuestions.some(q => q.options.length < 2)) {
      showToastI("error", "Erreur", "Les questions du QCM doivent avoir au moins 2 options")
      return;
    }
    if(qcmQuestions.some(q => q.options.every(o => !o.isCorrect))) {
      showToastI("error", "Erreur", "Chaque question doit avoir au moins une réponse correcte")
      return;
    }

    showToastI("success", "QCM validé", "Le QCM a été validé avec succès")



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
    showToastI("error", "Tâche vide", "La tâche ne peut pas être vide")
    return;
  }
  if(selectedCategory === '') {
    showToastI("error", "Catégorie vide", "La catégorie ne peut pas être vide")
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
      showToastI("success", "Tâche ajoutée", "La tâche a été ajoutée avec succès")
      setTask('');
      setSelectedCategory('');  
  } else if(response.data.result == "already") {
    showToastI("error", "Tâche déjà existante", "La tâche existe déjà")
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
      showToastI("success", "Catégorie supprimée", "La catégorie a été supprimée avec succès")
      
      fetchCategories();
    }
  }).catch((error) => {
    console.error('Error deleting category: ', error);
  });
};
const [newCategory, setNewCategory] = useState('');
const createCategory = () => {
  if(!newCategory) {
    showToastI("error", "Catégorie vide", "La catégorie ne peut pas être vide")
    return;
  }

  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/addCategory`,
    data: { name: newCategory },
  }).then((response) => {
    if (response.data.result === 'success') {
      showToastI("success", "Catégorie ajoutée", "La catégorie a été ajoutée avec succès")
      setNewCategory('');
    } else if(response.data.result === "alreadyexists") {
      showToastI("error", "Catégorie déjà existante", "La catégorie existe déjà")

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
   showToastI("error", "Catégorie vide", "La catégorie de destination ne peut pas être vide")
    return;
  }
  if(fromCategory === '') {
   showToastI("error", "Catégorie vide", "La catégorie de départ ne peut pas être vide")
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
      showToastI("success", "Tâche déplacée", "La tâche a été déplacée avec succès")
    } else if(response.data.result == "destinationcategorynotfound") {
      showToastI("error", "Catégorie inexistante", "La catégorie de destination n'existe pas")
      
    } else if(response.data.result == "already") {
      showToastI("error", "Tâche déjà existante", "La tâche existe déjà dans la catégorie de destination")
    
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
setMixed(false)
  
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
setMixed(false)
  
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
setMixed(false)
  
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
setMixed(false)
  
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
setMixed(false)

  
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
  if(!tradText) {
    showToastI("error", "Texte vide", "Le texte ne peut pas être vide")
    return;
  }
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
    showToastI("success", "Texte corrigé", "Le texte a été corrigé avec succès")
  

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
    showToastI("error", "Commande vide", "La commande ne peut pas être vide")
    return;
  }
  if(response === '') {
    showToastI("error", "Réponse vide", "La réponse ne peut pas être vide")
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
} else if(r1.data.result == "alreadyexists") {
  showToastI("error", "Commande déjà existante", "La commande existe déjà")

  
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
      showToastI("success", "Commande supprimée", "La commande a été supprimée avec succès")
     
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

const getRappels = async () => {
  try {
    const response = await axios.get(`http://${config.URL}:5000/api/getEvents`);
    const result = response.data.result;
    let d = {};

    result.forEach(event => {
      const date = event[1];
      const dotColor = event[2];

      if (!d[date]) {
        d[date] = { dots: [] };
      }
      
      d[date].dots.push({ key: date + dotColor, color: dotColor, selectedDotColor: dotColor });
    });

    setMarkedDates(d);
  } catch (error) {
    console.error("There was an error fetching the events!", error);
  }
};

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
    showToastI("error", "Erreur", "Le texte du rappel ne peut pas être vide")
    return;
  }
  if(colorDay === '') {
    showToastI("error", "Erreur", "La couleur du rappel ne peut pas être vide")
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

      setColorDay('');
      setRappelText('');
      window.location.reload()
    } else if(response.data.result == "already") {
      showToastI("error", "Erreur", "Le rappel existe déjà")
      
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


const showToastI = (type, title, description) => {
  Toast.show({
    type: type,
    text1: title,
    text2: description,
    position: 'bottom',
    visibilityTime: 2000,
    autoHide: true,
    bottomOffset: 100,
  });
};



const handleDeleteTime = (id) => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/deleteDay`,
    data: {
      id: id,
    },
  }).then((response) => {
    if (response.data.result === 'success') {
      showToastI("success", "Jour supprimé", "Le jour a été supprimé avec succès")
      setElements(elements.filter((el) => el.id !== id));
    }
  });
};
 
const handleChangeFeed = () => {
  if(!feed) {
    showToastI("error", "Feed vide", "Le feed ne peut pas être vide")
    return;
  }

  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/addFeed`,
    data: {
      url: feed,
    },
  }).then((response) => {
    if(response.data.result == "success") {
      showToastI("success", "Feed ajouté", "Le feed a été ajouté avec succès")
    } else if(response.data.result == "already") {
      showToastI("error", "Feed déjà existant", "Le feed existe déjà")
    
    } else if(response.data.result == "invalid") {
     showToastI("error", "Feed invalide", "Le feed est invalide")
    
    }
  }
  )
}

const [feeds, setFeeds] = useState([]);

const fetchFeeds = async() => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getFeedsUrl`,
  }).then((response) => {
    setFeeds(response.data.result);
    console.log(response.data.result)
  });
}

const removeFeed = (url) => {
  axios({
    method: 'post',
    url: `http://${config.URL}:5000/api/removeFeed`,
    data: {
      url: url,
    },
  }).then((response) => {
    if (response.data.result === 'success') {
      showToastI("success", "Feed supprimé", "Le feed a été supprimé avec succès")
      fetchFeeds();
    }
  });
}



useEffect(() => {
  fetchFeeds()
}, [])
const [page, setPage] = useState("settings")


const [globalVolume, setGlobalVolume] = useState(0.5);
const [effectsVolume, setEffectsVolume] = useState(0.5);






  return (




    hasFinishedStarter ? (
   
     
    <SafeAreaView>





      
      {Platform.OS === 'ios' && <View style={styles.banner}></View>}



      



      <ScrollView style={{display: "flex", flexDirection: "column",  height:"95%"}}>


<Image 
source={require('./assets/Logo.png')}
style={styles.image}
/>


{ page == "home" ? (

<View>

<View style={{padding: 10}}>



  <View style={styles.titleCategory}>
<Text style={{fontSize: 15}}>
  Organisation
</Text>
</View>

<View style={styles.flexer}>



  <Pressable onPress={() => setShowTimeTable(true)} style={styles.item}>

    <Image source={require('./assets/edt.png')} style={styles.icon} />
    <Text>Emploi du temps</Text>
  </Pressable>

  <Pressable onPress={() => setShowTaches(true)} style={styles.item}>

<Image source={require('./assets/taches.png')}style={styles.icon} />
<Text>Tâches</Text>
</Pressable>
  
<Pressable onPress={() => setShowCalendrier(true)} style={styles.item}>

<Image source={require('./assets/rappels.png')}style={styles.icon} />
<Text>Rappels</Text>
</Pressable>
  


 
</View>









</View>




<View style={{padding: 10}}>



  <View style={styles.titleCategory}>
<Text style={{fontSize: 15}}>
  Révisions
</Text>
</View>

<View style={styles.flexer}>



<Pressable onPress={() => setFicheMaker(true)}style={styles.item}>
    <Image source={require('./assets/fiche.png')} style={styles.icon}/>
    <Text>
      Fiche
    </Text>
  </Pressable>


  <Pressable onPress={() => setShowQcm(true)}style={styles.item}>
    <Image source={require('./assets/quizz.png')} style={styles.icon}/>
    <Text>
      Quizz
    </Text>
  </Pressable>
 
 
</View>






</View>


<View style={{padding: 10}}>



  <View style={styles.titleCategory}>
<Text style={{fontSize: 15}}>
  Temps
</Text>
</View>

<View style={styles.flexer}>



<Pressable onPress={() => setShowChronometre(true)}style={styles.item}>
    <Image source={require('./assets/chronometre.png')} style={styles.icon}/>
    <Text>
      Chronometre
    </Text>
  </Pressable>


  <Pressable onPress={() => setShowMinuteur(true)}style={styles.item}>
    <Image source={require('./assets/minuteur.png')} style={styles.icon}/>
    <Text>
      Minuteur
    </Text>
  </Pressable>
  <Pressable onPress={() => setShowReveil(true)}style={styles.item}>
    <Image source={require('./assets/reveil.png')} style={styles.icon}/>
    <Text>
      Réveil
    </Text>
  </Pressable>
 
</View>






</View>


<View style={{padding: 10}}>



  <View style={styles.titleCategory}>
<Text style={{fontSize: 15}}>
  Général
</Text>
</View>

<View style={styles.flexer}>


<Pressable onPress={() => setShowAddCommand(true)}style={styles.item}>
<Image source={require('./assets/commandes.png')}style={styles.icon} />
    <Text>
      Commandes
    </Text>
  </Pressable>

<Pressable onPress={() => setShowMusique(true)}style={styles.item}>
    <Image source={require('./assets/musique.png')} style={styles.icon}/>
    <Text>
      Musique
    </Text>
  </Pressable>


  <Pressable onPress={() => setShowMeteo(true)}style={styles.item}>
    <Image source={require('./assets/meteo.png')} style={styles.icon}/>
    <Text>
      Météo
    </Text>
  </Pressable>
  <Pressable onPress={() => setShowFeed(true)}style={styles.item}>
    <Image source={require('./assets/news.png')} style={styles.icon}/>
    <Text>
      Feed
    </Text>
  </Pressable>


  <Pressable onPress={() => setShowTraducteur(true)}style={styles.item}>
    <Image source={require('./assets/traducteur.png')} style={styles.icon}/>
    <Text>
      Traducteur
    </Text>
  </Pressable>

  <Pressable onPress={() => setShowCorrecteur(true)}style={styles.item}>
  <Image source={require('./assets/correcteur.png')}style={styles.icon} />
    <Text>
      Correcteur
    </Text>
  </Pressable>


  <Pressable onPress={() => setShowLed(true)}style={styles.item}>
    <Image source={require('./assets/leds.png')}style={styles.icon} />
    <Text>
      Leds
    </Text>
  </Pressable>
</View>






</View>



<View style={{padding: 10}}>



  <View style={styles.titleCategory}>
<Text style={{fontSize: 15}}>
Fichiers
</Text>
</View>

<View style={styles.flexer}>



<Pressable onPress={() => setShowFichiers(true)}style={styles.item}>
    <Image source={require('./assets/fiche.png')} style={styles.icon}/>
    <Text>
      Fichiers
    </Text>
  </Pressable>


 
 
 
</View>




</View>



</View>



) : (
  <View style={{padding:15}}>
     <View style={styles.subtitlePage}>
                <Text style={styles.sizeSubtitlePage}>Paramètres</Text>
                </View>

                
              <View style={{...styles.labelInputBox, marginTop:15}}>

<Text style={styles.labelText}>Sélectionner un réseau</Text>
<RNPickerSelect
      style={styles}
      placeholder={{label: "Sélectionner le réseau", value: null}}
      onValueChange={(value) => value}
      items={[
        {label: "eduroam",value: "eduroam"},
        {label:"ESIEE", value: "ESIEE"}
      ]}
    />
      <View style={{display: "flex", flexDirection: "row"}}>
    <TextInput
                style={{borderColor: '#ccc', 
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  paddingLeft: 10, 
                  backgroundColor: '#fff', 
                  fontSize: 16,
                  color: '#333',
                  alignSelf: "center",
                  padding:10,width:"80%"}}
                placeholder="Saisir le code"
               
              />
 <Pressable onPress={() => {}} style={styles.ctaInput}>
                <FontAwesomeIcon icon={faExchange} size={20} style={{color:"white"}}  />
              </Pressable>

              </View>

</View>
<View style={{...styles.labelInputBox, marginTop:15}}>

<Text style={styles.labelText}>Mélangeur de volume</Text>

<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Global:</Text>
<Slider
    style={{ width: '100%', marginTop: 10 }}
    minimumValue={0}
    maximumValue={1}
    minimumTrackTintColor="#142A4D"
    maximumTrackTintColor="#FFFFFF"
    thumbTintColor="#142A4D"
    value={globalVolume}
    onValueChange={(value) => setGlobalVolume(value)}
  />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Musique:</Text>
<Slider
    style={{ width: '100%', marginTop: 10 }}
    minimumValue={0}
    maximumValue={1}
    minimumTrackTintColor="#142A4D"
    maximumTrackTintColor="#FFFFFF"
    thumbTintColor="#142A4D"
    value={effectsVolume}
    onValueChange={(value) => handleChangeVolume(value)}
  />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Effets:</Text>
<Slider
    style={{ width: '100%', marginTop: 10 }}
    minimumValue={0}
    maximumValue={1}
    minimumTrackTintColor="#142A4D"
    maximumTrackTintColor="#FFFFFF"
    thumbTintColor="#142A4D"
    value={effectsVolume}
    onValueChange={(value) => setEffectsVolume(value)}
  />
</View>
 </View>
    </View>
)}

        </ScrollView>


        {showFichiers && (
    
<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
<View style={styles.header}>

  <Text style={{fontSize: 20}}>Fichiers</Text>
  <Pressable onPress={() => setShowFichiers(false)}>
    <FontAwesomeIcon icon={faX} size={20} />
  </Pressable>

</View>

<View style={styles.insidePage}>


<View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Explorateur de fichiers</Text>
</View>

<View style={{display: "flex", flexDirection: "row", gap: 10, alignItems: "center"}}>
{folder.length == 0 && hierarchy.map((element, id_g) => (
 <Pressable key={id_g} onPress={() => {
  
  setFichiers(element["files"])
  setFolder(element["folder"])

  
  } } style={{...styles.shadowBox, display: "flex", flexDirection: "column", alignItems: "center", padding: 15}}  >
   
   
      
<FontAwesomeIcon icon={faFolder} size={50} />
  <Text>
    {element["folder"]}

  </Text>
  

 </Pressable>
  
))}
 </View>


{folder.length == 0 && (
  <Pressable onPress={handleOpenModal} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
  <FontAwesomeIcon icon={faFolder} size={20} style={{color:"#6FDDE8"}} />
  <Text style={{color:"#6FDDE8", fontSize:20}}>Créer un dossier</Text>
</Pressable>

)}



      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text>Entrez un nom de dossier</Text>
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


   
      

      
{folder.length > 0 && (
  <View>

    <View style={{display:"flex",width:"100%", alignItems:"center",flexDirection:"row",justifyContent:"flex-end",marginBottom:25}}>
    <Pressable onPress={() => {
      setFolder("")
      setFichiers([])
      fetchHierarchy()
    

    }}
    
    style={{backgroundColor:"#142A4D", borderRadius:5,padding:10,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}
    
    >
      <FontAwesomeIcon icon={faUndo} size={20} style={{...styles.fileIcon, color:"#6FDDE8"}} />
      <Text style={{color:"#6FDDE8", fontSize:20}}>Retour</Text>
      </Pressable>

</View>
    {folder.length > 0 && fichiers.length == 0 && (
      <Text style={{fontSize:20, textAlign:"center", marginBottom:20}}>Ce dossier est vide</Text>
    
    )}
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
         showToastI("success", "Fichier supprimé", "Le fichier a été supprimé avec succès")
         
       }
     });
   }}>
     <FontAwesomeIcon icon={faX} size={20} style={styles.removeIcon} />
   </TouchableOpacity>
 </View>
    ))}


<Pressable onPress={pickFile} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
  <FontAwesomeIcon icon={faFile} size={20} style={{color:"#6FDDE8"}} />
  <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter un fichier</Text>
</Pressable>
<Pressable onPress={() => deleteFolder(folder)} style={{backgroundColor: "#142A4D", alignSelf: "flex-end",marginTop:15, padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
  <FontAwesomeIcon icon={faFolder} size={20} style={{color:"#6FDDE8"}} />
  <Text style={{color:"#6FDDE8", fontSize:20}}>Supprimer le dossier</Text>
</Pressable>


      {file && !file.canceled && 
<Pressable onPress={() => uploadFile(folder)} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>

 
  <FontAwesomeIcon icon={faUpload} size={20} style={{color:"#6FDDE8"}} />
  <Text style={{color:"#6FDDE8", fontSize:20}}>Uploads le fichier</Text>
</Pressable>

      }
  </View>
)}

</View>
   
     </ScrollView>
     </SafeAreaView>
    )}


        {showTimeTable && ( 
         
<SafeAreaView style={styles.page}>
  <ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
  <View style={styles.titlePage}>
    <Text style={styles.sizeTitlePage}>Emploi du temps</Text>
    </View>
    <Pressable onPress={() => setShowTimeTable(false)}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
  
  
     
            
              <View style={styles.insidePage}>
  
  
                <View style={styles.subtitlePage}>
                <Text style={styles.sizeSubtitlePage}>Ajouter un élément</Text>
                </View>

              <View style={styles.labelInputBox}>

                <Text style={styles.labelText}>Contenu</Text>
              <TextInput
                style={styles.input}
                placeholder="Exemple : Coder un truc cool"
                value={nomDay}
                onChangeText={setNomDay}
              />

</View>
<View style={styles.labelInputBox}>

              <Text style={styles.labelText}>Jour</Text>
              <RNPickerSelect
                style={styles}
                placeholder={{ label: 'Choisir un jour', value: null 
                }}
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
              </View>

          <View style={{display:"flex",flexDirection:"row",gap:5,alignItems:"center", marginLeft:10}}>

      
              <Text style={styles.labelText}>De</Text>

<View style={{width:100}}>
              <RNPickerSelect
                placeholder={{}}
                style={styles}
                onValueChange={(value) => setFrom(value)}
                items={timeSlots.map((time) => ({
                  label: time != 0 ? `${time-1}:00` : "0:00",
                  value: time != 0 ? time-1 : 0,
                }))}
              />
</View>
           
              


<Text style={styles.labelText}>à</Text>

<View style={{width:100}}>

              <RNPickerSelect
  placeholder={{}}
                style={styles}
                onValueChange={(value) => setTo(value)}
                items={timeSlots.map((time) => ({
                  label: time != 0 ? `${time-1}:00` : "0:00",
                  value: time != 0 ? time-1 : 0,
                }))}
              />
              </View>
        

</View>
             
             <Pressable onPress={handleAddDay} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter</Text>
              </Pressable>
              
              <View style={{display:"flex", flexDirection:"column", gap:15}}>
              <View style={styles.subtitlePage}>
   <Text style={styles.sizeSubtitlePage}>Liste des jours planifiés</Text>

   </View>
   {elements.length == 0 && (
      <Text style={{fontSize:20, textAlign:"center", marginBottom:20}}>Aucun jour n'a été ajouté</Text>
    
   )}
        {elements.map((element) => (
          <View key={element.id} style={{...styles.block}}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <Text style={{color:"white"}}>{element.name}</Text>

            <View style={{display: "flex", flexDirection: "row", gap:5}}>

            <Pressable onPress={() => {
setShowEditTimeTable(true)
setModifyId(element.id)
setModifyNomDay(element.name)
setModifyDay(reverse_corr[element.day])
setModifyFrom(element.startTime)
setModifyTo(element.endTime)
}
}>
          <FontAwesomeIcon icon={faEdit} size={20} style={{color:"#FF8754"}} />
</Pressable>

              <Pressable onPress={() => handleDeleteTime(element.id)}>
                <FontAwesomeIcon icon={faTrash} size={20} style={{color:"#FF6254"}} />
              </Pressable>
            
</View>
            </View>
            <View style={{ display: "flex", width: "100%"}}>

<View style={{alignSelf: "flex-start",borderBottomWidth:2, borderBottomColor: "white"}}>

            <Text style={{color: "white"}}>
              Le {reverse_corr[element.day]}. De {element.startTime}:00 à {element.endTime}:00
            </Text>
            </View>
            </View>
          </View>
        ))}
      </View>
    </View>
        


            




</ScrollView>
          </SafeAreaView>
        
        )}






{ficheMaker && (
      
<SafeAreaView style={styles.page}>
  <ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
 
    <Text style={styles.sizeTitlePage}>Fiches</Text>
 
    <Pressable onPress={() => setFicheMaker(false)}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
  <View style={styles.insidePage}>
  <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Ajouter une fiche</Text>
</View>
<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Titre</Text>
<TextInput
          style={styles.input}
          value={ficheTitle}
          onChangeText={setFicheTitle}
          placeholder="Entrez le titre de la fiche"
        />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Description</Text>
<TextInput
          style={styles.input}
          value={ficheDescription}
          onChangeText={setFicheDescription}
          placeholder="Entrez la description de la fiche"
        />
</View>


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
            <Pressable onPress={addSection} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter une section</Text>
              </Pressable>

            <Pressable onPress={validate} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter la fiche</Text>
              </Pressable>

              <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Liste des fiches</Text>

</View>

{fiches.length == 0 && (
  <Text style={{fontSize:20, textAlign:"center", marginBottom:20}}>Aucune fiche n'a été créée</Text>
)}
{fiches.map((fiche) => (
          <View key={fiche} style={{display: "flex", justifyContent: "space-between", padding: 10, borderRadius: 5, backgroundColor:"white", marginTop: 15, flexDirection: "row", backgroundColor:"#142A4D"}}>
            <Text style={{color:"white"}}>{fiche.title}</Text>
            <Pressable onPress={() => {
              axios({
                method: 'post',
                url: `http://${config.URL}:5000/api/removeFiche`,
                data: {
                  titre: fiche.title
                },
              }).then((response) => {
                if(response.data.result == "success") {
                  showToastI("success", "Fiche supprimée", "La fiche a été supprimée avec succès")
               

                  fetchFiches();
                }
              }
              )
            }}>
              <FontAwesomeIcon icon={faTrash} size={20} color="#FF6254" />
            </Pressable>
          </View>
        ))}
</View>



  
     <View>
   
           
         
           
           
           
        </View>
        

  </ScrollView>
</SafeAreaView>

)}








        {showTaches && (

<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
<View style={styles.header}>

  <Text style={{fontSize: 20}}>Tâches</Text>
  <Pressable onPress={() => setShowTaches(false)}>
    <FontAwesomeIcon icon={faX} size={20} />
  </Pressable>

</View>

<View style={styles.insidePage}>


<View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Ajouter une catégorie :</Text>

</View>
<View>
  <TextInput

    style={{...styles.input, marginLeft:10}}
    value={newCategory}
    onChangeText={setNewCategory}
    placeholder="Entrez la catégorie"
  />

<Pressable onPress={createCategory} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter</Text>
              </Pressable>

  </View>
  <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Ajouter une tâche :</Text>

</View>
<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Tâche</Text>

<TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="Entrez la tâche"
        />

        </View>
        <View style={styles.labelInputBox}>
        <Text style={styles.labelText}>Catégorie</Text>

        <RNPickerSelect
          style={styles}
          placeholder={{ label: 'Choisir une catégorie', value: null }}
          onValueChange={(value) => setSelectedCategory(value)}
          items={categories.map((category) => ({
            label: category[0],
            value: category[0],
          }))}
        />

        

         




</View>

<Pressable onPress={addTask} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter</Text>
              </Pressable>

              <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Liste des tâches</Text>

</View>


   
<View style={{display:"flex",flexDirection:"column", gap:25}}>
  {categories.length == 0 && (
    <Text style={{fontSize:20, textAlign:"center", marginBottom:20}}>Aucune catégorie n'a été créée</Text>
  )}

          {categories.map((category) => (
            <View key={category[0]} style={{ display: "flex", flexDirection: "column", gap: 10}}>
               <View style={{flexDirection: "row", display: "flex", backgroundColor: "#142A4D",padding: 20, borderRadius:5, alignItems: "center"}}>
               <FontAwesomeIcon icon={faFile} style={{color:"#6FDDE8"}}/>  
               <Text style={{color:"white"}}> {category[0]}</Text>

                      <Pressable onPress={() => removeCategory(category[0])} style={{marginLeft: "auto"}}>
                        <FontAwesomeIcon icon={faTrash} size={20} color="#FF6254" />
                      </Pressable>
                    </View>
              {tasks.length > 0 &&
                tasks.find(t => t.category === category[0])?.tasks.map((t) => (
                  <View key={t.name} style={{backgroundColor: "#142A4D",marginLeft:20,borderRadius:5,padding:10, display: "flex", flexDirection: "row", alignItems: "center"}}>
               
               
               <FontAwesomeIcon icon={faTasks} style={{color: "#6FDDE8"}}/>     
               <Text style={{color: "white"}}> {t.name}</Text>


                  <View style={{marginLeft: "auto",  display:"flex",flexDirection:"row", gap: 5}}>

                

                    <Pressable onPress={handleOpenModal}>
                      <FontAwesomeIcon icon={faEdit} size={20} color="#FF8754" />
                    </Pressable>


                    <Pressable onPress={() => {
                      axios({
                        method: 'post',
                        url: `http://${config.URL}:5000/api/removeTask`,
                        data: { name: t.name, category: category[0] }
                      }).then((response) => {
                        if (response.data.result === "success") {
                          showToastI("success", "Tâche supprimée", "La tâche a été supprimée avec succès")
                          fetchCategories();
                        }
                      }).catch((error) => {
                        showToastI("error", "Erreur", "Une erreur est survenue lors de la suppression de la tâche")
                        console.error("Error deleting task: ", error);
                      });
                    }}>
                   
                      <FontAwesomeIcon icon={faTrash} size={20} color="#FF6254" />
                    </Pressable>
                    </View>
                    
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text>Catégorie vers laquelle vous souhaitez déplacer ?</Text>
          <RNPickerSelect
            style={styles}
            placeholder={{ label: 'Choisir une catégorie', value: null }}
            onValueChange={(value) => setMoveCategory(value)}
            items={categories.map((category) => ({
              label: category[0],
              value: category[0],
            }))}
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
    
 
</ScrollView>
</SafeAreaView>
        )}



{showQcm && (
  <SafeAreaView style={styles.page}>
    <ScrollView style={{marginBottom:100}}>


    <View style={styles.header}>

<Text style={{fontSize: 20}}>QCM</Text>
<Pressable onPress={() => setShowQcm(false)}>
  <FontAwesomeIcon icon={faX} size={20} />
</Pressable>

</View>





<View style={styles.insidePage}>


<View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Créer un QCM :</Text>

</View>

<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Titre</Text>
<TextInput
          style={styles.input}
          value={qcmTitle}
          onChangeText={setQcmTitle}
          placeholder="Entrez le titre du QCM"
        />

        <Pressable onPress={addQuestion} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>

              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter une question</Text>
              </Pressable>

</View>





      <View style={{display: "flex", flexDirection: "column",  justifyContent: "center", gap: 15}}>
        
       
        {qcmQuestions.map((question, questionIndex) => (
          <View key={questionIndex} style={{ backgroundColor: '#ECEFF1',
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            display:"flex",
            flexDirection:"column",
            gap:15}}>
            <TextInput
              style={styles.input}
              value={question.question}
              onChangeText={(text) => updateQuestion(questionIndex, text)}
              placeholder="Entrez la question"
            />
  <Pressable onPress={() => addOption(questionIndex)} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter une option</Text>
              </Pressable>



           
            {question.options.map((option, optionIndex) => (
              <View key={optionIndex} style={{display: "flex",flexDirection: "row", gap: 5, alignItems: "center"}}>

                <TextInput
                  style={styles.input}
                  value={option.text}
                  onChangeText={(text) => updateOption(questionIndex, optionIndex, text)}
                  placeholder="Entrez l'option"
                />

<View style={{display: "flex", flexDirection: "row", gap: 5, alignItems: "center"}}>
               
                <Switch 
                
                  value={option.isCorrect}
                  onValueChange={() => toggleCorrectAnswer(questionIndex, optionIndex)}
                />
              
                <Pressable onPress={() => deleteOption(questionIndex, optionIndex)}>
                  <FontAwesomeIcon icon={faTrash} size={20} color="#FF6254" />
                </Pressable>
                </View>
             
              </View>
              
            ))}

<Pressable onPress={() => {
  deleteQuestion(questionIndex)
}}>
                  <FontAwesomeIcon icon={faTrash} size={20} color="#FF6254" />
                </Pressable>
          </View>
        ))}
        <Pressable onPress={validateQ} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>

              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} /> 
                <Text style={{color:"#6FDDE8", fontSize:20}}>Créer le QCM</Text>
              </Pressable>
              
      </View>

      <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Liste des QCM</Text>
</View>
<View>
  {qcms.length == 0 && (
    <Text style={{fontSize: 20, textAlign: "center", marginBottom: 20}}>Aucun QCM</Text>
  
  )}
                        {qcms.map((qcm) => (
                         
                          <View key={qcm} style={{display: "flex", justifyContent: "space-between", padding: 10, borderRadius: 5, backgroundColor:"white", marginTop: 15, flexDirection: "row", backgroundColor:"#142A4D"}}>
                            
                            <Text style={{color:"white"}}>{qcm}</Text>
                            <Pressable onPress={() => {
                              axios({
                                method: 'post',
                                url: `http://${config.URL}:5000/api/removeQcm`,
                                data: {
                                 
                                  titre: qcm
                                },
                              }).then((response) => {
                                if(response.data.result == "success") {
                                  showToastI("success", "QCM supprimé", "Le QCM a été supprimé avec succès")
                                  fetchQcms();
                                }
                              }
                              )
                            }}>
                              <FontAwesomeIcon icon={faTrash} size={20} color="#FF6254" />
                            </Pressable>
                          </View>
                        ))}

                        </View>
      </View>

  
    </ScrollView>
  </SafeAreaView>

)}

{showFileInfo && (
  <SafeAreaView style={{backgroundColor: "white", position: "absolute", right: 0, left: 0, bottom: 0,top: 45
  }}>
    <View style={{display: "flex", justifyContent: "space-between", padding: 25, flexDirection: "row"}}>
      <Text style={{fontSize: 20}}>Fichiers</Text>
      <Pressable onPress={() => setShowFileInfo(false)}>
        <FontAwesomeIcon icon={faX} size={20} />
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
  </SafeAreaView>
)}





{showCalendrier && (
              
<SafeAreaView style={styles.page}>
  <ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
 
    <Text style={styles.sizeTitlePage}>Rappels</Text>
 
    <Pressable onPress={() => setShowCalendrier(false)}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
                </View>
                <View style={styles.insidePage}>

                <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Calendrier</Text>

</View>

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
markingType={'multi-dot'}
/>

      


                  {showPopupDate && (
  <ScrollView>

<View style={{display:"flex",width:"100%", alignItems:"center",flexDirection:"row",justifyContent:"flex-end",marginBottom:25}}>
    <Pressable onPress={() => {
   setShowPopupDate(false)

    }}
    
    style={{backgroundColor:"#142A4D", borderRadius:5,padding:10,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}
    
    >
      <FontAwesomeIcon icon={faClose} size={20} style={{...styles.fileIcon, color:"#6FDDE8"}} />
      <Text style={{color:"#6FDDE8", fontSize:20}}>Fermer</Text>
      </Pressable>

</View>



      

        <View style={{display: "flex", flexDirection: "column", gap: "15px", background: "white", borderRadius: "15px", padding: "15px"}}>
                          
                          
                          <Text style={styles.text}>Ajouter un rappel :</Text>


                          
                          <View style={styles.labelInputBox}>
                            
<Text style={styles.labelText}>Titre</Text>
                           <TextInput
                            style={styles.input}
                            value={rappelText}
                            onChangeText={setRappelText}
                            placeholder="Exemple : Finir les devoirs de mathématiques"
                          />
                          </View>
                          <View style={styles.labelInputBox}>
                          <Text style={styles.labelText}>Couleur</Text>
                          <RNPickerSelect
                            style={styles.input}
                            placeholder={{ label: 'Choisir une couleur', value: null }}
                            onValueChange={(value) => setColorDay(value)}
                            items={[
                              { label: 'Rouge', value: 'red' },
                              { label: 'Bleu', value: 'blue' },
                              { label: 'Vert', value: 'green' },
                              { label: 'Jaune', value: 'yellow' },
                              { label: 'Rose', value: 'pink' },
                              { label: 'Orange', value: 'orange' },
                            ]}
                          />

                          </View>
<Pressable onPress={addRappel} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter</Text>
              </Pressable>

                       </View>
                       <View style={styles.subtitlePage}>
                <Text style={styles.sizeSubtitlePage}>Liste des rappels</Text>
                </View>
{currentDay.length == 0 && (
   
     <Text style={{fontSize:20, textAlign:"center", marginBottom:20}}>Aucun rappel</Text>
   
)}
                  {currentDay.length > 0 && (
                    <View>
                    
                
                
                 <FlatList
                        data={currentDay}
                        keyExtractor={item => item[0]}
                        renderItem={({ item }) => (
                          <View style={{display: "flex", flexDirection: "column", gap: "15px", background: "white", borderRadius: "15px", padding: "15px"}}>
                            <Text style={styles.text}>Rappel : {item[0]}</Text>
                            <Text style={styles.text}>Date : {`${item[1].split("-")[2]}/${item[1].split("-")[1]}/${item[1].split("-")[0]}`}</Text>
                            <Text style={styles.text}>Couleur : {item[2]}</Text>


                            <Pressable onPress={() => removeRappel(item[0], item[1])} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faTrash} size={20} style={{color:"#FF6254"}} />
               
              </Pressable>

                   
                          
                       
                          </View>
                        )}
                        
                      />
                      
                    </View>
                  )}
    

    </ScrollView>
)}
</View>
            </ScrollView>
          </SafeAreaView>


           )
           
           
           
           }



{showAddCommand && (
    
<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
  <View style={styles.titlePage}>
    <Text style={styles.sizeTitlePage}>Commandes</Text>
    </View>
    <Pressable onPress={() => setShowAddCommand(false)} style={{alignSelf: "flex-start"}}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
  <View style={styles.insidePage}>


  <View style={styles.labelInputBox}>
  <Text style={styles.label}>Nom de la commande</Text>
    <TextInput
      style={styles.input}
      value={command}
      onChangeText={setCommand}
      placeholder="Commande"
    />
    </View>
    <View style={styles.labelInputBox}>
    <Text style={styles.label}>Réponse</Text>
    <TextInput
      style={styles.input}
      value={response}
      onChangeText={setResponse}
      placeholder="Réponse"
    />
    </View>

<Pressable onPress={createCommand} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />
                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter</Text>
              </Pressable>




  <View style={styles.subtitlePage}>
   <Text style={styles.sizeSubtitlePage}>Liste des commandes</Text>
   </View>

{commands.length == 0 && (
  <Text style={{color:"white", fontSize:20, textAlign:"center"}}>Aucune commande</Text>

)}
  {commands.length > 0 && (
      <FlatList
        data={commands}
        keyExtractor={item => item.uuid}
        style={{display: "flex", flexDirection: "column",  gap:15,padding:10}}
        renderItem={({ item }) => (
        
          <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",backgroundColor: "#142A4D", padding:10,marginTop:15}}>
            <View style={{display: "flex", flexDirection: "column", gap: 5}}>
            <Text style={{color:"white"}}>Nom : {item.name}</Text>
            <Text style={{color:"white"}}>Réponse : {item.reply}</Text>
            </View>

            <Pressable onPress={() => deleteCommand(item.uuid)} style={{backgroundColor: "#142A4D"}}>
          <FontAwesomeIcon icon={faTrash} size={24} style={{color: "#FF6254"}} />
        </Pressable>

        
          
          </View>
        )}
      />
   
  )}
  </View>
</ScrollView>
</SafeAreaView>
)}


{showCorrecteur && (
  
<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
  <View style={styles.titlePage}>
    <Text style={styles.sizeTitlePage}>Correcteur</Text>
    </View>
    <Pressable onPress={() => setShowCorrecteur(false)} style={{alignSelf: "flex-start"}}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
  
  <View style={styles.insidePage}>


<View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Corrigez un texte</Text>
</View>


<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Texte a corriger</Text>
<TextInput
      style={styles.input}
      value={tradText}
      onChangeText={setTradText}
      placeholder="Entrez le texte"
    />
</View>


    <Pressable onPress={correctText} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
              <FontAwesomeIcon icon={faLanguage} size={20} style={{color:"#6FDDE8"}} />

                <Text style={{color:"#6FDDE8", fontSize:20}}>Corriger</Text>
              </Pressable>

              <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Texte corrigé</Text>
</View>

    {correctedText.length == 0 && (
      <Text style={{fontSize:20, textAlign:"center", marginBottom:20}}>Aucun texte corrigé</Text>
    
    )}
    
  {correctedText !== '' && (

<View style={{borderWidth: 2, borderColor:"#ccc", padding: 10, borderRadius: 5,display:"flex",flexDirection:"column",gap:15}}>
  
  <Pressable onPress={() => {
    Clipboard.setString(correctedText);
    showToastI("success", "Texte copié", "Le texte corrigé a été copié dans le presse-papiers")
  

  }} 
  style={{alignSelf: "flex-end"}}>

  <FontAwesomeIcon icon={faCopy} size={20} style={{alignSelf: "flex-end"}}  />
  </Pressable>
  <Text style={styles.text}>{correctedText}</Text>
  </View>



    
  )}


<View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Corrections</Text>
</View>
{correctedText.length == 0 && (
      <Text style={{fontSize:20, textAlign:"center", marginBottom:20}}>Aucune correction disponible</Text>
    
    )}
{correctedText !== '' && (

<View style={{display: "flex", flexDirection: "column", gap: 15}}>
{console.log(corrections)}
  {Object.keys(corrections).map((key) => (  
    <Text key={key}> 
      {key} &gt; {corrections[key]}
    </Text>
  ))}
</View>


)}
</View>
</ScrollView>
</SafeAreaView>

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
{showLed && (
  
<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
<View style={styles.header}>

  <Text style={{fontSize: 20}}>Leds</Text>
  <Pressable onPress={() => setShowLed(false)}>
    <FontAwesomeIcon icon={faX} size={20} />
  </Pressable>

</View>

<View style={styles.insidePage}>
<View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Gérer les leds</Text>

</View>
<View style={styles.labelInputBox}>
<Text style={styles.label}>Bleu</Text>
<Switch value={blue} onValueChange={handleBlue} />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.label}>Blanc</Text>
<Switch value={white} onValueChange={handleWhite} />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.label}>Clignotte bleu</Text>
<Switch value={blinkBlue} onValueChange={handleBlinkBlue} />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.label}>Clignotte blanc</Text>
<Switch value={blinkWhite} onValueChange={handleBlinkWhite} />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.label}>Alterné</Text>
<Switch value={alternate} onValueChange={handleAlternate} />
</View>
<View style={styles.labelInputBox}>
<Text style={styles.label}>Mixé</Text>
<Switch value={mixed} onValueChange={handleMixed} />

</View>







</View>
</ScrollView>
</SafeAreaView>


)
}














{showReveil && (
  
          
<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
  <View style={styles.titlePage}>
    <Text style={styles.sizeTitlePage}>Réveil</Text>
    </View>
    <Pressable onPress={() => setShowReveil(false)} style={{alignSelf: "flex-start"}}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
  <View style={styles.insidePage}>


  <View style={styles.subtitlePage}>
                <Text style={styles.sizeSubtitlePage}>Ajouter une alarme</Text>
                </View>

  
                <View style={styles.labelInputBox}>
           <Text style={styles.label}>Heures</Text>
           <Picker
           style={{ height: 50, width: 100, marginLeft: 10 }}
           selectedValue={alarmHour}
           onValueChange={(itemValue, itemIndex) => setAlarmHour(itemValue)}
         >
           {hours.map((hour) => (
             <Picker.Item key={hour} label={hour} value={hour} />
           ))}
          </Picker>
          </View>


          <View style={styles.labelInputBox}>
           <Text style={styles.label}>Minutes</Text>
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

          <Pressable onPress={addAlarm} style={{backgroundColor: "#142A4D", alignSelf: "flex-end", padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>

              <FontAwesomeIcon icon={faPlus} size={20} style={{color:"#6FDDE8"}} />

                <Text style={{color:"#6FDDE8", fontSize:20}}>Ajouter</Text>
              </Pressable>
              <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Liste des alarmes</Text>
</View>
{alarms.length == 0 && (
  <Text style={styles.text}>Aucune alarme</Text>
)}
<FlatList
    data={alarms}
    renderItem={({ item }) => (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, background: "white", borderRadius: 5, padding: 15, marginTop: 10,backgroundColor: "#142A4D",borderRadius:5 }}>
        <Pressable onPress={() => removeAlarm(item[0])}>
          <FontAwesomeIcon icon={faTrash} size={20} color="#FF6254" />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <FontAwesomeIcon icon={faClock} size={20} style={{color:"#6FDDE8"}} />
          <Text style={{ marginLeft: 5,color:"#6FDDE8" }}>{item[0]}</Text>
        </View>
      </View>
    )}
    keyExtractor={item => item.time}
    style={{ width: '100%', display: "flex", gap: 15, flexDirection: "column" }}
  />


  

  </View>
  </ScrollView>
  </SafeAreaView>
  )}


     {showFeed && (
       <SafeAreaView style={styles.page}>
       <ScrollView style={{marginBottom:100}}>
       <View style={styles.header}>
      
         <Text style={styles.sizeTitlePage}>Actualités</Text>
      
         <Pressable onPress={() => setShowFeed(false)}>
           <FontAwesomeIcon icon={faX} size={20} />
         </Pressable>
       
       </View>
       <View style={styles.insidePage}>
       <View style={styles.subtitlePage}>
     <Text style={styles.sizeSubtitlePage}>Ajouter un fil d'actualité</Text>
     </View>

     <View style={styles.labelInputBox}>
<Text style={styles.labelText}>Lien flux RSS</Text>
<TextInput
        style={styles.input}
        placeholder="Exemple : https://www.lemonde.fr/rss/une.xml"
        onChangeText={setFeed}
        value={feed}
      />
</View>

      <Pressable onPress={handleChangeFeed} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
        <FontAwesomeIcon icon={faPlus} size={20} style={{color: "#6FDDE8"}} />
        <Text style={{color: "#6FDDE8"}}>Ajouter un feed</Text>
      </Pressable>

      <View style={styles.subtitlePage}>
     <Text style={styles.sizeSubtitlePage}>Liste des fils d'actualités</Text>
     </View>
     {feeds.length == 0 && (
        <Text style={styles.text}>Aucun fil d'actualité</Text>
      
     )}
      {feeds.length > 0 && (
       
       feeds.map((feed) => (
         <View key={feed} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",backgroundColor: "#142A4D", padding:10,marginTop:15}}>
           <Text style={{color:"white"}}>{feed}</Text>
           <Pressable onPress={() => removeFeed(feed)}>
             <FontAwesomeIcon icon={faTrash} size={24} style={{color: "#FF6254"}} />
           </Pressable>
         </View>
       ))
   
   )}
      </View>
     
      </ScrollView>
      </SafeAreaView>
     )}
{showTraducteur && (
   
<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
<View style={styles.header}>

  <Text style={{fontSize: 20}}>Traducteur</Text>
  <Pressable onPress={() => setShowTraducteur(false)}>
    <FontAwesomeIcon icon={faX} size={20} />
  </Pressable>

</View>

<View style={styles.insidePage}>


<View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Traduire un texte</Text>

</View>


<View style={styles.labelInputBox}>
<Text style={styles.label}>Texte à traduire</Text>
    <TextInput
    style={styles.input}
    placeholder="Exemple : Bonjour, je suis Flo"
    onChangeText={setText}
    value={text}
  />
  </View>
  <View style={styles.labelInputBox}>
  <Text style={styles.label}>Langue</Text>
  <Picker
    selectedValue={selectedLanguage}
    style={styles.picker}
    onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
  >
    {languages.map((language) => (
      <Picker.Item key={language.value} label={language.label} value={language.value} />
    ))}
  </Picker>
  </View>

    <Pressable onPress={translateText} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
      <FontAwesomeIcon icon={faPlay} size={20} style={{color: "#6FDDE8"}} />
      <Text style={{color: "#6FDDE8"}}>Traduire</Text>
    </Pressable>
    <View style={styles.subtitlePage}>


</View>


<Text style={styles.sizeSubtitlePage}>Texte traduit</Text>
{translation.translatedText == "" && (
  <Text style={styles.text}>Aucun texte traduit</Text>

)}
{translation.translatedText !== "" && (
  <View style={{borderWidth: 2, borderColor:"#ccc", padding: 10, borderRadius: 5,display:"flex",flexDirection:"column",gap:15}}>
  
  <Pressable onPress={() => {
    Clipboard.setString(translation.translatedText);
    showToastI("success", "Texte copié", "Le texte traduit a été copié dans le presse-papiers")
  

  }} 
  style={{alignSelf: "flex-end"}}>

  <FontAwesomeIcon icon={faCopy} size={20} style={{alignSelf: "flex-end"}}  />
  </Pressable>
  <Text style={styles.text}>{translation.translatedText}</Text>
  </View>
)}

  </View>
  </ScrollView>
  </SafeAreaView>
  

  )
}




        {showMinuteur && (


          
<SafeAreaView style={styles.page}>
<ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
  <View style={styles.titlePage}>
    <Text style={styles.sizeTitlePage}>Minuteur</Text>
    </View>
    <Pressable onPress={() => setShowMinuteur(false)} style={{alignSelf: "flex-start"}}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
  <View style={styles.insidePage}>


  <View style={styles.subtitlePage}>
                <Text style={styles.sizeSubtitlePage}>Créer un minuteur</Text>
                </View>
        <View style={styles.labelInputBox}>
           <Text style={styles.label}>Heures</Text>
           <Picker
            selectedValue={selectedHours}
            onValueChange={(itemValue) => setSelectedHours(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}

          </Picker>
           </View>

           <View style={styles.labelInputBox}>
           <Text style={styles.label}>Minutes</Text>
           <Picker
            selectedValue={selectedMinutes}
            onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}
          </Picker>
           </View>

           <View style={styles.labelInputBox}>
           <Text style={styles.label}>Secondes</Text>
           <Picker
            selectedValue={selectedSeconds}
            onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}
          </Picker>
           </View>

       
           <View style={styles.subtitlePage}>
                <Text style={styles.sizeSubtitlePage}>Gérer un minuteur</Text>
                </View>
            

                <Pressable onPress={handleStartMinuteur} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
          <FontAwesomeIcon icon={faPlay} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Commencer</Text>
        </Pressable>
        <Pressable onPress={handleStopMinuteur} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
         <FontAwesomeIcon icon={faStop} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Stop</Text>
        </Pressable>
        <Pressable onPress={handlePauseMinuteur} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
        <FontAwesomeIcon icon={faPause} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Pause</Text>
        </Pressable>
        <Pressable onPress={handleResumeMinuteur} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
        <FontAwesomeIcon icon={faPlayCircle} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Reprendre</Text>
        </Pressable>



   
</View>
</ScrollView>
        </SafeAreaView>
            
        )
        
        
        
        }

    
 
        {showChronometre && (
         
<SafeAreaView style={styles.page}>
  
  <View style={styles.header}>
  <View style={styles.titlePage}>
    <Text style={styles.sizeTitlePage}>Chronomètre</Text>
    </View>
    <Pressable onPress={() => setShowChronometre(false)} style={{alignSelf: "flex-start"}}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
 

  

  <View style={styles.insidePage}>


       <Pressable onPress={handleStartChronometre} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
          <FontAwesomeIcon icon={faPlay} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Commencer</Text>
        </Pressable>
        <Pressable onPress={handleStopChronometre} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
         <FontAwesomeIcon icon={faStop} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Stop</Text>
        </Pressable>
        <Pressable onPress={handlePauseChronometre} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
        <FontAwesomeIcon icon={faPause} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Pause</Text>
        </Pressable>
        <Pressable onPress={handleResumeChronometre} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
        <FontAwesomeIcon icon={faPlayCircle} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Reprendre</Text>
        </Pressable>





         
</View>
            </SafeAreaView>
        )}



<Modal
     animationType="slide"
     transparent={true}
     visible={showEditTimeTable}
     onRequestClose={() => setShowEditTimeTable(false)}
   >
     <View style={{...styles.modalOverlay}}>
       <View style={styles.popupContainer}>
         <View style={{padding: 15, display:"flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
           <Text style={{fontSize:20}}>Modifier un jour</Text>
           <Pressable onPress={() => setShowEditTimeTable(false)}>
             <FontAwesomeIcon style={{ color: 'black' }} icon={faX} size={20} />
           </Pressable>
         </View>
         <View style={{...styles.popupMain, display: "flex", flexDirection: "column", gap: 10}}>

          <View style={styles.labelInputBox}>
           <Text style={styles.label}>Nom</Text>
           <TextInput
             style={styles.input}
             placeholder="Exemple : Coder un truc cool"
             value={modifyNomDay}
             onChangeText={setModifyNomDay}
           />
           </View>

           <View style={styles.labelInputBox}>

           <Text style={styles.label}>Jour</Text>
           <RNPickerSelect
             placeholder={{}}
             onValueChange={(value) => setModifyDay(value)}
             value={modifyDay}
             style={styles}
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
           </View>

           <View style={styles.labelInputBox}>
            <View style={{display: "flex", flexDirection: "row", gap: 5, alignItems: "center"}}>
                      <Text style={styles.label}>De</Text>
                      <View style={{width:50}}>

           <TextInput
             style={styles.input}
             placeholder="Exemple : 14"
             value={modifyFrom}
             onChangeText={setModifyFrom}
             keyboardType="numeric"
           />
           </View>

           <Text style={styles.label}>à</Text>
           <View style={{width:50}}>
           <TextInput
             style={styles.input}
             placeholder="Exemple : 15"
             value={modifyTo}
             onChangeText={setModifyTo}
             keyboardType="numeric"
           />
           </View>
           </View>
           </View>
          
           <Pressable onPress={handleEditDay} style={{backgroundColor: "#142A4D",  padding: 10, borderRadius:10, gap:5, display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15, flexDirection:"row"}}>
           <FontAwesomeIcon icon={faEdit} size={20} style={{color:"#6FDDE8"}} />
             <Text style={{color:"#6FDDE8", fontSize:20}}>Modifier</Text>
           </Pressable>
         </View>
       </View>
     </View>
   </Modal>












        {showMeteo && ( 



<SafeAreaView style={styles.page}>
  
<View style={styles.header}>
<View style={styles.titlePage}>
  <Text style={styles.sizeTitlePage}>Météo</Text>
  </View>
  <Pressable onPress={() => setShowMeteo(false)} style={{alignSelf: "flex-start"}}>
    <FontAwesomeIcon icon={faX} size={20} />
  </Pressable>

</View>


   
          
            <View style={styles.insidePage}>


              <View style={styles.subtitlePage}>
              <Text style={styles.sizeSubtitlePage}>Changer la localisation</Text>
              </View>

              <View style={{display: "flex", flexDirection: "row", marginLeft:10}}>
              <TextInput
                style={{
                  borderColor: '#ccc', 
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  paddingLeft: 10, 
                  backgroundColor: '#fff', 
                  fontSize: 16,
                  color: '#333',
                  alignSelf: "center",
                  padding:10
                }}
                placeholder="Exemple : Paris"
                value={city}
                onChangeText={setCity}
              />



              <Pressable onPress={handleChangeCity} style={styles.ctaInput}>
                <FontAwesomeIcon icon={faExchange} size={20} style={{color:"white"}}  />
              </Pressable>

              </View>




              <View style={styles.subtitlePage}>
              
              <Text style={styles.sizeSubtitlePage}>Localisation actuelle</Text>
              
              </View>


              <View style={styles.block}>
<Text style={{fontSize: 20, color: "white"}}>{currentCity[0]}</Text>
</View>
                
             
             
            </View>
         


          </SafeAreaView>





        )}

        
        {showMusique && (
             
<SafeAreaView style={styles.page}>
  <ScrollView style={{marginBottom:100}}>
  <View style={styles.header}>
 
    <Text style={styles.sizeTitlePage}>Musique</Text>
 
    <Pressable onPress={() => setShowMusique(false)}>
      <FontAwesomeIcon icon={faX} size={20} />
    </Pressable>
  
  </View>
  <View style={styles.insidePage}>


  <View style={styles.subtitlePage}>
<Text style={styles.sizeSubtitlePage}>Jouer de la musique</Text>




</View>



<View style={styles.labelInputBox}>
<Text style={styles.labelText}>Titre de la musique</Text>
<TextInput
          style={styles.input}
          value={music}
          onChangeText={setMusic}
          placeholder="Eminem Black Magic"
        />
</View>


          <Pressable onPress={handleChangeMusic} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
          <FontAwesomeIcon icon={faPlay} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Jouer</Text>
        </Pressable>
        <Pressable onPress={handlePauseMusic} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
          <FontAwesomeIcon icon={faPause} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Pause</Text>
        </Pressable>
        <Pressable onPress={handleResumeMusic} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
          <FontAwesomeIcon icon={faPlayCircle} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Reprendre</Text>
        </Pressable>
        <Pressable onPress={handleStopMusic} style={{backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
          <FontAwesomeIcon icon={faStop} size={20} style={{color: "#6FDDE8"}} />
          <Text  style={{color: "#6FDDE8"}}>Stop</Text>
        </Pressable>


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
          </ScrollView>
          </SafeAreaView>
        )}
   
    





        <View style={styles.footer}>
        <ToastContainer />
<TouchableOpacity onPress={() => setPage("home")}>
 <FontAwesomeIcon icon={faHome} size={30} style={{color: "black"}}/>
</TouchableOpacity>
<TouchableOpacity onPress={() => setPage("settings")}>
 <FontAwesomeIcon icon={faCog} size={30} style={{color: "black"}}  />
</TouchableOpacity>

</View>



<ToastContainer />


  </SafeAreaView>
     

      
      

    
  ) : (
  

    <SafeAreaView style={styles.questionsContainer}>
    <View style={styles.questionsCard}>
      <FontAwesomeIcon icon={data[currentQuestionIndex].icon} size={50} />
      <Text style={styles.questionTitle}>
        {currentQuestionIndex === 0 ? `Commençons` : `Très bien ${name}`}, {data[currentQuestionIndex].title}
      </Text>
      {data[currentQuestionIndex].type === "text" ? (
        <TextInput
          style={[styles.input]}
          placeholder="Réponse"
          value={name}
          onChangeText={setName}
        />
      ) : (
        data[currentQuestionIndex].options.map((option, index) => (
          <TouchableOpacity key={index} style={styles.radioContainer} onPress={() => {
            
        
            setVoicePreference(option)
          
          }}>
            <Text style={styles.radioText}>
              {voicePreference === option ? '●' : '○'} {option}
            </Text>
          </TouchableOpacity>
        ))
      )}

<Pressable onPress={handleNextQuestion} style={{marginTop: 10, backgroundColor: "#142A4D", padding: 10, borderRadius:5, display:"flex", flexDirection: "row", alignItems: "center", gap:5}}>
          <FontAwesomeIcon icon={faArrowRight} size={20} style={{color: "white"}} />
          <Text  style={{color: "white"}}>Suivant</Text>
        </Pressable>

   
    </View>





  </SafeAreaView>
  
  )
  
  
 

  );
};


const ToastContainer = React.forwardRef((props, ref) => (
  <Toast ref={ref} />
));



const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  android: {
    elevation: 10,
  },
});

const styles = StyleSheet.create({

 
item: {display: "flex", alignItems: "center", flexDirection: "column", gap: 10, width: 75},

icon: {width: 40,height:40},
image: {
  width: "100%",
  height: 110,
  alignSelf: "center"

},
titleCategory:{borderBottomWidth: 2, borderBottomColor: "black", padding: 10},
flexer:{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 25,padding: 25, justifyContent: "space-evenly"},
footer:{display:"flex", alignItems: "center", justifyContent: "space-evenly", backgroundColor: "white", flexDirection:"row",height:"10%",  shadowColor: '#000',
  shadowOffset: { width: 0, height: -5 },
  shadowOpacity: 0.2,
  shadowRadius: 10},


  page: {backgroundColor: "white", position: "absolute", right: 0, left: 0, bottom: 0, top: 45, padding:25},


  header: {display: "flex", justifyContent: "space-between", flexDirection: "row",padding:25},

titlePage: {borderBottomWidth:2,borderColor: "black"},
sizeTitlePage: {fontSize: 20},
insidePage:{padding:25,display:"flex",flexDirection:"column", gap:25},
subtitlePage: {borderLeftWidth: 2, borderColor:"black"},
sizeSubtitlePage:{fontSize: 20, marginLeft: 10},
input: {
  borderColor: '#ccc', 
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5,
  paddingLeft: 10, 
  backgroundColor: '#fff', 
  fontSize: 16,
  color: '#333',
  alignSelf: "center"
},
ctaInput: {backgroundColor: "#142A4D", padding: 10, borderTopRightRadius: 5, borderBottomRightRadius:5,display:"flex",alignItems:"center",justifyContent:"center"},
block:{backgroundColor: "#142A4D", padding: 10, borderRadius:5, marginLeft:10},

inputIOS: {
  fontSize: 16,
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 4,
  color: 'black',
  paddingRight: 30, // to ensure the text is never behind the icon
},
inputAndroid: {
  fontSize: 16,
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderWidth: 0.5,
  borderColor: 'purple',
  borderRadius: 8,
  color: 'black',
  paddingRight: 30, // to ensure the text is never behind the icon
},
placeholder: {
  color: '#ccc',
  fontSize: 16,
},

labelText: {
  color: 'black',
  fontSize:15
},
labelInputBox: {display:"flex", flexDirection: "column", gap:5, marginLeft:10},
popupContainer: {
  position: 'absolute',
  top: '0%',
  left: '50%',
  transform: [{ translateX: -150 }, { translateY: 150 }],
  width: 300,
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor:"white",
  
},

modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  position:"absolute",top:-40, left:-20, right:-20, bottom:-20
},



shadowBox: {

  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  // iOS shadow properties
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3.84,
  // Android shadow property
  elevation: 5,
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
  timetable: {
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
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
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
