import React, { useState } from "react";
import "./Questions.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMars, faVenus, faVoicemail } from '@fortawesome/free-solid-svg-icons';

const Questions = () => {
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

                window.location.href = "/accueil"
                setCurrentQuestionIndex(0);
                setName("");
                setVoicePreference("");
            }
        }
    };

    return (
        <div className="questions-container">
            <div className="questions-card">
                <FontAwesomeIcon icon={data[currentQuestionIndex].icon} size="3x" />
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
    );
};

export default Questions;
