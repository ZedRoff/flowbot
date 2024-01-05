import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faIcons, faMusic, faTools, faWifi } from '@fortawesome/free-solid-svg-icons';
import AppContainer from './AppContainer';
function App() {
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

 

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
            setIsOn(true);
           
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
            setIsOn(false);
          
        });
        socket.on('message', (data) => {
            console.log(data);
            setLastCommandUsed(data); 
            
        });
    }, []);

    return (
        <div className="App">
            <header style={{  display: "flex", padding: "15px", justifyContent: "space-between", alignItems: "center", width: "100%"   }}>
              <div style={{display: "flex", flexDirection: "column", gap: "15px",}}>
                <h1>Flowbot</h1>
                </div>
              <div style={{alignSelf: "flex-end", display: "flex",  gap: "15px",}}>
                    <h2 className="battery">{Math.round(Math.random() * 100)}%</h2>
                    <h2 className="wifi">
                     <FontAwesomeIcon icon={faWifi} className={isOn ? "connected" : "not_connected"} />
                    </h2>
                    </div>
            
            </header>
            <main className="main-container">
              <AppContainer name="Réveil" icon={faIcons} />
                <AppContainer name="Musique" icon={faMusic} />
                <AppContainer name="Fichiers" icon={faFolder} />
                <AppContainer name="Test" icon={faTools} />

            </main>
          
        </div>
    );
}

export default App;
