import { Grid, Typography, Paper, Divider, Box, Chip, Alert } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useFormContext } from 'react-hook-form';

export default function ReviewStep() {
  const { watch } = useFormContext();
  const formValues = watch();

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>Please review your application details below.</Alert>
      <Paper variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom color="primary">Personal Information</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="text.secondary">Full Name</Typography><Typography variant="body1">{formValues.fullName}</Typography></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="text.secondary">Email</Typography><Typography variant="body1">{formValues.email}</Typography></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="text.secondary">Phone</Typography><Typography variant="body1">{formValues.phone}</Typography></Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom color="primary">Experience & Skills</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="text.secondary">Experience</Typography><Typography variant="body1">{formValues.experienceYears} years</Typography></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="text.secondary">Portfolio</Typography><Typography variant="body1">{formValues.portfolioUrl || 'N/A'}</Typography></Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              {formValues.skills?.map((skill: string) => <Chip key={skill} label={skill} size="small" />)}
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">Resume</Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <InsertDriveFileIcon color="action" fontSize="small" />
              <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>{formValues.resume ? formValues.resume.name : 'No file uploaded'}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}