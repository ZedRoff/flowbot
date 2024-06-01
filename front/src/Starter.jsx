import React, { useState, useEffect } from 'react';
import './Starter.css'; // Importer le fichier CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faPlug } from "@fortawesome/free-solid-svg-icons";

// Importer les images
import icon1 from './images/hello.jpg';
import icon3 from './images/productivity.png';
import icon4 from './images/meet.jpg';

import io from 'socket.io-client';

import config from "../../config.json";

const Starter = () => { 

    let [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
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
                setIsMobile(msg);
            } else if(type == "check_mobile_connected") {
                setIsMobile(msg)
            } else if(type == "starter_finished") {
                window.location.href = "/accueil"
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const res = React.useMemo(() => [
        { text: "Bonjour, Je suis Flowbot", image: icon1 }, 
        { text: "Je suis un assistant virtuel, qui vous aide a être plus productif", image: icon3 }, 
        { text: "Faisons donc connaissance !", image: icon4 }
    ], []);

    const [content, setContent] = useState('');
    const [i, setI] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [introFinished, setIntroFinished] = useState(false); // État pour suivre si l'introduction est terminée

    const importantWords = ["Flowbot", "assistant virtuel", "productif", "connaissance"];

    const highlightImportantWords = (text) => {
        let highlightedText = text;
        importantWords.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlightedText = highlightedText.replace(regex, `<span class="highlight">$1</span>`);
        });
        return highlightedText;
    };

    useEffect(() => {
      
        if (i < res.length) {
            if (charIndex < res[i].text.length) {
                const timer = setTimeout(() => {
                    setContent(prev => prev + res[i].text[charIndex]);
                    setCharIndex(charIndex + 1);
                }, 75); 
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setI(i + 1);
                    setCharIndex(0);
                    setContent('');
                }, 100); 
                return () => clearTimeout(timer);
            }
        } else {
           
            setIntroFinished(true); // Marquer l'introduction comme terminée
        }
    }, [charIndex, i, res]);

    useEffect(() => {
        if (charIndex === res[i]?.text.length) {
            setContent(prev => highlightImportantWords(prev));
        }
    }, [charIndex, res, i]);

   

    return (
        <div className="starter-container">
            {!introFinished ? (
                <div className="starter-content">
                    <div className="starter-text-container">
                        <h1 className="starter-text" dangerouslySetInnerHTML={{ __html: content + '<span class="cursor"></span>' }}></h1>
                    </div>
                    <div className="starter-image-container">
                        <img src={res[i]?.image} alt="illustration" className="starter-image" key={i} /> {/* Ajouter la clé unique */}
                    </div>
                </div>
            ) : (
                <div className="phone-connect-container">
                    {isMobile ? (
                        <>
                            <FontAwesomeIcon icon={faMobileAlt} size="3x" className="phone-icon" />
                            <h1>Complétez le formulaire sur téléphone</h1>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faPlug} size="3x" className="phone-icon" />
                            <h1>Connectez le téléphone</h1>
                        </>
                    )}
                </div>
            )}
        </div>  
    );
}

export default Starter;
