import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import Test from './Test/Test';

const App = () => (
    <Router>
        <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    </Router>
);

export default App;
