import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UserTypeSelection from './components/UserTypeSelection';
import SignUpPage from './components/SignUpPage';
import SignUpGPPage from './components/SignUpGPPage';
import SignInPage from './components/SignInPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-type" element={<UserTypeSelection />} />
        <Route path="/signup-lp" element={<SignUpPage />} />
        <Route path="/signup-gp" element={<SignUpGPPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
