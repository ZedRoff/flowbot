import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { faMapPin, faMicrophoneSlash, faPauseCircle, faPhone, faPlayCircle, faWifi } from "@fortawesome/free-solid-svg-icons";
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const r1 = await axios.get(`http://${config.URL}:5000/api/getCity`);
                const r2 = await axios.post(`http://${config.URL}:5000/api/getWeather`, { location: r1.data.result });
                setWeather(r2.data.result);
                fetchDays()
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

          

            let who = message["from"];
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
    }, []);


    return (
        <div style={{ height: "100vh" }}>
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

                                        <div className="blank-card">Blank Card</div>
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









