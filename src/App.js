import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LearnMoreVC from './components/LearnMoreVC';
import LearnMoreInvestor from './components/LearnMoreInvestor';
import GetStartedPage from './components/GetStarted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/for-vcs" element={<LearnMoreVC />} />
        <Route path="/for-investors" element={<LearnMoreInvestor />} />
        <Route path="/get-started" element={<GetStartedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
