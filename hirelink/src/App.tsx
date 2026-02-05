import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

// Import Layout Component
import Header from './components/Header';

// Import Feature Components
import JobBoard from './features/candidate/JobBoard';
import ApplicationForm from './features/candidate/ApplicationForm';
import RecruiterDashboard from './features/recruiter/Dashboard'; 

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Routes>
          <Route path="/" element={<JobBoard />} />
          <Route path="/apply/:jobId" element={<ApplicationForm />} />
          <Route path="/admin" element={<RecruiterDashboard />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;