import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { faMapPin, faMicrophoneSlash, faPhone, faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Homepage.css";
import icon from "./images/flo.png";
import icon2 from "./images/sunny-day.png";
import config from "../../config.json";
import axios from 'axios';

const Homepage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);
    const [phoneConnected, setPhoneConnected] = useState(false);

    const cards = [
        {
            type: "weather",
            location: weather["City"],
            day: weather["day"],
            temperature: weather["Temperature"] + "°C",
            weather: weather["ressenti"],
            humidity: weather["Humidity"] + "%",
            wind: weather["Wind Direction"],
            precipitation: weather["Precipitation"] + "%",
            icon: icon2,
        }, 
        {}, {}, {}, {}
    ]; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const r1 = await axios.get(`http://${config.URL}:5000/api/getCity`);
                const r2 = await axios.post(`http://${config.URL}:5000/api/getWeather`, { location: r1.data.result });
                setWeather(r2.data.result);
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

            console.log(message)
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
                console.log("MUSICMSUCISIS")
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
                                                <h2>{card.day}</h2>
                                                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                                                    <FontAwesomeIcon icon={faMapPin} size="2x" />
                                                    <h2 style={{ fontSize: "20px" }}>{card.location}</h2>
                                                </div>
                                            </div>
                                            <div><img src={card.icon} alt="no image cloud" style={{ width: "100px", height: "100px", color: "white", marginLeft: "30px" }} /></div>
                                            <div style={{ width: "100%", borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px", display: "flex" }}>
                                                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "15px", padding: "10px", borderBottomLeftRadius: "15px" }}>
                                                    <h1 style={{ fontWeight: "950" }}>{card.temperature}</h1>
                                                    <h1 style={{ fontWeight: "bold" }}>{card.weather}</h1>
                                                </div>
                                                <div style={{ flex: 2, background: "#1C3746", borderTopLeftRadius: "50px", padding: "25px", borderBottomRightRadius: "15px", paddingBottom: "0px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                                                  
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                                                        <h2>VENT</h2>
                                                        <h2>{card.wind}</h2>
                                                    </div>
                                                  
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="blank-card">Blank Card</div>
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









