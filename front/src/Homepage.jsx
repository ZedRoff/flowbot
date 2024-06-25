import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { faMapPin, faMicrophoneSlash, faPauseCircle, faPhone, faPlayCircle, faWifi, faTools, faBook, faRuler, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Homepage.css";
import icon from "./images/sunny-day.png";
import config from "../../config.json";
import axios from 'axios';

import './Timetable.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.js';
await import('pdfjs-dist/build/pdf.worker.min.js');
import 'pdfjs-dist/web/pdf_viewer.css';
import { useRef } from 'react';
import image from "./images/rerA.png"
import moment from 'moment';
import red from "./images/red.png"
import green from "./images/green.png"
import blue from "./images/blue.png"
import micOn from "./images/mic_on.png"
import micOff from "./images/mic_off.png"
import voiceOn from "./images/voice_on.png"
import voiceOff from "./images/voice_off.png"
import user from "./images/user.png"
import currentvoice from "./images/currentvoice.png"

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const Rappels = ({ data }) => {
  // Grouper les rappels par date
  const groupedByDate = data.reduce((acc, rappel) => {
    const date = rappel[1];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(rappel);
    return acc;
  }, {});

  // Convertir l'objet en tableau pour pouvoir le mapper
  const groupedEntries = Object.entries(groupedByDate).sort(
    (a, b) => new Date(a[0]) - new Date(b[0])
  );

  return (
    <div className="rappels-container">
      {groupedEntries.map(([date, rappels], index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2>{new Date(date).toLocaleDateString()}</h2>
          {rappels.map((rappel, idx) => (
            <div
              key={idx}
              style={{ backgroundColor: rappel[2], padding: '10px', margin: '10px 0', borderRadius: "10px" }}
            >
              <h3>{rappel[0]}</h3>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
const ClockAnalog = () => {
    const [time, setTime] = useState(moment());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(moment());
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    const secondsDegrees = (time.seconds() / 60) * 360;
    const minutesDegrees = (time.minutes() / 60) * 360 + (time.seconds() / 60) * 6;
    const hoursDegrees = (time.hours() % 12) / 12 * 360 + (time.minutes() / 60) * 30;
  
  
    return (
      <div className="clock">
        <div className="hand hour" style={{ transform: `rotate(${hoursDegrees}deg)` }} />
        <div className="hand minute" style={{ transform: `rotate(${minutesDegrees}deg)` }} />
        <div className="hand second" style={{ transform: `rotate(${secondsDegrees}deg)` }} />
      </div>
    );
  };

  const ClockDigital = () => {
    const [time, setTime] = useState(moment());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(moment());
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    const formattedTime = time.format('HH:mm:ss');
  
    return (
        <div className="digital-clock">
        <h2>Horloge</h2>
        <p className="time">{formattedTime}</p>
      </div>
    );
  };


const Homepage = () => {



  useEffect(() => {
    let audio = new Audio("http://www.hochmuth.com/mp3/Haydn_Cello_Concerto_D-1.mp3");
    audio.play();
  }, [])
  const [getC, setGetC] = useState(false);
  const [qcmStartup, setQcmStartup] = useState(false); 
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  let [date, setDate] = useState(`${hours}:${minutes} | ${day}/${month}/${year}`);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      setDate(`${hours}:${minutes} | ${day}/${month}/${year}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  let [currentIndex, setCurrentIndex] = useState(0);

  let [modules, setModules] = useState([
    
    {name: "Enregistrement", description: "Enregistre toi en train de réviser", icon: "mic.png", show: false},
    { name: "Tâches", description: "Organise tes journées en tâches", icon: "taches.png", show: false },
    { name: "Rappels", description: "N'oublie plus rien", icon: "reveil.png", show: false },
    { name: "Quizzs", description: "Teste tes connaissances", icon: "quizz.png", show: false },
    { name: "Météo", description: "La météo de ta ville", icon: "meteo.png", show: false },
    {name: "Musique", description: "Ecoute ta musique préférée", icon: "musique.png", show: false},
    {name: "Emploi du temps", description: "Consulte ton emploi du temps", icon: "edt.png", show: false},
    {name: "Chronometre", description: "Chronomètre toi pendant que tu révises", icon: "chronometre.png", show: false},
    {name: "PDF", description: "Lis tes fichiers PDF", icon: "fichier.png", show: false},
    {name: "Trains", description: "Consulte les horaires de train", icon: "trains.png", show: false},
    {name: "Fiches", description: "Consulte tes fiches de révision", icon: "fiche.png", show: false},
    {name: "Actualités", description: "Consulte les actualités", icon: "news.png", show: false},
    {name: "Réveil", description: "Gère tes réveils", icon: "reveil.png", show: false},
    {name: "Pense Bête", description: "N'oublie plus rien", icon: "pensebete.png", show: false},
    

    
  ]);
  const [pdfs, setPdfs] = useState([]);
  const fetchPDFs = async() => {
      axios({
          method: 'get',
          url: `http://${config.URL}:5000/api/getPDFs`,
      }).then((response) => {
          setPdfs(response.data.pdf_files);
      
          if (response.data.pdf_files.length > 0) {
             
              setPdfName(response.data.pdf_files[0]); 
          }
      });
  }
  let [popup, setPopup] = useState(false);
  const containerRef = useRef(null);
  const elsRef = useRef([]);

  const updateView = () => {
    if (elsRef.current.length === 0) return;

    const elements = elsRef.current;
    elements.forEach((el, index) => {
      el.classList.remove('focused');
      const sepBottom = el.querySelector('.sep_bottom');
      if (sepBottom) {
        sepBottom.style.background = 'white';
      }
      if (index === currentIndex) {
        el.classList.add('focused');
        if (sepBottom) {
          sepBottom.style.background = '#152A4D';
        }
      }
    });

    const focusedEl = elements[currentIndex];
    const elCenter = focusedEl.offsetLeft + focusedEl.offsetWidth / 2;
    const containerCenter = containerRef.current.offsetWidth / 2;
    containerRef.current.scrollTo({
      left: elCenter - containerCenter,
      behavior: 'smooth',
    });
  };

  const moveLeft = () => {
    if (currentIndex > 0) {
      console.log(currentIndex - 1)
      setCurrentIndex(currentIndex - 1);
      axios({
        method: "post",
        url: `http://${config.URL}:5000/api/playSound`,
        data: {
          "sound": "Select2.mp3"
        }
      })
    }
  };

  const moveRight = () => {
    if (currentIndex < modules.length - 1) {
      console.log(currentIndex + 1)
      setCurrentIndex(currentIndex + 1);
      axios({
        method: "post",
        url: `http://${config.URL}:5000/api/playSound`,
        data: {
          "sound": "Select2.mp3"
        }
      })
    }
  };

  useEffect(() => {
    updateView();
  }, [currentIndex]);

  let refTaches = useRef(null); 
  let refRappels = useRef(null);
  let refEdt = useRef(null);    

  const [enregistrements, setEnregistrements] = useState([]);
  const fetchEnregistrements = async() => {
    axios({
        method: 'get',
        url: `http://${config.URL}:5000/api/getEnregistrements`,
    }).then((response) => {
        setEnregistrements(response.data.result);
    });
  }
  useEffect(() => {
  
    fetchRappels();
    fetchEnregistrements()
    }, [])
  
  


const [indexFiche, setIndexFiche] = useState(0);
const [indexQcm, setIndexQcm] = useState(0);
const [insideQcmIndex, setInsideQcmIndex] = useState(0);
const [indexEnregistrements, setIndexEnregistrements] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Récupérer l'état actuel du module courant
      const currentModule = modules[currentIndex];

   


      if (currentModule.show) {
       
        if(currentModule.name == "Tâches") {
        
          if (e.key === 'ArrowLeft') {

            refTaches.current.scrollLeft -= 20;



          } else if (e.key === 'ArrowRight') {
            refTaches.current.scrollLeft += 20;
          }
        
        } else if(currentModule.name == "Rappels") {
          if (e.key === 'ArrowLeft') {
            let elem = document.querySelector(".rappels-container")
            elem.scrollTop -= 20;
           
          } else if (e.key === 'ArrowRight') {
            let elem = document.querySelector(".rappels-container")
            elem.scrollTop += 20;
           
          } 
        } else if(currentModule.name == "Emploi du temps") {
          if (e.key === 'ArrowLeft') {
            let elem = document.querySelector(".timetable")
          elem.scrollTop -= 20;
          } else if (e.key === 'ArrowRight') {
            let elem = document.querySelector(".timetable")
            elem.scrollTop +=20;
          }
        } else if(currentModule.name == "Actualités") {
          if (e.key === 'ArrowLeft') {
            let elem = document.querySelector(".feeds-container")
            elem.scrollTop -= 20;
          } else if (e.key === 'ArrowRight') {
            let elem = document.querySelector(".feeds-container")
            elem.scrollTop += 20;
          } 
        } else if(currentModule.name == "Trains") {
          if (e.key === 'ArrowLeft') {
            let elem = document.querySelector(".train")
            elem.scrollTop -= 20;
          } else if (e.key === 'ArrowRight') {
            let elem = document.querySelector(".train")
            elem.scrollTop += 20;
          } 
        } else if(currentModule.name == "Fiches") {
          if (e.key === 'ArrowLeft') {
            let elem = document.querySelector(".popup")
            if(popup) {
              elem.scrollTop -= 20;
              return;
            }
           
            setIndexFiche(Math.max(0, indexFiche - 1));
        
          } else if (e.key === 'ArrowRight') {
            let elem = document.querySelector(".popup")
            if(popup) {
              elem.scrollTop += 20;
              return;
            }
        
            setIndexFiche(Math.min(fiches.length - 1, indexFiche + 1));
          
          }
        } else if(currentModule.name == "Quizzs") {
          if (e.key === 'ArrowLeft') {
            if(qcmStartup) {


              setInsideQcmIndex(Math.max(0, insideQcmIndex - 1));


              console.log(qcm)
            
return;
            }

            if(showResults) {
              
                  let elem = document.querySelector(".qcm-choices");
                  elem.scrollTop -= 20;
              
                return;
              }
            


            setIndexQcm(Math.max(0, indexQcm - 1));
          } else if (e.key === 'ArrowRight') {
            



            if(qcmStartup) {

           

        setInsideQcmIndex(Math.min(JSON.parse(qcm[indice][1]).length, insideQcmIndex + 1));
    

             
              return;
            }


            if(showResults) {
             
                  let elem = document.querySelector(".qcm-choices");
                  elem.scrollTop += 20;
            
                return;
              }

            setIndexQcm(Math.min(qcms.length - 1, indexQcm + 1));
          }
        } else if(currentModule.name == "Enregistrement") {
          if (e.key === 'ArrowLeft') {
            setIndexEnregistrements((Math.max(0, indexEnregistrements - 1)))
            
             } else if (e.key === 'ArrowRight') {
            setIndexEnregistrements(Math.min(enregistrements.length - 1, indexEnregistrements + 1))
          
          }
        } else if(currentModule.name == "Pense Bête")  {
          if (e.key === 'ArrowLeft') {
            let elem = document.querySelector(".pensebetes")
            elem.scrollTop -= 20;
          } else if (e.key === 'ArrowRight') {
            let elem = document.querySelector(".pensebetes")
            elem.scrollTop += 20;
          } 
        } else if(currentModule.name == "PDF") {

          if(e.key == "ArrowLeft") {
            let elem = document.querySelector(".pdfreader")
            elem.scrollTop -= 20;
          } else if(e.key == "ArrowRight") {
            let elem = document.querySelector(".pdfreader")
            elem.scrollTop += 20;
          }
        }




        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          return;
        }
      }
  
      if (e.key === 'ArrowLeft') {



        moveLeft();
      } else if (e.key === 'ArrowRight')  {



        moveRight();
      } else if(e.key === "A") {
        axios({
          method: "post",
          url: `http://${config.URL}:5000/api/playSound`,
          data: {
            "sound": "Select1.mp3"
          }
        })
        if(showResults) {
          setQcmStartup(false);
          setShowResults(false);
          setIndice(0);
          setPoints(0);
          setSelectedAnswers({});
          setResults([]);
          setInsideQcmIndex(0);
          setIndexQcm(0);

          return;
        }

        if(qcmStartup) {
          setQcmStartup(false);
          setShowResults(false);
          setIndice(0);
          setPoints(0);
          setSelectedAnswers({});
          setResults([]);
          setInsideQcmIndex(0);
return;
        }
        if(popup) {
          setPopup(false)
          return;
        }
        if(currentModule.name == "Chronometre") {
          setGetC(!getC);
        } 



        setModules((modules) => {
          return modules.map((module, index) => {
            if (index === currentIndex) {
              return {
                ...module,
                show: !module.show,
              };
            }
            if(module.name == "Chronometre") {
              setGetC(!getC);
            }
            return module;
          });
        });
     
      } else if(e.key == "Z") {
        axios({
          method: "post",
          url: `http://${config.URL}:5000/api/playSound`,
          data: {
            "sound": "Select1.mp3"
          }
        })

        if(currentModule.name == "Fiches" && currentModule.show) {
          handleShowFiche(fiches[indexFiche].title);
        } else if(currentModule.name == "Quizzs" && currentModule.show) {
          if (qcmStartup) {


            if(insideQcmIndex == JSON.parse(qcm[indice][1]).length) {
              handleValidate();

              return;
            }

            const currentQuestion = qcm[indice][0];
           
                  setSelectedAnswers((prev) => {
                    const currentAnswers = prev[currentQuestion] || [];
                    if (!currentAnswers.includes(JSON.parse(qcm[indice][1])[insideQcmIndex].text)) {
                      return { ...prev, [currentQuestion]: [...currentAnswers, JSON.parse(qcm[indice][1])[insideQcmIndex].text] };
                    } else {
                      return { ...prev, [currentQuestion]: currentAnswers.filter((val) => val !== JSON.parse(qcm[indice][1])[insideQcmIndex].text) };
                    }
                  });



           } else {
          handleGetQcm(qcms[indexQcm]);
        }
         
        } else if(currentModule.name == "Enregistrement" && currentModule.show) {
          axios({
            method: 'post',
            url: `http://${config.URL}:5000/api/playRecord`,
            data: {
              "filename": enregistrements[indexEnregistrements]
            }
          }).then((response) => {
            console.log(response.data);
          });

          
        
      } 
      }
    };

  
    document.addEventListener('keyup', handleKeyDown);
    return () => {
      document.removeEventListener('keyup', handleKeyDown);
    };
  }, [currentIndex, modules, qcmStartup, popup, indexFiche, indexQcm, insideQcmIndex, indexEnregistrements]);




  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [phoneConnected, setPhoneConnected] = useState(false);
  const [musicInfo, setMusicInfo] = useState({});
  const [time, setTime] = useState(0);
  const [minuteur, setMinuteur] = useState(0);

  const [pageC, setPageC] = useState(1);

  const [initialTraduction, setInitialTraduction] = useState("");
  const [finalTraduction, setFinalTraduction] = useState("");

  const [feeds, setFeeds] = useState([]);

  const [qcms, setQcms] = useState([]);
  
  
  const fetchDays = async() => {
      axios({
          method: 'get',
          url: `http://${config.URL}:5000/api/getDays`,
      }).then((response) => {
          setElements([])
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
  const updateTime = async() => {
      const r3 = await axios.get(`http://${config.URL}:5000/api/getTemps`);
      
              setTime(r3.data.temps);
  }
  const updateMinuteur = async() => {
      const r4 = await axios.get(`http://${config.URL}:5000/api/getMinuteur`);
      setMinuteur(r4.data.temps);
  
  }
const [fiches, setFiches] = useState([]);

  const fetchFiches = async() => {
      axios({
        method: 'get',
        url: `http://${config.URL}:5000/api/getFiches`,
      }).then((response) => {
          
        setFiches(response.data.result);
      })
    
    }
 
    
const fetchFeeds = async() => {
  axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getFeeds`,
  }).then((response) => {
      setFeeds(response.data.result);
  });
}

const [alarms, setAlarms] = useState([]);
const fetchAlarms = async() => {
  axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getReveil`,
  }).then((response) => {
      setAlarms(response.data.result);
  });
}


const fetchQcms = async() => {
  axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getQuestions`,
  }).then((response) => {


      let used = []

      response.data.result.forEach((qcm) => {
          if(used.includes(qcm[2])) {
              return;
          }
          used.push(qcm[2]);
      
      })
      setQcms(used);
      
      
      
  });
}


const [categories, setCategories] = useState([]);
const [tasks, setTasks] = useState([]);

useEffect(() => {
fetchCategories();
}, []);

const fetchCategories = () => {
axios({
  method: 'get',
  url: `http://${config.URL}:5000/api/getCategories`,
}).then((response) => {
  const categoriesData = response.data.result;
  setCategories(categoriesData);

  const fetchTasksPromises = categoriesData.map((category) =>
    axios({
      method: 'post',
      url: `http://${config.URL}:5000/api/getTasks`,
      data: {
        category: category[0],
      },
    }).then((taskResponse) => ({
      category: category[0],
      tasks: taskResponse.data.result,
    }))
  );

  Promise.all(fetchTasksPromises).then((tasksData) => {
    setTasks(tasksData);
  });
}).catch((error) => {
  console.error("Error fetching categories: ", error);
});
};


const  [background, setBackground] = useState("");
const fetchBackground = async() => {
  axios({
    method: 'get',
    url: `http://${config.URL}:5000/api/getBackground`,
  }).then((response) => {
    setBackground(response.data.result);
  }
  )
}
useEffect(() => {
  fetchBackground()
}, [])







const fetchData = async () => {
  try {
      setLoading(true);
      const r1 = await axios.get(`http://${config.URL}:5000/api/getCity`);
      const r2 = await axios.post(`http://${config.URL}:5000/api/getWeather`, { location: r1.data.result });
      setWeather(r2.data.result);
      fetchDays()
      fetchFiches()
      fetchFeeds()
      fetchQcms()
      setLoading(false); 

  } catch (error) {
      console.error("Erreur lors de la récupération des données météorologiques:", error);
  }
};
useEffect(() => {
  fetchData(); 
}, [])



const [voice, setVoice] = useState(false);
const [mic, setMic] = useState(false);




useEffect(() => {
  axios({
    method: "get",
    url: `http://${config.URL}:5000/api/getMuted`
  }).then((res) => {
    console.log(res.data.result)
    setVoice(res.data.result[0][0] == "on");
    setMic(res.data.result[0][1] == "on");
  })
}, [])

  useEffect(() => {
      

      const socket = io(`http://${config.URL}:5000`);

     socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('message', (message) => {
    let type = message["type"];
    let msg = message["message"];

    switch(type) {
        case "mobile_status_change":
        case "check_mobile_connected":
            setPhoneConnected(msg);
            break;
        case "city_changed":
            fetchData();
            break;
        case "music_play":
        case "music_update":
            setMusicInfo(type === "music_play" ? msg : message);
            if(type === "music_update") console.log("Music updated: ", message);
            break;
        case "timetable_update":
            fetchDays();
            break;
            case "recordings_update":
            fetchEnregistrements();
            break;
        case "files_update":
            fetchPDFs();
            break;
          case "train_name_update":
          fetchTrain();
            break;
            case "background_update":
            fetchBackground();
              break;
              case "preferences_update":
              fetchPreferences();
                break;
              case "muted_update":
                console.log("get")
                setVoice(message["voice"] == "on")
                setMic(message["mic"] == "on")
                break;

        case "molette": {

          let currentModule = modules[currentIndex];
        if (currentModule.show) {
       
          if(currentModule.name == "Tâches") {
       
            if (msg === 'DROITE') {
           refTaches.current.scrollLeft -= 20;
            } else if (msg === 'GAUCHE') {
              refTaches.current.scrollLeft += 20;
            }
          
          } else if(currentModule.name == "Rappels") {
            if (msg === 'GAUCHE') {
              let elem = document.querySelector(".rappels-container")
              elem.scrollTop -= 20;
             
            } else if (msg === 'DROITE') {
              let elem = document.querySelector(".rappels-container")
              elem.scrollTop += 20;
             
            } 
          } else if(currentModule.name == "Emploi du temps") {
            if (msg === 'GAUCHE') {
              let elem = document.querySelector(".timetable")
            elem.scrollTop -= 20;
            } else if (msg === 'DROITE') {
              let elem = document.querySelector(".timetable")
              elem.scrollTop +=20;
            }
          } else if(currentModule.name == "Actualités") {
            if (msg === 'GAUCHE') {
              let elem = document.querySelector(".feeds-container")
              elem.scrollTop -= 20;
            } else if (msg === 'DROITE') {
              let elem = document.querySelector(".feeds-container")
              elem.scrollTop += 20;
            } 
          } else if(currentModule.name == "Trains") {
            if (msg === 'GAUCHE') {
              let elem = document.querySelector(".train")
              elem.scrollTop -= 20;
            } else if (msg === 'DROITE') {
              let elem = document.querySelector(".train")
              elem.scrollTop += 20;

            } 
          } else if(currentModule.name == "Fiches" && popup) {
            if (msg == 'GAUCHE') {


              let elem = document.querySelector(".popup")
              elem.scrollTop -= 20;
return;


            } else if (msg === 'DROITE') {


              let elem = document.querySelector(".popup")
              elem.scrollTop += 20;
 return;         

}
  
          } else if(currentModule.name == "Fiches" && !popup) {

if(msg == "GAUCHE") {
setIndexFiche(Math.min(fiches.length-1,indexFiche+1))
} else if(msg == "DROITE") {
setIndexFiche(Math.max(0,indexFiche-1))
}
}


 else if(currentModule.name == "Quizzs") {
  
  
            if (msg === 'DROITE') {
              if(qcmStartup) {
  
  
                setInsideQcmIndex(Math.max(0, insideQcmIndex - 1));
  
  
                console.log(qcm)
              
  return;
              }
              if(showResults) {
             
                let elem = document.querySelector(".qcm-choices");
                elem.scrollTop += 20;
          
              return;
            }
  
  
              setIndexQcm(Math.max(0, indexQcm - 1));
            } else if (msg === 'GAUCHE') {
              if(qcmStartup) {
  
             
  
          setInsideQcmIndex(Math.min(JSON.parse(qcm[indice][1]).length, insideQcmIndex + 1));
      
  
               
                return;
              }
              if(showResults) {
              
                let elem = document.querySelector(".qcm-choices");
                elem.scrollTop -= 20;
            
              return;
            }
              setIndexQcm(Math.min(qcms.length - 1, indexQcm + 1));
            }
          } else if(currentModule.name == "Enregistrement") {
            if (msg === 'GAUCHE') {
              setIndexEnregistrements((Math.max(0, indexEnregistrements - 1)))
               } else if (msg === 'DROITE') {
              setIndexEnregistrements(Math.min(enregistrements.length - 1, indexEnregistrements + 1))
            
            } 
          }else if(currentModule.name == "Pense Bête")  {
            if (msg == "GAUCHE") {
              let elem = document.querySelector(".pensebetes")
              elem.scrollTop -= 20;
            } else if (msg == "DROITE") {
              let elem = document.querySelector(".pensebetes")
              elem.scrollTop += 20;
            } 
          } else if(currentModule.name == "PDF") {

            if(msg == "GAUCHE") {
              let elem = document.querySelector(".pdfreader")
              elem.scrollTop -= 20;
            } else if(msg == "DROITE") {
              let elem = document.querySelector(".pdfreader")
              elem.scrollTop += 20;
            }
          }
  
  
  
          if (msg === 'GAUCHE' || msg === 'DROITE') {
            return;
          }
        }


            if(msg === "DROITE") {
                console.log("GAUCHE");
                moveLeft();
            } else if(msg === "GAUCHE") {
                console.log("DROITE");
                moveRight();
            }
          }
            break;
        case "bouton_molette":
            if(msg === "APPUI") handleMoletteButtonPress();
            break;
        case "bouton_action":
            if(msg === "APPUI"){
              axios({
                method: "post",
                url: `http://${config.URL}:5000/api/playSound`,
                data: {
                  "sound": "Select1.mp3"
                }
              })
          let currentModule = modules[currentIndex];
              if(currentModule.name == "Fiches" && currentModule.show) {
                handleShowFiche(fiches[indexFiche].title);
              } else if(currentModule.name == "Quizzs" && currentModule.show) {
                if(showResults) {
                  setQcmStartup(false);
                  setShowResults(false);
                  setIndice(0);
                  setPoints(0);
                  setSelectedAnswers({});
                  setResults([]);
                  setInsideQcmIndex(0);
                  
                  return;
                }
                if (qcmStartup) {
      
      
                  if(insideQcmIndex == JSON.parse(qcm[indice][1]).length) {
                    handleValidate();
      
                    return;
                  }
      
                  const currentQuestion = qcm[indice][0];
                 
                        setSelectedAnswers((prev) => {
                          const currentAnswers = prev[currentQuestion] || [];
                          if (!currentAnswers.includes(JSON.parse(qcm[indice][1])[insideQcmIndex].text)) {
                            return { ...prev, [currentQuestion]: [...currentAnswers, JSON.parse(qcm[indice][1])[insideQcmIndex].text] };
                          } else {
                            return { ...prev, [currentQuestion]: currentAnswers.filter((val) => val !== JSON.parse(qcm[indice][1])[insideQcmIndex].text) };
                          }
                        });
      
      
      
                 } else {
                handleGetQcm(qcms[indexQcm]);
              }
               
              }else if(currentModule.name == "Enregistrement" && currentModule.show) {
                axios({
                  method: 'post',
                  url: `http://${config.URL}:5000/api/playRecord`,
                  data: {
                    "filename": enregistrements[indexEnregistrements]
                  }
                }).then((response) => {
                  console.log(response.data);
                });
      
                
              
            }  else if(currentModule.name == "PDF" && currentModule.show) {
              let random_pdf = pdfs[Math.floor(Math.random() * pdfs.length)];
              setPdfName(random_pdf);
              fetchPdf();

            }
            }
            break;
        case "fiches_update":
            fetchFiches();
            break;
        case "translation":
            setInitialTraduction(message["initialText"]);
            setFinalTraduction(message["translatedText"]);
            break;
        case "feeds_update":
            fetchFeeds();
            break;
        case "reveil_update":
            fetchAlarms();
            break;
        case "qcm_update":
            fetchQcms();
            break;
        case "tasks_update":
            fetchCategories();
            break;
        case "rappels_update":
            fetchRappels();
            break;
          case "pense_bete_update":
            fetchPenseBetes();
            break;

        default:
            console.log('Unknown message type:', type);
    }

    console.log('Message received: ', message);
});

const handleMoletteButtonPress = () => {
  axios({
    method: "post",
    url: `http://${config.URL}:5000/api/playSound`,
    data: {
      "sound": "Select2.mp3"
    }
  })
    const currentModule = modules[currentIndex];
    if(showResults) {
      setQcmStartup(false);
      setShowResults(false);
      setIndice(0);
      setPoints(0);
      setSelectedAnswers({});
      setResults([]);
      setInsideQcmIndex(0);
      
      return;
    }
    if(qcmStartup) {
        setQcmStartup(false);
        setShowResults(false);
        setIndice(0);
        setPoints(0);
        setSelectedAnswers({});
        setResults([]);
        return;
    }
    if(popup) {
        setPopup(false);
        return;
    }
    if(currentModule.name === "Chronometre") {
        setGetC(!getC);
    }

    setModules((modules) => modules.map((module, index) => {
        if (index === currentIndex) {
            return { ...module, show: !module.show };
        }
        if (module.name === "Chronometre") {
            setGetC(!getC);
        }
        return module;
    }));
};

// Initial call

return () => {
    socket.disconnect();
};
  }, [currentIndex, modules, qcmStartup, popup, indexFiche, indexQcm, insideQcmIndex, indexEnregistrements, pdfs]);


  useEffect(() => {
      const interval = setInterval(() => {
          if (getC) {
            console.log("updating time")
              updateTime();
              updateMinuteur();
          }
      }, 1000);
      return () => clearInterval(interval);
  }, [getC]); // Mettre getC dans les dépendances de useEffect

  const timeConvert = (n) => {
    
      var num = n;
      var minutes = Math.floor(num / 60);
      var seconds = Math.floor(num % 60);
      if(seconds < 10) {
          seconds = "0" + seconds;
      }
      if(minutes < 10) {
          minutes = "0" + minutes;
      }
      if(minutes == 0) {
          minutes = "00";
      }
      if(seconds == 0) {
          seconds = "00";
      }
      if(isNaN(minutes) || isNaN(seconds)) {
          return "00:00";
      }

      return minutes + ":" + seconds;

    
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
  const [pdf, setPdf] = useState(null);
  const canvasRef = useRef(null);
  const [pdfName, setPdfName] = useState('');

  const fetchPdf = async () => {
      try {


          axios({
              method: 'post',
              url: `http://${config.URL}:5000/api/processPDF`,
              responseType: 'blob',
              data: {
                  pdf_name: pdfName
              }
           
          }).then(async(response) => {
              setPageC(1);
              const blob = response.data;
              const url = URL.createObjectURL(blob);
  console.log(url)
              const loadingTask = pdfjsLib.getDocument(url);
              const pdfDoc = await loadingTask.promise;
              setPdf(pdfDoc);
          })
         
      } catch (error) {
          console.error('Error fetching PDF:', error);
      }
  };



  useEffect(() => {
      if (pdf) {
          renderPage(pageC);
      }
  }, [pdf, pageC]); 

  const renderPage = async (pageNum) => {
     
      if (!pdf) return;

      const page = await pdf.getPage(pageNum);
      const scale = 1;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      canvas.height = viewport?.height;
      canvas.width = viewport?.width;

      const renderContext = {
          canvasContext: context,
          viewport: viewport,
      };

      await page.render(renderContext).promise;
  };

const [train, setTrain] = useState([]);
const [trainName, setTrainName] = useState("departures");

  const fetchTrain = async() => {

    axios({
      method: "get", 
      url: `http://${config.URL}:5000/api/getTrainName`
    }).then((r1) => {
      axios({
        method: 'post',
        url: `http://${config.URL}:5000/api/getTrain`,
        data: {
            "location": r1.data.result[0]
        }
    }).then((response) => {
       setTrainName(r1.data.result[0])
            setTrain(response.data.result);
        
      
    });
    })



     
  }

 


  useEffect(() => {
      fetchPDFs();
      fetchTrain();
      fetchAlarms()
     
  }, []);



  let [fiche, setFiche] = useState({});
  const handleShowFiche = (ficheTitle) => {
      axios({
          method: 'post',
          url: `http://${config.URL}:5000/api/getFiche`,
          data: {
              fiche: ficheTitle
          }
      }).then((response) => {

          setFiche(response.data.result);
          setPopup(true);
      });
  }

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [qcm, setQcm] = useState([]);
  const [indice, setIndice] = useState(0);
  const [points, setPoints] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  const handleGetQcm = (qcmTitle) => {
      axios({
          method: 'post',
          url: `http://${config.URL}:5000/api/getQuestion`,
          data: { titre: qcmTitle }
      }).then((response) => {
          setQcm(response.data.result);
          setQcmStartup(true);
          setIndice(0);
          setPoints(0);
          setSelectedAnswers({});
          setShowResults(false);
          setResults([]);
      });
  };

  const handleValidate = () => {
      const currentQuestion = qcm[indice][0];
      const correctAnswers = JSON.parse(qcm[indice][1]).filter((answer) => answer.isCorrect).map((answer) => answer?.text);
      const selected = selectedAnswers[currentQuestion] || [];
      console.log("correctAnswers", correctAnswers);
      console.log("selected", selected);

      let isCorrect = selected.length === correctAnswers.length && selected.every((answer) => correctAnswers.includes(answer));
      let resultEntry = {
          question: currentQuestion,
          correctAnswers: correctAnswers,
          selectedAnswers: selected,
          isCorrect: isCorrect
      };

      setResults((prevResults) => [...prevResults, resultEntry]);

      if (isCorrect) {
          setPoints(points + 1);
      }

      if (indice === qcm.length - 1) {
          setShowResults(true);
          setQcmStartup(false);
          setIndice(0);
          setInsideQcmIndex(0)
          setSelectedAnswers({});
          return;
      }

      setIndice(indice + 1);
      setInsideQcmIndex(0);

      setSelectedAnswers({});
  };




const [rappels, setRappels] = useState([]);
const fetchRappels = async() => {
  axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getAllRappels`,
  }).then((response) => {
      setRappels(response.data.result);
  });

}



const [penseBetes, setPenseBetes] = useState([]);
const fetchPenseBetes = async() => {
  axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getPenseBete`,
  }).then((response) => {
    console.log(response.data.result)
      setPenseBetes(response.data.result);
  });
}

useEffect(() => {
  fetchPenseBetes();
}, []);



const [preferences, setPreferences] = useState([]);
const fetchPreferences = async() => {
  axios({
      method: 'get',
      url: `http://${config.URL}:5000/api/getPreferences`,
  }).then((response) => {
      setPreferences(response.data.result[0]);
  });
}

useEffect(() => {
  fetchPreferences();

}, [])



useEffect(() => {
  axios({
    method: "post",
    url: "http://localhost:5000/api/launch_reveil",

  })
}, [])
  return (
    <div className="global">
      <img src={background == "red" && red || background == "green" && green || background == "blue" && blue} className="image_main" alt="Main" />
      <header>
        <div className="header_item">
          <img src="https://cdn.glitch.global/fc3240cb-ecdc-47a9-9aff-06b7b848d76e/image%203.png?v=1718792685753" className="icon_flo" alt="Icon" />
          <h2 className="header_title">FloBot | <img src={user} className="icon_spec" /> {preferences[1]} | <img src={currentvoice} className="icon_spec"/>  {preferences[0]}</h2>
        </div>
        <div className="header_item">
          

          {!voice && <img src={voiceOn} alt="Microphone" className="icon_spec" style={{width: "25px"}} />}
          {voice && <img src={voiceOff} alt="Microphone" className="icon_spec" style={{width: "25px"}} />}
          {!mic && <img src={micOn} alt="Microphone" className="icon_spec" />}
          {mic && <img src={micOff} alt="Microphone" className="icon_spec" />}
          
          <FontAwesomeIcon icon={faPhone} size="2x" className="icon" style={{color: phoneConnected ? "#3DE56D":"#FF6254"}} />
         <FontAwesomeIcon icon={faWifi} size="2x" className="icon" style={{color: "#3DE56D"}} />
          
          
            </div>
      </header>

      <main>
        <div className="container" ref={containerRef}>
          {modules.map((module, index) => (
            <div
              className={`child ${index === currentIndex ? 'focused' : ''}`}
              key={index}
              ref={(el) => (elsRef.current[index] = el)}
            >
              <div className="sep_top">
                <div className="aligner">
                  <img src={`/src/images/${module.icon}`} className="icon_box" alt="Icon Box" />
                  <h2 className="box_title">{module.name}</h2>
                </div>
              </div>
             {index !== currentIndex && (<img src="https://cdn.glitch.global/fc3240cb-ecdc-47a9-9aff-06b7b848d76e/wave.png?v=1718797491724" className="wave" alt="Wave" />) } 
              <div className="sep_bottom" style={{bottom: index === currentIndex ? "5px": "0px"}}>
                <p className="box_description" style={{color: index === currentIndex ? "white": "black"}}>{module.description}</p>
              </div>
            </div>
          ))}
        </div>







        
      </main>

{modules[currentIndex].name == "Pense Bête" && modules[currentIndex].show && (
        <div className="popC">
          <h2 style={{color:"black"}}>Pense Bête</h2>
          <div className="pensebetes" style={{display: "flex", flexDirection: "column", gap: "25px", height:"300px", overflowY: "scroll"}}>
            {penseBetes.map((penseBete, idx) => (
              <div key={idx} style={{background: "rgb(20, 42, 77)", color:"rgb(111, 221, 232)", padding: "15px", borderRadius: "15px" }}>
                <h2>Titre : {penseBete[0]}</h2>
                <p>Contenu : {penseBete[1]}</p>
              </div>
            ))}
          </div>
        </div>
      )}



{modules[currentIndex].name == "Enregistrement" && modules[currentIndex].show && (
        <div className="popC">
        <h2 style={{color:"black"}}>Enregistrement</h2>
     
         
          <div className="enregistrements" style={{display: "flex", flexDirection: "column", gap: 15, marginTop: 15,  overflowY: "scroll", overflow:"hidden"}}>
            {enregistrements.map((enregistrement, idx) => (
              <div key={idx} style={{background: "rgb(20, 42, 77)", color: "rgb(111, 221, 232)", padding: 10, borderRadius: 15, display: "flex", justifyContent: "space-between", alignItems: "center", transform: indexEnregistrements == idx ? "scale(1.1)" : "scale(1)", width: "90%", margin: "0 auto", marginTop: "10px"}}>
               <h2>
                {enregistrement}
               </h2>
               <button onClick={() => {
                axios({
                  method: 'post',
                  url: `http://${config.URL}:5000/api/playRecord`,
                  data: {
                      filename: enregistrement
                  }

                })
               }} style={{background: "rgb(111, 221, 232)", color: "rgb(20, 42, 77)", padding: 10, borderRadius: 15, border: "none"}}>Ecouter</button>
              </div>
            ))}
          
      
      

    

            </div>
   
      </div>
    )}



      {modules[currentIndex].name == "Tâches" && modules[currentIndex].show && (
        <div className="popC">
   
   <h2 style={{color:"black"}}>Gestionnaire de tâches</h2>
   <div className="columns" ref={refTaches}>
     {categories.map((category) => (
       <div key={category[0]} className="column">
         <h2 className="column-title">{category[0]}</h2>
         <div className="tasks">
           {tasks
             .filter((taskGroup) => taskGroup.category === category[0])
             .flatMap((taskGroup) => taskGroup.tasks)
             .map((task) => (
               <div key={task.name} className="task">
                 <span>{task.name}</span>
                
               </div>
             ))}
         </div>
       </div>
     ))}
   </div>
 </div>

  
  )}



{modules[currentIndex].name == "Chronometre" && modules[currentIndex].show && (
        <div className="popC">
        
          <div className="stopwatch" style={{width: "100%"}}>
                                                    <div className="display">{timeConvert(time)}</div>
                                                    <div className="display">{timeConvert(minuteur)}</div>
                                                    <div className="horloge">
                                                                                    <ClockAnalog />
                                                                                    <ClockDigital />
                                                                                </div>
                                                   
                                                  </div>
                                                  </div>)}


                                                  {modules[currentIndex].name == "PDF" && modules[currentIndex].show && (
        <div className="popC">
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <select onChange={(e) => setPdfName(e.target.value)} style={{ margin: '10px' }} value={pdfName}>
                {pdfs.map((pdf, index) => (
                    <option key={index} value={pdf}>{pdf}</option>
                ))}
            </select>
            <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
            <button onClick={fetchPdf} style={{ margin: '10px' }}>Charger le PDF</button>
                                                               
            <button onClick={() => setPageC((prev) => Math.max(prev - 1, 1))} style={{ margin: '10px' }}>Page précédente</button>
            <button onClick={() => setPageC((prev) => (pdf && prev < pdf.numPages) ? prev + 1 : prev)} style={{ margin: '10px' }}>Page suivante</button>
         </div>
           <div style={{overflowY: "scroll", height: "300px"}} className="pdfreader">
                                                        <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
                                                        </div>
                                                    </div>

                                                  </div>)}


                                                  {modules[currentIndex].name == "Trains" && modules[currentIndex].show && (
        <div className="popC">
        <div className="train">
                                                        <h2>Prochains départs de {trainName}</h2>
                                                        {train.map((departure, index) => (
                                                          <div key={index} className="departure">
                                                            <div>{departure.direction}</div>
                                                            <div>Dans : {departure.time} minutes </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                  </div>)}                                          
                                                  {modules[currentIndex].name == "Météo" && modules[currentIndex].show && (
        <div className="popC">
        <h2 style={{color:"black"}}>Météo</h2>
       <div className="card-s">
                                            <div className="card-header">
                                                <h2>{weather.day}</h2>
                                                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                                                    <FontAwesomeIcon icon={faMapPin} size="2x" />
                                                    <h2 style={{ fontSize: "20px" }}>{weather.City[0]}</h2>
                                                </div>
                                            </div>
                                            <div><img src={icon} alt="no image cloud" style={{ width: "100px", height: "100px", color: "white", marginLeft: "30px" }} /></div>
                                            <div style={{ width: "100%", borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px", display: "flex" }}>
                                                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "15px", padding: "10px", borderBottomLeftRadius: "15px" }}>
                                                    <h1 style={{ fontWeight: "950" }}>{weather.Temperature}</h1>
                                                    <h1 style={{ fontWeight: "bold" }}>{weather.ressenti}</h1>
                                                </div>
                                                <div style={{ flex: 2, background: "#1C3746", borderTopLeftRadius: "50px", padding: "25px", borderBottomRightRadius: "15px", paddingBottom: "0px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                                                  
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                                                        <h2>VENT</h2>
                                                        <h2>{weather.Windspeed}</h2>
                                                    </div>
                                                  
                                                </div>
                                            </div>
                                        </div>
                                                  </div>)}    


                                                  {modules[currentIndex].name == "Fiches" && modules[currentIndex].show && (
        <div className="popC">
        <div className="fiches">
                                                            <h2>Fiches</h2>
                                                            <div className="fiches-container" style={{display: "flex", gap: "25px", flexFlow: "row wrap", height:"350px",overflowY:"scroll", padding: "25px" }}>
                                                                {fiches.map((fiche, index) => (
                                                                    <div key={index} className="fiche" style={{ overflow:"hidden",   textOverflow: "ellipsis",padding: "25px", borderRadius: "15px", background: '#152A4D', color: "white", width: "200px", transform: index == indexFiche ? "scale(1.1)" : "scale(1)"}} onClick={() => handleShowFiche(fiche.title)}>
                                                                        <h3 style={{borderBottom: "1px solid white", color: "rgb(111, 221, 232)"}}>{fiche.title}</h3>
                                                                        <p style={{marginTop:"10px"}}>{fiche.description}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                  </div>)} 




                                                  {modules[currentIndex].name == "Actualités" && modules[currentIndex].show && (
        <div className="popC">
 
    <h2>Actualités</h2>
    <div className="feeds-container">
        {feeds.map((feed, index) => (
            <div key={index} className="feed" style={{background:"#152A4D"}}>
                <h3 style={{color: "rgb(111, 221, 232)"}}>{feed.journal}</h3>
                <p>{feed.headline}</p>
            </div>
        ))}
  
</div>
                                                  </div>)} 



                                                  {modules[currentIndex].name == "Réveil" && modules[currentIndex].show && (
        <div className="popC">
         <div className="reveil">
                                                                    <h2>Liste des réveils programmés</h2>
                                                                    <div style={{display: "flex", marginTop:"15px", gap: "15px", flexDirection: "column"}}>
                                                                        {alarms.map((alarm, index) => (
                                                                            <div key={index} className="alarm" style={{backgroundColor: "#152A4D", padding:"15px", borderRadius: "5px"}}>
                                                                                <h3 style={{color:"rgb(111, 221, 232)"}}>{alarm[0]}</h3>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                  </div>)} 



                                                  {modules[currentIndex].name == "Quizzs" && modules[currentIndex].show && (
        <div className="popC">
        <div className="qcm">
                                                                <h2>QCM</h2>
                                                                <div style={{display: "flex", flexFlow: "row wrap", gap: "25px"}}>
                                                                    {qcms.map((qcm, index) => (
                                                                        <div key={index} className="qcm" style={{border: "2px solid black", padding: "15px", borderRadius: "15px", transform: index == indexQcm ? "scale(1.1)" : "scale(1)"}}>
                                                                            <h3>{qcm}</h3>
                                                                            <button onClick={() => handleGetQcm(qcm)} style={{background: "#142a4d", padding: "15px", borderRadius: "15px", color: "#6fdde8"}}>
                                                                                Démarrer le QCM
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                </div>
                                                  </div>)} 



                                                



                                                 



                                                


                                                  {modules[currentIndex].name == "Musique" && modules[currentIndex].show && (
        <div className="popC">
        <h2 style={{color:"black"}}>Musique</h2>
      <div className="music-card">
                                            <img src={musicInfo.image ? musicInfo.image : "https://via.placeholder.com/300x150"} alt="Album Cover" />
                                            <h2>{musicInfo.title ? musicInfo.title : "Pas de musique"}</h2>
                                            <div className="progress-bar">
                                                <div className="progress" style={{width: `${(musicInfo.elapsed_time / musicInfo.duration)*100}%`} }></div>
                                            </div>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <p>{timeConvert(musicInfo.elapsed_time)}</p>/<p>{timeConvert(musicInfo.duration)}</p>
                                                </div>
                                            
                                            {musicInfo.status == "play" && <FontAwesomeIcon icon={faPlayCircle} size="2x" className="play-icon" />}
                                            {musicInfo.status == "pause" && <FontAwesomeIcon icon={faPauseCircle} size="2x" className="play-icon" style={{color: "red"}} />}
                                        </div>

                                                  </div>)} 



                                                  {modules[currentIndex].name == "Rappels" && modules[currentIndex].show && (
        <div className="popC">
     

             <div className="App">
      <h1>Rappels Programmés</h1>
      <Rappels data={rappels} ref={refRappels} />
    </div>

                                                  </div>)} 



                                                  {modules[currentIndex].name == "Emploi du temps" && modules[currentIndex].show && (
        <div className="popC">
        <h2 style={{color:"black"}}>Emploi du temps</h2>
        <div className="timetable" style={{height: "500px", overflow:"scroll"}}>
    
    <div className="grid">
    
      <div className="time-column">
        {timeSlots.map((time) => (
          
          <div key={time} className="time-slot">
            {time !=0 && `${time-1}:00`}
           
          </div>
        ))}
      </div>
    
      {daysOfWeek.map((day, index) => (
        <div key={index} className="day">
          {day}
        </div>
      ))}
    
      {elements.map(element => (
      
        <div
          key={element?.id}
          className="element"
          style={{
            gridRowStart: element?.startTime + 2,
            gridRowEnd: element?.endTime + 2,
            gridColumn: element?.day + 2,
          }}
        >
          {element?.name}
          <div>{element?.startTime}:00 - {element?.endTime}:00</div>
        </div>
      ))}
    </div>
  </div>
                                                  </div>)} 



                                                




                                                  {(qcmStartup || showResults) && (
                <div className="qcm-popup" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", zIndex: 1001, padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", maxWidth: "80vw", width: '50vw' }}>
                    <div className="qcm-popup-inner" style={{ background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)", marginBottom: "10px" }}>
                        <button style={{ background: "#e74c3c", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }} 
                        onClick={() => {
                            setQcmStartup(false);
                             setShowResults(false);
                             setIndice(0);
                             setPoints(0);
                             setSelectedAnswers({});
                             setResults([]);
                             }}>Appuyez sur la molette pour quitter</button>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <h2 style={{ background: "#e74c3c", padding: "10px", borderRadius: "5px", marginBottom: "10px", fontSize: "1.2rem" }}>QCM</h2>
                        <div className="qcm-popup-container" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "5px", fontSize: "1rem" }}>
                                {!showResults ? (
                                    <>
                                        <h2 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>{qcm[indice][0]}</h2>
                                        <div className="qcm-answers" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            {JSON.parse(qcm[indice][1]).map((answer, index) => (
                                                <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                  <div style={{ padding: "5px", background: insideQcmIndex == index ? "#e74c3c" : "#f2f2f2", borderRadius: "15px"}}>

                                                    <input
                                                        type="checkbox"
                                                        name={answer?.text}
                                                        value={answer?.text}
                                                        checked={(selectedAnswers[qcm[indice][0]] || []).includes(answer?.text)}
                                                        style={{ borderRadius: "5px", padding: "5px", cursor: "pointer" }}
                                                        onChange={(e) => {
                                                          console.log(selectedAnswers)
                                                            const isChecked = e.target.checked;
                                                            setSelectedAnswers((prev) => {
                                                                const currentAnswers = prev[qcm[indice][0]] || [];
                                                              
                                                                if (isChecked) {
                                                                    return { ...prev, [qcm[indice][0]]: [...currentAnswers, e.target.value] };
                                                                } else {
                                                                    return { ...prev, [qcm[indice][0]]: currentAnswers.filter((val) => val !== e.target.value) };
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    </div>
                                                    <label>{answer.text}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={handleValidate} style={{border: insideQcmIndex == JSON.parse(qcm[indice][1]).length ? "2px solid red" : "2px solid grey"}}>Suivant</button>
                                    </>
                                ) : (
                                    <div className="qcm-results" style={{ marginTop: "20px", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
                                        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Résultats</h2>
                                        <p>Points: {points} sur {qcm.length}</p>

                                        <div class="qcm-choices" style={{height:"200px", overflowY: "scroll"}}>
                                        {results.map((result, index) => (
                                            <div key={index} style={{ marginBottom: "20px" }}>
                                                <h3 style={{ fontSize: "1.2rem" }}>{result.question}</h3>
                                                <p>Vos réponses: {result.selectedAnswers.join(', ')}</p>
                                                <p>Bonnes réponses: {result.correctAnswers.join(', ')}</p>
                                                <p style={{ color: result.isCorrect ? 'green' : 'red' }}>
                                                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                                                </p>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
    




{popup && (
<div className="popup" style={{ position: "absolute", top: "15px",left:"15px",right:"15px",bottom:"15px",background:"white",zIndex:1002, overflow:"scroll", borderRadius:"15px", padding:"5px" }}>
    <div className="popup-inner" style={{ background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)", marginBottom: "10px" }}>
      <button style={{ background: "#152A4D",  border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", color:"white" }} onClick={() => {
        setPopup(false)
   
      }}>Appuyez sur la molette pour quitter</button>
    </div>

    <div style={{ marginBottom: "10px" }}>
      <h2 style={{ background: "#152A4D", padding: "10px", borderRadius: "5px", marginBottom: "10px", fontSize: "1.2rem", color:"#17A7E4azZAa" }}>{fiche[0].fiche}</h2>
      <p style={{ padding: "10px", borderRadius: "5px", background: "#f2f2f2", fontSize: "1rem" }}>{fiche[0].description}</p>
    </div>

    {fiche.map((section, index) => (
      <div key={index} style={{ marginBottom: "10px" }}>
        <div style={{ background: section.type === "propriete" ? "#3498db" : section.type === "texte" ? "#2ecc71" : section.type === "definition" ? "#f39c12" : section.type === "exemple" ? "#76B487" : "#FE7E67", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "10px", display: "flex", alignItems: "center", fontSize: "1.2rem" }}>
          <div style={{ background: "black", border: "1px solid black", borderRadius: "50%", padding: "15px", marginRight: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)" }}>
            {section.type === "propriete" && (<FontAwesomeIcon icon={faTools} size="1x" />)}
            {section.type === "definition" && (<FontAwesomeIcon icon={faBook} size="1x" />)}
            {section.type === "theoreme" && (<FontAwesomeIcon icon={faRuler} size="1x" />)}
            {section.type === "exemple" && (<FontAwesomeIcon icon={faMapPin} size="1x" />)}
            {section.type === "texte" && (<FontAwesomeIcon icon={faPen} size="1x" />)}
          </div>
          <div> 
            {section.type === "propriete" && "Propriété"}
            {section.type === "definition" && "Définition"}
            {section.type === "theoreme" && "Théorème"}
            {section.type === "exemple" && "Exemple"}
            {section.type === "texte" && "Texte"}
</div>
        </div>

        <div style={{ padding: "10px", borderRadius: "5px", background: "#f2f2f2", fontSize: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>{section.title}</h2>
          <p>{section.content}</p>
        </div>
      </div>
    ))}
    <div className="paper-background" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, backgroundImage: "url('https://image.shutterstock.com/image-vector/seamless-school-notebook-paper-background-260nw-1216169775.jpg')", backgroundSize: "cover", borderRadius: "10px" }}></div>
  </div>
)}














      <footer className="footer_main">
        <div className="date">{date}</div>
        <div className="flexer">
          <div className="white_box">Tournez la molette pour naviguer</div>
          <img src="https://cdn.glitch.global/fc3240cb-ecdc-47a9-9aff-06b7b848d76e/flo.png?v=1718797121412" className="flo" alt="Flo" />
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
