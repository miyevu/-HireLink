import { Container, Grid, Typography, Box } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import JobCard from '../../components/JobCard';
import { JOBS } from '../../data/mockJobs';

export default function JobBoard() {
  return (
    <Box>
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

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, pl: 1, borderLeft: '4px solid #4F46E5' }}>
          Latest Openings
        </Typography>

        <Grid container spacing={3}>
          {JOBS.map((job) => (
            <Grid size={{ xs: 12, md: 4 }} key={job.id}>
              <JobCard {...job} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}