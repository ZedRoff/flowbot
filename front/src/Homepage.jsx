import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { faMapPin, faMicrophoneSlash, faPauseCircle, faPhone, faPlayCircle, faWifi, faTools, faBook, faPen, faRuler } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Homepage.css";
import icon from "./images/flo.png";
import icon2 from "./images/sunny-day.png";
import config from "../../config.json";
import axios from 'axios';

import './Timetable.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import { useRef } from 'react';
import image from "./images/rerA.png"

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const Homepage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);
    const [phoneConnected, setPhoneConnected] = useState(false);
    const [musicInfo, setMusicInfo] = useState({});
    const [time, setTime] = useState(0);
    const [minuteur, setMinuteur] = useState(0);
    const [getC, setGetC] = useState(false);
    const [pageC, setPageC] = useState(1);

    const [initialTraduction, setInitialTraduction] = useState("");
    const [finalTraduction, setFinalTraduction] = useState("");

    const [feeds, setFeeds] = useState([]);

    const [qcms, setQcms] = useState([]);
    
    
    const cards = [
        {
            type: "weather",
           
            icon: icon2,
        }, 
        {
            type: "music",
           
        }, {
            type: "timetable"
        }, {
            type: "chronometre"
        }, {
            type: "pdf"
        },
        {
            type: "train"
        },
        {
            type: "fiches"
        },
        {
            type: "traduction"
        },
        {
            type: "feeds"
        },
        {
            type: "reveil"
        },
        {
            type: "qcm"
        },
        {
            type: "taches"
        }
    ]; 
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






    useEffect(() => {
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

        const socket = io(`http://${config.URL}:5000`);

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            socket.emit('message', {from: 'bot', message: 'bot_connected'});
            socket.emit('message', {from: 'bot', message: 'check_mobile_connected'})
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
      
        socket.on('message', (message) => {

          

            //let who = message["from"];
            let type = message["type"];
            let msg = message["message"];

          if(type == "mobile_status_change") {
                setPhoneConnected(msg)
            } else if(type == "check_mobile_connected") {
                setPhoneConnected(msg)
            } else if(type == "city_changed") {
                fetchData();
            } else if(type == "music_play") {
                setMusicInfo(msg);
            } else if(type == "music_update") {
                setMusicInfo(message);
                console.log("Music updated: ", message);
            } else if(type == 'timetable_update') {
                fetchDays()
            } else if(type == 'files_update') {
                fetchPDFs()

            } else if(type == 'molette') {
                if(msg == "GAUCHE") {
                    setCurrentIndex((prev) => Math.max(prev - 1, 0));

                } else if(msg == "DROITE") {
                    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
            }
        } else if(type == "bouton_action") {
            if(msg == "APPUI") {
                alert("appui du bouton")
            }
        } else if(type == "fiches_update") {
            fetchFiches()
        } else if(type == "translation") {
            setInitialTraduction(message["initialText"])
            setFinalTraduction(message["translatedText"])
        } else if(type == "feeds_update") {
            fetchFeeds()
        } else if(type == "reveil_update") {
            fetchAlarms()
        } else if(type == "qcm_update") {   
            fetchQcms()
        } else if(type == "tasks_update") {
            fetchCategories()
        }



            
        console.log(type)
            console.log('Message received: ' + message);
        });

        fetchData(); // Appel initial
        
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSliderChange = (event) => {
        if (Number(event.target.value) === 3) {
            setGetC(true);
        } else {
            setGetC(false);
        }
        setCurrentIndex(Number(event.target.value));
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (getC) {
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
    const [train, setTrain] = useState([]);
const [typeTrain, setTypeTrain] = useState("departures");

    const fetchTrain = async() => {
        axios({
            method: 'get',
            url: `http://${config.URL}:5000/api/getTrain`,
        }).then((response) => {
            if(response.data.result == "success") {
                setTrain(response.data.departures);
                setTypeTrain(response.data.type)
            }
          
        });
    }

   


    useEffect(() => {
        fetchPDFs();
        fetchTrain();
        fetchAlarms()
        axios({
            method: "post",
            url: `http://${config.URL}:5000/api/launch_reveil`,

        })
    }, []);



    let [fiche, setFiche] = useState({});
    let [popup, setPopup] = useState(false);
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

    const [qcmStartup, setQcmStartup] = useState(false);
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
        const correctAnswers = JSON.parse(qcm[indice][1]).filter((answer) => answer.isCorrect).map((answer) => answer.text);
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
            return;
        }

        setIndice(indice + 1);
        setSelectedAnswers({});
    };
    return (
        <div style={{ height: "100vh" }}>


{(qcmStartup || showResults) && (
                <div className="qcm-popup" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", zIndex: 999, padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", maxWidth: "80vw", width: '50vw' }}>
                    <div className="qcm-popup-inner" style={{ background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)", marginBottom: "10px" }}>
                        <button style={{ background: "#e74c3c", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }} onClick={() => {
                            setQcmStartup(false);
                             setShowResults(false);
                             setIndice(0);
                             setPoints(0);
                             setSelectedAnswers({});
                             setResults([]);
                             }}>Fermer</button>
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
                                                    <input
                                                        type="checkbox"
                                                        name={answer.text}
                                                        value={answer.text}
                                                        checked={(selectedAnswers[qcm[indice][0]] || []).includes(answer.text)}
                                                        onChange={(e) => {
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
                                                    <label>{answer.text}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={handleValidate}>Suivant</button>
                                    </>
                                ) : (
                                    <div className="qcm-results" style={{ marginTop: "20px", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
                                        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Résultats</h2>
                                        <p>Points: {points} sur {qcm.length}</p>
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
    




{popup && (
  <div className="popup" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", zIndex: 999, padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", maxWidth: "80vw", width: '50vw' }}>
    <div className="popup-inner" style={{ background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)", marginBottom: "10px" }}>
      <button style={{ background: "#e74c3c",  border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }} onClick={() => {
        setPopup(false)
        set
      }}>Fermer</button>
    </div>

    <div style={{ marginBottom: "10px" }}>
      <h2 style={{ background: "#e74c3c", padding: "10px", borderRadius: "5px", marginBottom: "10px", fontSize: "1.2rem" }}>{fiche[0].fiche}</h2>
      <p style={{ padding: "10px", borderRadius: "5px", background: "#f2f2f2", fontSize: "1rem" }}>{fiche[0].description}</p>
    </div>

    {fiche.map((section, index) => (
      <div key={index} style={{ marginBottom: "10px" }}>
        <div style={{ background: section.type === "propriete" ? "#3498db" : section.type === "texte" ? "#2ecc71" : section.type === "definition" ? "#f39c12" : section.type === "exemple" ? "#76B487" : "#FE7E67", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "10px", display: "flex", alignItems: "center", fontSize: "1.2rem" }}>
          <div style={{ background: "black", border: "1px solid black", borderRadius: "50%", padding: "15px", marginRight: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.1)" }}>
            {section.type === "propriete" && (<FontAwesomeIcon icon={faTools} size="2x" />)}
            {section.type === "definition" && (<FontAwesomeIcon icon={faBook} size="2x" />)}
            {section.type === "theoreme" && (<FontAwesomeIcon icon={faRuler} size="2x" />)}
            {section.type === "exemple" && (<FontAwesomeIcon icon={faMapPin} size="2x" />)}
            {section.type === "texte" && (<FontAwesomeIcon icon={faPen} size="2x" />)}
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



            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des données...</p>
                </div>
            ) : (
                <>
                
                <header className="header">
                    <div className="header-space">
                        <FontAwesomeIcon icon={faPhone} size="3x" className="header-element" style={{color: phoneConnected ? "green" : "red"}} />
                        <FontAwesomeIcon icon={faMicrophoneSlash} size="3x" className="header-element" />
                        <FontAwesomeIcon icon={faWifi} size="3x" className="header-element" />
                    </div>
                </header>
                <main>
                    <div className="slider">
                        <div
                            className="slider-inner"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {cards.map((card, index) => (
                            
                                <div key={index} className="card">
                                    {card.type === "weather" ? (
                                        <div className="card-s">
                                            <div className="card-header">
                                                <h2>{weather.day}</h2>
                                                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                                                    <FontAwesomeIcon icon={faMapPin} size="2x" />
                                                    <h2 style={{ fontSize: "20px" }}>{weather.City[0]}</h2>
                                                </div>
                                            </div>
                                            <div><img src={card.icon} alt="no image cloud" style={{ width: "100px", height: "100px", color: "white", marginLeft: "30px" }} /></div>
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
                                    ) : (
                                       

                                            





                                        card.type === "music" ? (
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


                                        
                                        ) : (
                                            card.type === "timetable" ? (
<div className="timetable">
    
      <div className="grid">
      
        <div className="time-column">
          {timeSlots.map((time) => (
            <div key={time} className="time-slot">
              {time-1}:00
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
                                            ) : (



                                                card.type === "chronometre" ? (
                                                    <div className="stopwatch" style={{width: "100%"}}>
                                                    <div className="display">{timeConvert(time)}</div>
                                                    <div className="display">{timeConvert(minuteur)}</div>
                                                   
                                                  </div>
                                                ) : (

                                                    card.type === "pdf" ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <select onChange={(e) => setPdfName(e.target.value)} style={{ margin: '10px' }} value={pdfName}>
                {pdfs.map((pdf, index) => (
                    <option key={index} value={pdf}>{pdf}</option>
                ))}
            </select>
            <button onClick={fetchPdf} style={{ margin: '10px' }}>Charger le PDF</button>
                                                   
            <button onClick={() => setPageC((prev) => Math.max(prev - 1, 1))} style={{ margin: '10px' }}>Page précédente</button>
            <button onClick={() => setPageC((prev) => (pdf && prev < pdf.numPages) ? prev + 1 : prev)} style={{ margin: '10px' }}>Page suivante</button>
           
                                                        <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
                                                    </div>





                                                     
                                                    ) : (
                                                    card.type === "train" ? (
                                                        <div className="train">
                                                        <h2>Prochains départs du <i className="fas fa-train train-icon"></i> RER A <img src={image} alt="RER A Logo" className="rer-a-logo" /></h2>
                                                        {train.map((departure, index) => (
                                                          <div key={index} className="departure">
                                                            <div>{departure.destination}</div>
                                                           {console.log(departure.departure_time)}
                                                            <div>Dans : {Math.floor( (new Date(departure.departure_time) - new Date()) / (1000*60))} minutes </div>
                                                          </div>
                                                        ))}
                                                      </div>

                                                    ) : (
                                                        card.type === "fiches" ? (
                                                            <div className="fiches">
                                                            <h2>Fiches</h2>
                                                            <div className="fiches-container" style={{display: "flex", gap: "15px", flexFlow: "row wrap"}}>
                                                                {fiches.map((fiche, index) => (
                                                                    <div key={index} className="fiche" style={{padding: "25px", borderRadius: "15px", background: '#FF5733', color: "white", width: "300px"}} onClick={() => handleShowFiche(fiche.title)}>
                                                                        <h3 style={{borderBottom: "1px solid white"}}>{fiche.title}</h3>
                                                                        <p>{fiche.description}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        ) : (
                                                            card.type === "traduction" ? (
                                                                <div className="traduction">
                                                                <h2>Traduction</h2>
                                                                <div className="traduction-container" style={{display: "flex", gap: "15px"}}>
                                                                    <div style={{display: "flex", flexDirection: "column",flex:1}}>
                                                                    <h2>Texte d'origine</h2>
                                                                    <div className="traduction-input">
                                                                        <p>{initialTraduction}</p>
                                                                    </div>
                                                                    </div>
                                                                    <div>
                                                                    <h2>Texte traduit</h2>
                                                                    <div className="traduction-output">
                                                                        <p>{finalTraduction}</p>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>

                                                            ): (
                                                                card.type === "feeds" ? (
                                                                    <div className="feeds">
    <h2>Actualitées</h2>
    <div className="feeds-container">
        {feeds.map((feed, index) => (
            <div key={index} className="feed">
                <h3>{feed.journal}</h3>
                <p>{feed.headline}</p>
            </div>
        ))}
    </div>
</div>

                                                                ) : (

                                                                card.type === "reveil" ? (

                                                                    <div className="reveil">
                                                                    <h2>Liste des réveils programmés</h2>
                                                                    <div className="reveil-container">
                                                                        {alarms.map((alarm, index) => (
                                                                            <div key={index} className="alarm">
                                                                                <h3>{alarm[0]}</h3>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                ) : (
                                                                    card.type === "qcm" ? (
                                                                <div className="qcm">
                                                                <h2>QCM</h2>
                                                                <div className="qcm-container">
                                                                    {qcms.map((qcm, index) => (
                                                                        <div key={index} className="qcm">
                                                                            <h3>{qcm}</h3>
                                                                            <button onClick={() => handleGetQcm(qcm)}>
                                                                                Démarrer le QCM
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                </div>
                                                                    ) : (
                                                                        card.type == "taches" ? (
                                                                            <div className="task-manager">
                                                                            <h2>Gestionnaire de tâches</h2>
                                                                            <div className="columns">
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
                                                                      
   
                                                                        ) : (

                                        <div className="blank-card">Blank Card</div>
                                                                    )
                                                                )
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                                )
                                    )
                                )
                                    
                                    )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={cards.length - 1}
                        value={currentIndex}
                        onChange={handleSliderChange}
                        className="slider-range"
                    />
                </main>
                <footer>
                    <div className="footer-space">
                        <div className="footer-container">
                            <p className="footer-text">
                                Bienvenue dans votre dashboard !
                            </p>
                        </div>
                        <img src={icon} alt="flowbot icon" className="footer-image" />
                    </div>
                </footer>
            </>
            )}
        </div>
    );
}

export default Homepage;









