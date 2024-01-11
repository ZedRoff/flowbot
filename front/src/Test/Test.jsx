import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { socket } from '../socket';

const Test = () => {

    let inputRef = useRef(null);


    let [messages, setMessages] = useState([]);

 



   

    const handleSend = () => {
        let message = inputRef.current.value;
        if (message === "") return alert("Veuillez entrer un message")
        setMessages((messages) => [...messages, {message, isBot: false}]);
        axios({
            method: 'post',
            url: '/api/useCommand',
            data: {
                message
            }
        }).then((response) => {
           if(response.data.result === "success") {
            inputRef.current.value = "";
           }else {
            alert("Erreur lors de l'utilisation de la commande")
           }
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
        socket.on('message', (data) => {
           setMessages((messages) => [...messages, {message: data.message, isBot: true}]);
        });
    }, [])

    return (
        <div className="test-container">
           
            <div className="chat-bot">
                <div className="chat-bot-container">
                 
                    <div className="chat-bot-body">
                        <div className="chat-bot-message">
                            {messages.map((message, idx) => (
                                <div key={idx} className={message.isBot ? 'bot-message' : 'user-message'}>{String(message.message)}</div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-bot-footer">
                        <input type="text" placeholder="Message" ref={inputRef} />
                        <button onClick={handleSend}>Envoyer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Test;
