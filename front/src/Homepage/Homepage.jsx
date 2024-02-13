import { useEffect, useState } from "react";
import { socket } from "../socket.js";
import axios from "axios";
import config from "../../../config.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";


const Homepage = () => {
  let [color1, setColor1] = useState("");
  let [color2, setColor2] = useState("");
  let [showPopup, setShowPopup] = useState(false);
  let [files, setFiles] = useState([])
  
  let [stopWatch, setStopWatch] = useState("00:00:00");
  useEffect(() => {
    axios({
      method: "get",
      url: `http://${config.URL}:5000/api/getBackground`,
    })
      .then((response) => {
        setColor1(response.data.result[0][0]);
        setColor2(response.data.result[0][1]);
      })
      .catch((error) => {
        console.log(error);
      });
    }, [])


      

  let Chronometre = (props) => {
    return (
      <div className="chronometre">
        <h2>{props.stopWatch}</h2>
      </div>
    );
  };

  let Rappels = () => {
    return (
      <div className="rappels">
        <h2>Rappels</h2>
      </div>
    );
  };

  let Minuteur = () => {
    return (
      <div className="minuteur">
        <h2>Minuteur</h2>
      </div>
    );
  };

  let Fiches = () => {
    return (
      <div className="fiches">
        <h2>Fiches</h2>
      </div>
    );
  };

  let Blank = () => {
    return <></>;
  };

  let [positions, setPositions] = useState([]);
  let corr = {
    chronometre: Chronometre,
    rappels: Rappels,
    minuteur: Minuteur,
    fiches: Fiches,
    null: Blank,
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
   
    socket.on("message", (data) => {
      
      if (data.command == "background") {
        setColor1(data.message.color1);
        setColor2(data.message.color2);
      } else if (data.command == "positions") {
        let arr = Object.values(data.message);
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
         
          temp.push(corr[arr[i]]);
        }
        setPositions(temp);
      } else if(data.command == "stopwatch") {
       
        setStopWatch(data.message);
      } else if(data.command == "show_files") {
        setShowPopup(true);
        axios({
          method: "get",
          url: `http://${config.URL}:5000/api/getFiles`,

        }).then(res => {
          setFiles(res.data.files);
        
        })

      } else if(data.command == "hide_files") {
        setShowPopup(false);
      }
    });
  }, []);

  let [loaded, setLoaded] = useState(false);

  useEffect(() => {


    axios({
      method: "get",
      url: `http://${config.URL}:5000/api/getPositions`,
    })
      .then((response) => {
        for (let i = 0; i < response.data.result.length; i++) {
          
          setPositions((positions) => [
            ...positions,
            corr[response.data.result[i]],
          ]);
        }
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const unshowPopup = () => {
    setShowPopup(!showPopup);
  }


  return loaded ? (
    <div
      className="app_container"
      style={{ background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)` }}
    >
    <div className="popup" style={{display: showPopup ? "flex": "none"}}>
      <div className="popup_inside">
        <div className="popup_header">
          <h2>Popup</h2>
         <FontAwesomeIcon icon={faX} className="cross" onClick={unshowPopup} />
        </div>
        <div className="popup_content">
         {files.map((file, index) => {
            return (
              <div className="file" key={index}>
                {file}
              </div>
            )
          
          })
         }
</div>
      </div>
    </div>
      <div className="app_left">
        {positions[0] == undefined ? <></> : positions[0]({stopWatch})}
        {positions[1] == undefined ? <></> : positions[1]({stopWatch})}
      </div>
      <div className="app_right">
        {positions[2] == undefined ? <></> : positions[2]({stopWatch})}
        {positions[3] == undefined ? <></> : positions[3]({stopWatch})}
      </div>
    </div>
  ) : (
    <h1>Chargement ...</h1>
  );
};

export default Homepage;
