import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

// Import all three components
import JobBoard from './features/candidate/JobBoard';
import ApplicationForm from './features/candidate/ApplicationForm';
import RecruiterDashboard from './features/recruiter/Dashboard'; 

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <WorkIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: 1
              }}
            >
              HIRELINK
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button component={Link} to="/" color="inherit">
                Candidate View
              </Button>
              <Button component={Link} to="/admin" variant="outlined" color="primary">
                Recruiter View
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<JobBoard />} />
          <Route path="/apply/:jobId" element={<ApplicationForm />} />
          
          {/* THIS WAS MISSING OR BROKEN: */}
          <Route path="/admin" element={<RecruiterDashboard />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;