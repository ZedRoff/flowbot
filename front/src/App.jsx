import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './Test/Test';
import Starter from './Starter';
import Questions from './Questions';
import Homepage from './Homepage'; 
const App = () => {
    return(
    <Router>
        <Routes>
          
            <Route exact path="/" element={<Starter />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/accueil" element={<Homepage />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    </Router>)
}

export default App;
