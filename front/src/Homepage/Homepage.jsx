import React, {useEffect} from 'react';
import axios from 'axios';
import { socket } from '../socket';
function App() {
    
    const handleSay = (textToSay) => {
        axios({
            method: 'post',
            url: '/api/talk',
            data: {
                textToSay
            }
        }).then((response) => {
            console.log(response.data);
        })


    }
    const handleKeyDown = (e) => {
        
        if (e.key === 'Enter') {
            handleSay(message);
        }
    }

    let [message, setMessage] = React.useState('');
    let [isOn, setIsOn] = React.useState(false);
    useEffect(() => {
        axios({
            method: "get",
            url: "/api/test"
        }).then((response) => {
            if(response.data == "Hello, World!") {
                setIsOn(true);
            }

    })
    }
    , [])

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        })
    }
    , [])



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',flexDirection: 'column' }}>
        <div>BACKEND {isOn ? <h1>ON</h1> : <h1>OFF</h1>}</div>
            <form style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} style={{  marginBottom: '10px', padding: '10px' }} />
                <button type="button" onClick={() => handleSay(message)} style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Say</button>
            </form>
        </div>
    );
}

export default App;
