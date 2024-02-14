import { View, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config.json';

const Background = () => {
    let [color1, setColor1] = useState("")
    let [color2, setColor2] = useState("")

    const handleChangeBackground = () => {
        if(color1 === "" || color2 === "") return alert("Veuillez remplir tous les champs")
        axios({
          method: "post",
          url: `http://${config.URL}:5000/api/changeBackground`,
          data: {
            color1: color1,
            color2: color2
          }
        }).then((response) => {
          if(response.data.result === "success") {
            axios({
              method: "post",
              url: `http://${config.URL}:5000/api/emitMessage`,
              data: {message: {color1, color2}, command: "background"}
            })
    
            alert("Fond d'écran changé")
    
          }
          else alert("Erreur lors du changement de fond d'écran")
        })
      }
    return (
        <View style={styles.backgroundContainer}>
        <Text style={styles.title}>Changer le fond d'écran</Text>
        <Text style={styles.label}>Couleur 1</Text>
        <TextInput placeholder="Exemple : #00FFFF" style={styles.input}  onChangeText={(text) => setColor1(text)}/>
        <Text style={styles.label}>Couleur 2</Text>
        <TextInput placeholder="Exemple : #00FFFF" style={styles.input} onChangeText={(text) => setColor2(text)} />
        <Button title="Changer" onPress={handleChangeBackground} />
      </View>


    );
    }

    const styles = {
        backgroundContainer: {
            padding: 10,
            backgroundColor: '#f5f5f5',
            borderRadius: 5,
            marginBottom: 10,
        
          },
          title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
          },
          label: {
            fontSize: 16,
            marginBottom: 5,
          
          },
            input: {
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 5,
                marginBottom: 10,
            }
    }

export default Background;
