import React from 'react';
import axios from 'axios';

function App() {
    const handleSay = (textToSay) => {

        axios.post('http://localhost:5000/talk', {
            textToSay
        }).then((response) => {
            console.log(response.data);
        });

    }

    let [message, setMessage] = React.useState('');
    return (
        <div>
            
            <form>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="button" onClick={() => handleSay(message)}>Say</button>
            </form>
        </div>
    );
}

export default App;
