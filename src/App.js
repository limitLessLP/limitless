import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LearnMoreVC from './components/LearnMoreVC';
import LearnMoreInvestor from './components/LearnMoreInvestor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/for-vcs" element={<LearnMoreVC />} />
        <Route path="/for-investors" element={<LearnMoreInvestor />} />
      </Routes>
    </Router>
  );
}

export default App;
