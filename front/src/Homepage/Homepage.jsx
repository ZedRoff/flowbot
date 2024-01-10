import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faIcons, faMusic, faTools, faWifi } from '@fortawesome/free-solid-svg-icons';
import AppContainer from './AppContainer';
import axios from 'axios';
import { socket } from '../socket';
function App() {
    const [isOn, setIsOn] = useState(false);
    const [isListening, setIsListening] = useState(false);

    
    useEffect(() => {
      socket.on("connect", () => {
        console.log("connected")
      })
      socket.on("message", (data) => {
        console.log(data)
        if(data.message === "listening") setIsListening(true)
        else if(data.message === "notlistening") setIsListening(false)
      })
      
    }, [])

 

    

    return (
        <div className="App">
      <div className="princ_container">
          <div className="title_div">
            <h1 className="title">Flowbot</h1>
          </div>
          <div className="smiley_div">
            <div className="row_1">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <div className="row_1">
              <div className="rectangle"></div>
              </div>
          </div>
          <div className="listening_div">
            <div className="listening_circle" style={{background: isListening ? "green" : "red", animation: isListening ? "1s float infinite ease-in-out" : ""}}></div>
          </div>


</div>

        </div>
    );
}

export default App;
