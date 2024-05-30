import React, { useState } from 'react';
import { faMapPin, faMicrophoneSlash, faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Homepage.css";
import icon from "./images/flo.png";
import icon2 from "./images/sunny-day.png";

const Homepage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = [
        {
            type: "weather",
            location: "Champs sur Marne",
            day: "Jeudi",
            temperature: "15°C",
            weather: "Nuageux",
            humidity: "18%",
            wind: "45%",
            precipitation: "85%",
            icon: icon2,
        }, 
        {}, {}, {}, {}
    ]; 

    const handleSliderChange = (event) => {
        setCurrentIndex(Number(event.target.value));
    };

    return (
        <div style={{ height: "100vh" }}>
            <header className="header">
                <div className="header-space">
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
                                                    <h2>HUMIDITE</h2>
                                                    <h2>{card.humidity}</h2>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                                                    <h2>VENT</h2>
                                                    <h2>{card.wind}</h2>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                                                    <h2>PRECIPITATION</h2>
                                                    <h2>{card.precipitation}</h2>
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
        </div>
    );
}

export default Homepage;
