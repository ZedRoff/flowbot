import React, { useState, useEffect } from 'react';
import './Starter.css'; // Importer le fichier CSS

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
            socket.emit('message', 'bot');
            socket.emit('message', 'checkup')
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        socket.on('message', (message) => {
            console.log(message)
            if(message == "mobile_connected") {
                setIsMobile(true);
            } else if(message == "mobile_disconnected") {
                setIsMobile(false);
                
            }  else if(message == "gogo") {
                window.location.href = "/accueil"
            }



            for(let i = 0; i < message.length; i++){
                if(message[i].type == "mobile") {
                    setIsMobile(true);
                }
             
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
        isMobile ? (


            !introFinished ? (
                <div className="starter-container">
                <div className="starter-content">
                    <div className="starter-text-container">
                        <h1 className="starter-text" dangerouslySetInnerHTML={{ __html: content + '<span class="cursor"></span>' }}></h1>
                    </div>
                    <div className="starter-image-container">
                        <img src={res[i]?.image} alt="illustration" className="starter-image" key={i} /> {/* Ajouter la clé unique */}
                    </div>
                </div>
            </div>  
            ) : (
                <h1>Regardez le téléphone</h1>
            )
           
        ) : (
            <h1>Connectez le téléphone</h1>
        )
       
    );
}

export default Starter;
