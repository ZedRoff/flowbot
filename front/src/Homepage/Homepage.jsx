import React, { useEffect, useState } from "react"
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
      setColor1(data.message.color1)
      setColor2(data.message.color2)
    })
  }, [])








  return (
    <div className="app_container" style={{background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`}}>
      <h1>Homepage</h1>
    </div>
  )
}

export default Homepage
