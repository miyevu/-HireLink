import { Container, Grid, Card, CardContent, Typography, Button, Box, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const JOBS = [
  { id: '1', title: 'Frontend Engineer', company: 'TechCorp', location: 'Remote', salary: '$120k - $150k', type: 'Full-time' },
  { id: '2', title: 'Backend Developer', company: 'DataSystems', location: 'New York, NY', salary: '$130k - $160k', type: 'Full-time' },
  { id: '3', title: 'Product Manager', company: 'Innovate Inc', location: 'San Francisco, CA', salary: '$140k - $180k', type: 'Contract' },
];

export default function JobBoard() {
  return (
    <Box>
      {/* HERO SECTION */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, mb: 4, borderRadius: { xs: 0, md: '0 0 32px 32px' } }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <RocketLaunchIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
          <Typography variant="h3" fontWeight="800" gutterBottom>
            Find Your Dream Job
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Browse hundreds of jobs from the hottest tech companies. 
            Apply in seconds and track your status.
          </Typography>
        </Container>
      </Box>

      {/* JOB LISTINGS */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, pl: 1, borderLeft: '4px solid #4F46E5' }}>
          Latest Openings
        </Typography>

        <Grid container spacing={3}>
          {JOBS.map((job) => (
            // FIX: Use 'size' prop instead of 'item xs md'
            <Grid size={{ xs: 12, md: 4 }} key={job.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 6 
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Chip label={job.type} size="small" color="secondary" sx={{ fontWeight: 600, borderRadius: 1 }} />
                    <Typography variant="caption" color="text.secondary">Posted 2d ago</Typography>
                  </Box>
                  
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {job.title}
                  </Typography>
                  
                  <Stack spacing={1} sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                      <BusinessIcon fontSize="small" />
                      <Typography variant="body2">{job.company}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2">{job.location}</Typography>
                    </Box>
                  </Stack>
                  
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {job.salary}
                  </Typography>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    component={Link} 
                    to={`/apply/${job.id}`} 
                    variant="contained" 
                    fullWidth 
                    size="large"
                  >
                    Apply Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}