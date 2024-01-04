import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../socket';

function App() {
    const [message, setMessage] = useState('');
    const [isOn, setIsOn] = useState(false);
    const [lastCommandUsed, setLastCommandUsed] = useState(null);

    const handleSay = (textToSay) => {
        axios({
            method: 'post',
            url: '/api/talk',
            data: {
                textToSay
            }
        }).then((response) => {
            console.log(response.data);
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSay(message);
        }
    };

    useEffect(() => {
        axios({
            method: 'get',
            url: '/api/test'
        }).then((response) => {
            if (response.data === 'Hello, World!') {
                setIsOn(true);
            }
        });
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
        socket.on('message', (data) => {
            console.log(data);
            setLastCommandUsed(data); // Update lastCommandUsed with the received data
        });
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '24px', margin: '0' }}>Chatbot</h1>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>BACKEND {isOn ? <span style={{ color: '#4CAF50' }}>ON</span> : <span style={{ color: '#f44336' }}>OFF</span>}</div>
                <div style={{ marginBottom: '10px' }}>Dernière commande utilisée : {lastCommandUsed?.command}</div>
                <form style={{ display: 'flex', flexDirection: 'column' }}>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <button type="button" onClick={() => handleSay(message)} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Say</button>
                </form>
            </div>
        </div>
    );
}

export default App;
