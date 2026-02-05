import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

export default function Header() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* LOGO ICON */}
          <WorkIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          
          {/* LOGO TEXT */}
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

          {/* NAVIGATION BUTTONS */}
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
  );
}