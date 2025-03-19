import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import LandingPage from './components/Landing/LandingPage';
import UserTypeSelection from './components/UserTypeSelection';
import { TeamPage } from './components/Team';
import { SignUpPage } from './components/SignInUp/SignUpPage';
import { SignUpGPPage } from './components/SignInUp/SignUpGPPage';
import { SignInPage } from './components/SignInUp/SignInPage';
import { AboutUsPage } from './components/AboutUs';
import { InvestorEducationPage } from './components/LearnMore/LearnMoreInvestor';
import { LearnMorePage } from './components/LearnMore/LearnMoreVC';
import { FAQDropdown } from './components/LearnMore/FAQ';

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
        <Route path="/learn-more-investor" element={<InvestorEducationPage />} />
        <Route path="/learn-more-gp" element={<LearnMorePage />} />
        <Route path="/faq" element={<FAQDropdown />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
