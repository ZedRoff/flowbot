import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faIcons, faMusic, faTools, faWifi } from '@fortawesome/free-solid-svg-icons';
import AppContainer from './AppContainer';
import axios from 'axios';
function App() {
    const [isOn, setIsOn] = useState(false);
   
    

 

    useEffect(() => {

      axios({
        method: 'get',
        url: '/api/test'
    }).then((response) => {
        if(response.data === "Hello, World!") setIsOn(true)
        else setIsOn(false)
      })
    }, []);

    return (
        <div className="App">
            <header style={{  display: "flex", padding: "15px", justifyContent: "space-between", alignItems: "center", width: "100%"   }}>
              <div style={{display: "flex", flexDirection: "column", gap: "15px",}}>
                <h1>Flowbot</h1>
                </div>
              <div style={{alignSelf: "flex-end", display: "flex",  gap: "15px",}}>
                    <h2 className="status">Etat du serveur : </h2>
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
