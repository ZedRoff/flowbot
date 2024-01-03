import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage/Homepage';

const App = () => (
    <Router>
        <Routes>
            <Route exact path="/" element={<Homepage />} />
        </Routes>
    </Router>
);

export default App;
