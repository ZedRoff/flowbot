import React, { useState, useEffect } from 'react';
import './Starter.css'; // Importer le fichier CSS

// Importer les images
import icon1 from './images/hello.jpg';
import icon3 from './images/productivity.png';
import icon4 from './images/meet.jpg';

const Starter = () => { 
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
        console.log(i, res.length)
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
                }, 1000); 
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

    // Redirection vers la page de questions une fois l'introduction terminée
    useEffect(() => {
        if (introFinished) {
            window.location.href = "/questions";
        }
    }, [introFinished]);

    return (
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
    );
}

export default Starter;
