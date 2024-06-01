import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Test from './Test/Test';
import Starter from './Starter';
import Homepage from './Homepage'; 
import axios from 'axios';
import config from "../../config.json";
import { useEffect, useState } from 'react';

const App = () => {
    const [hasFinishedStarter, setHasFinishedStarter] = useState(false);

    useEffect(() => {
        axios({
            method: 'get',
            url: `http://${config.URL}:5000/api/hasFinishedStarter`,
        }).then((response) => {
            if (response.data.result === 1) {
                setHasFinishedStarter(true);
            }
        });
    }, []);

    return (
        <Router>
            <Routes>
                <Route 
                    exact 
                    path="/" 
                    element={hasFinishedStarter ? <Navigate to="/accueil" /> : <Starter />} 
                />
               
                <Route 
                    path="/accueil" 
                    element={hasFinishedStarter ? <Homepage /> : <Navigate to="/" />} 
                />
                <Route path="/test" element={<Test />} />
            </Routes>
        </Router>
    );
}

export default App;
