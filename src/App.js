import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import LandingPage from './components/Landing/LandingPage';
import UserTypeSelection from './components/UserTypeSelection';
import { TeamPage } from './components/Team';
import { SignUpPage } from './components/SignInUp/SignUpPage';
import { SignUpGPPage } from './components/SignInUp/SignUpGPPage';
import { SignInPage } from './components/SignInUp/SignInPage';
import { AboutUsPage } from './components/AboutUs';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-type" element={<UserTypeSelection />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-gp" element={<SignUpGPPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/about" element={<AboutUsPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
