import { useEffect, useState } from 'react';
import axios from 'axios';
const Test = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    let [commands, setCommands] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
       
        axios({
            method: 'post',
            url: '/api/addCommand',
            data: {
                name: name,
                reply: message
            }
        }).then((response) => {
            handleFetch()
        }
        ).catch((error) => {
            console.log(error);
        });

    };
    const handleFetch = (e) => {
        axios({
            method: 'get',
            url: '/api/getCommands'
        }).then((response) => {
            setCommands(response.data.result)
            console.log(response.data.result)
          
    }
        ).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {

    handleFetch()

    }, [])

    const handleSay = (message) => {
        axios({
            method: 'post',
            url: '/api/talk',
            data: {
                textToSay: message
            }
        }).then((response) => {
            console.log(response)
        }
        ).catch((error) => {
            console.log(error);
        });
    }

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
            <p>Pour test, clique sur la commande ci-bas</p>
        </form>
       
       <div className="command_list">
 
{commands.map((command, idx) => (
    <div className="command" key={idx} onClick={() => handleSay(command[2])}>
    <div className="command_name">{command[1]}</div>
    <div className="command_reply">{command[2]}</div>
    </div>
)) }




       </div>
       </div>
        </div>
  
    ) }

export default Test;
