import { useEffect, useState } from "react"
import {socket} from "../socket.js"
import axios from "axios"
import config from "../../../config.json"
const Homepage = () => { 
  let [color1, setColor1] = useState("")
  let [color2, setColor2] = useState("")



 
 


  useEffect(() => {
    axios({
      method: "get",
      url: `http://${config.URL}:5000/api/getBackground`
    }).then((response) => {
  
      setColor1(response.data.result[0][0])
      setColor2(response.data.result[0][1])
    }).catch((error) => {
      console.log(error)
    }
    )

  }, [])
 



 
let Chronometre = () => {
  return(
    <div className="chronometre">

<h2>Chronometre</h2>

    </div>
   
  )
}
let Rappels = () => {
  return(
    <div className="rappels">

    <h2>Rappels</h2>
    
        </div>
       
  )
}
let Minuteur = () => {
  return(
    <div className="minuteur">

    <h2>Minuteur</h2>
    
        </div>
       
  )
}
let Fiches = () => {
  return(
    <div className="fiches">

    <h2>Fiches</h2>
    
        </div>
       
  )
}
let Blank = () => {
  return(
    
       <></>
  )
}


let [positions, setPositions] = useState([])


useEffect(() => {
  socket.on("connect", () => {
    console.log("connected")
  }
  )
  socket.on("disconnect", () => {
    console.log("disconnected")
  }
  )

  socket.on("message", (data) => {

    if(data.command == "background") {
      setColor1(data.message.color1)
      setColor2(data.message.color2)
    } else if(data.command == "positions") {
      let arr = Object.values(data.message)
      
     
      let temp = []
      for(let i=0;i<arr.length;i++) {
        let corr = {
          "chronometre": Chronometre,
          "rappels": Rappels,
          "minuteur": Minuteur,
          "fiches": Fiches,
          null: Blank
        
        }
  
          temp.push(corr[arr[i]])
        
      }
      setPositions(temp)
    }
  
  })
}, [])

let [loaded, setLoaded] = useState(false)
useEffect(() => {

  axios({
    method: "get",
    url: `http://${config.URL}:5000/api/getPositions`,
  }).then((response) => {
    for(let i=0;i<response.data.result.length;i++) {
      let corr = {
        "chronometre": Chronometre,
        "rappels": Rappels,
        "minuteur": Minuteur,
        "fiches": Fiches,
        null: Blank
      
      }
     
      setPositions((positions) => [ ...positions, corr[response.data.result[i]]])
   
    }

    setLoaded(true)
   
  }).catch((error) => {
    console.log(error)

})
}, [])









  return (
   
 loaded ? 
  <div className="app_container" style={{background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`}}>
    <div className="app_left">
  
    {positions[0] == undefined ? <></> : positions[0]()}
   {positions[1] == undefined ? <></> : positions[1]()}
   
 
   </div>
   <div className="app_right">
   {positions[2] == undefined ? <></> : positions[2]()}
   {positions[3] == undefined ? <></> : positions[3]()}
    </div>

    </div>

    : <h1>Chargement ...</h1>
   

  )
}

export default Homepage
