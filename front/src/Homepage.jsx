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
const Homepage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);
    const [phoneConnected, setPhoneConnected] = useState(false);
    const [musicInfo, setMusicInfo] = useState({});

    const cards = [
        {
            type: "weather",
           
            icon: icon2,
        }, 
        {
            type: "music",
           
        }, {
            type: "timetable"
        }, {}, {}
    ]; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const r1 = await axios.get(`http://${config.URL}:5000/api/getCity`);
                const r2 = await axios.post(`http://${config.URL}:5000/api/getWeather`, { location: r1.data.result });
                setWeather(r2.data.result);
                console.log(r2.data.result);
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
            }
            console.log('Message received: ' + message);
        });

        fetchData(); // Appel initial
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSliderChange = (event) => {
        setCurrentIndex(Number(event.target.value));
    };
    const timeConvert = (n) => {
        // format into Minutes:Seconds
        var num = n;
        var minutes = Math.floor(num / 60);
        var seconds = Math.floor(num % 60);
        return minutes + ":" + seconds;

      
    }




    const [elements, setElements] = useState([]);
    const [newElement, setNewElement] = useState({
      name: "",
      day: 0,
      startTime: 0,
      endTime: 0
    });
  
    const addElement = () => {
      const id = Date.now(); 
      setElements([...elements, { ...newElement, id }]);
      setNewElement({
        name: "",
        day: 0,
        startTime: 0,
        endTime: 0
      });
    };
  
    const timeSlots = Array.from(Array(24).keys());
  
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  






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
      <div className="add-element">
        <input
          type="text"
          placeholder="Nom"
          value={newElement.name}
          onChange={(e) => setNewElement({ ...newElement, name: e.target.value })}
        />
        <select
          value={newElement.day}
          onChange={(e) => setNewElement({ ...newElement, day: parseInt(e.target.value) })}
        >
          {daysOfWeek.map((day, index) => (
            <option key={index} value={index}>{day}</option>
          ))}
        </select>
        <select
          value={newElement.startTime}
          onChange={(e) => setNewElement({ ...newElement, startTime: parseInt(e.target.value) })}
        >
          {timeSlots.map((time) => (
            <option key={time} value={time}>{time}:00</option>
          ))}
        </select>
        <select
          value={newElement.endTime}
          onChange={(e) => setNewElement({ ...newElement, endTime: parseInt(e.target.value) })}
        >
          {timeSlots.map((time) => (
            <option key={time} value={time}>{time}:00</option>
          ))}
        </select>
        <button onClick={addElement}>Ajouter</button>
      </div>
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
            key={element.id}
            className="element"
            style={{
              gridRowStart: element.startTime + 2,
              gridRowEnd: element.endTime + 2,
              gridColumn: element.day + 2,
            }}
          >
            {element.name}
            <div>{element.startTime}:00 - {element.endTime}:00</div>
          </div>
        ))}
      </div>
    </div>
                                            ): (
                                        <div className="blank-card">Blank Card</div>))
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









