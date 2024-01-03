import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';

const RouterDef = () => (
    <Router>
        <Routes>
            <Route exact path="/" element={<App />} />
        </Routes>
    </Router>
);

export default RouterDef;
