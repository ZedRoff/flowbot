import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { socket } from '../socket';

const Test = () => {

    let inputRef = useRef(null);

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    let [commands, setCommands] = useState([]);
    let [messages, setMessages] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === "" || message === "") return alert("Veuillez remplir tous les champs")
        axios({
            method: 'post',
            url: '/api/addCommand',
            data: {
                name: name,
                reply: message
            }
        }).then((response) => {
            if (response.data.result === "success") {
                alert("Commande ajoutée")
                handleFetch()
            }
            else if (response.data.result === "alreadyexists") alert("La commande existe déjà")
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleFetch = () => {
        axios({
            method: 'get',
            url: '/api/getCommands',
            
        }).then((response) => {
            setCommands(response.data.result)
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleDelete = (commandId) => {
        axios({
            method: 'post',
            url: `/api/deleteCommand`,
            data: {
                uuid: commandId
            }
        }).then((response) => {
            if (response.data.result === "success") {
                alert("Commande supprimée")
                handleFetch()
            }
            else if (response.data.result === "notfound") alert("La commande n'existe pas")
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        handleFetch()
    }, [])

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
            <div className="command_maker">
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label htmlFor="name">Nom:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <input
                            type="text"
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-button">Crée la commande</button>
                </form>
                <div className="command_list">
                    {commands.map((command, idx) => (
                        <div className="command" key={idx}>
                            <div className="command_name">{command[1]}</div>
                            <div className="command_reply">{String(command[2])}</div>
                            <button className="delete-button" onClick={() => handleDelete(command[0])}>Supprimer</button>
                        </div>
                    ))}
                </div>
            </div>
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
