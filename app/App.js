import React, { useEffect } from 'react';
import io from 'socket.io-client';
import config from "../config.json";
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faMars, faVenus, faVoicemail } from '@fortawesome/free-solid-svg-icons';
import "./Questions.css"
const App = () => {
  
    const [hasFinishedStarter, setHasFinishedStarter] = useState(false);
   const [processFinished, setProcessFinished] = useState(false);
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
            // Send the message "mobile" to the WebSocket server upon connection
            socket.emit('message', 'mobile');
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


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const data = [
        { title: "Quel est votre nom ?", type: "text", icon: faUser },
        { title: "Quelle voix préférez-vous ?", type: "radio", options: ["Homme", "Femme"], icon: faVoicemail },
    ];
    const [name, setName] = useState("");
    const [voicePreference, setVoicePreference] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleVoicePreferenceChange = (event) => {
        setVoicePreference(event.target.value);
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
                      has_finished: 1
                    }
                })
                const socket = io(`http://${config.URL}:5000`);
                socket.emit("message", "gogo")
                axios({
                    method: 'post',
                    url: `http://${config.URL}:5000/api/updatePreferences`,
                    data: {
                        name: name,
                        voice: voicePreference
                    }
                })
                setCurrentQuestionIndex(0);
                setName("");
                setVoicePreference("");
                setHasFinishedStarter(true);
            }
        }
    };









    return (
      hasFinishedStarter || processFinished ? (

        
        <div>
        <h1>App</h1>
    </div>
      ) : (
        <div className="questions-container">
        <div className="questions-card">
            <FontAwesomeIcon icon={data[currentQuestionIndex].icon} size="50" />
            <h1> {currentQuestionIndex === 0 ? `Commençons` : `Très bien ${name}`},  {data[currentQuestionIndex].title}</h1>
            {data[currentQuestionIndex].type === "text" ? (
                <input
                    type="text"
                    placeholder="Réponse"
                    value={name}
                    onChange={handleNameChange}
                    className={showToast && !name ? "invalid" : ""}
                />
            ) : (
                data[currentQuestionIndex].options.map((option, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            value={option}
                            checked={voicePreference === option}
                            onChange={handleVoicePreferenceChange}
                        />
                        <span>{option}</span>
                    </label>
                ))
            )}
            <button onClick={handleNextQuestion} style={{ border: "none", outline: "none", padding: "15px", borderRadius: "5px", cursor: "pointer", background: "#2E2E2E", color: "white", alignSelf: "flex-end" }}>Suivant</button>
            {showToast && <div className="toast">Veuillez remplir tous les champs avant de passer à la question suivante.</div>}
        </div>
    </div> 
      )
       
    );
}

export default App;
