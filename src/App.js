import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import LandingPage from './components/Landing/LandingPage';
import { SignUpPage } from './components/SignInUp/SignUpPage';
import { SignInPage } from './components/SignInUp/SignInPage';
import { DirectSignUpLP } from './components/SignInUp/DirectSignUpLP';
import { DirectSignUpGP } from './components/SignInUp/DirectSignUpGP';
import { DirectSignInPage } from './components/SignInUp/DirectSignInPage';
import { GPSignInPage } from './components/SignInUp/GPSignInPage';
import { AboutUsPage } from './components/AboutUs/AboutUs';
import { InvestorEducationPage } from './components/LearnMore/LearnMoreInvestor';
import { LearnMorePage } from './components/LearnMore/LearnMoreVC';
import { FAQDropdown } from './components/LearnMore/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import { MFAVerification } from "./components/SignInUp/MFAVerification"
import { LPDashboard } from "./components/Dashboard/LPDashboard"
import { WelcomeAnimation } from './components/Dashboard/WelcomeAnimation';
// import { Portfolio } from "./components/Dashboard/Portfolio"
import { Offerings } from "./components/Dashboard/Offerings"
import { Account } from "./components/Dashboard/Account"
import { Lola } from "./components/Funds/lola"
import { PioneerVC } from './components/Funds/pioneer';
import { RepublicVC } from './components/Funds/republic';
import { UserTypeSelection } from './components/UserTypeSelection';
import { Waitlist } from './components/Waitlist/Waitlist';
import AccessTypePage from './pages/AccessTypePage';
import Profile from './components/Dashboard/Profile';
import GPDashboard from './components/GpDashboard/page';
import NewAnnouncement from './components/GpDashboard/announcement';
import DealFlow from './components/GpDashboard/dealFlow';
import Portfolio from './components/GpDashboard/portfolio';
import { GpMfaVerification } from './components/SignInUp/GpMfaVerification';
import { LPPortfolio } from './components/Dashboard/LPPortfolio';
import { GPCopilot } from './components/GpDashboard/GPCopilot';


function App() {
  return (
    <Router>
      <Routes>
        {/*Marketing*/}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/learn-more-investor" element={<InvestorEducationPage />} />
        <Route path="/learn-more-gp" element={<LearnMorePage />} />
        <Route path="/faq" element={<FAQDropdown />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />

        {/*LP Platform*/}
        <Route path="/mfa-verification" element={<MFAVerification />} />
        <Route path="/dashboard" element={<LPDashboard />} />
        <Route path="/welcome" element={<WelcomeAnimation />} />
        <Route path="/offerings" element={<Offerings />} />
        <Route path="/account" element={<Account />} />
        <Route path="/lola" element={<Lola />} />
        <Route path="/pioneer" element={<PioneerVC />} />
        <Route path="/republic" element={<RepublicVC />} />
        <Route path="/select-type" element={<UserTypeSelection />} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lp-portfolio" element={<LPPortfolio />} />
        
        {/* Early Access routes */}
        <Route path="/access-type" element={<AccessTypePage />} />
        
        {/* Direct LP platform access routes */}
        <Route path="/direct-signup" element={<DirectSignUpLP />} />
        <Route path="/direct-signin" element={<DirectSignInPage />} />
        
        {/* GP platform access routes */}
        <Route path="/gp-signup" element={<DirectSignUpGP />} />
        <Route path="/gp-signin" element={<GPSignInPage />} />
        <Route path="/gp-mfa-verification" element={<GpMfaVerification />} />
        
        {/* GP Platform Routes */}
        <Route path="/gp-dashboard" element={<GPDashboard />} />
        <Route path="/gp-announcements" element={<NewAnnouncement />} />
        <Route path="/gp-copilot" element={<GPCopilot />} />
        <Route path="/gp-deal-flow" element={<DealFlow />} />
        <Route path="/gp-portfolio" element={<Portfolio />} />
        
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
