import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UserTypeSelection from './components/UserTypeSelection';
import SignUpPage from './components/SignUpPage';
// Import your GP signup page when you create it
// import SignUpGPPage from './components/SignUpGPPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-type" element={<UserTypeSelection />} />
        <Route path="/signup-lp" element={<SignUpPage />} />
        {/* Add the GP signup route when you create it */}
        {/* <Route path="/signup-gp" element={<SignUpGPPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
