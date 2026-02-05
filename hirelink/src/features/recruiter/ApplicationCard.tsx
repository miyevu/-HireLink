import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { getJobTitle } from '../../data/mockJobs'; 
import type { JobApplication } from './recruiterTypes';

interface ApplicationCardProps {
  app: JobApplication;
  onClick: () => void;
}

export default function ApplicationCard({ app, onClick }: ApplicationCardProps) {
  const jobTitle = getJobTitle(app.jobId); 

  return (
    <Card 
      elevation={0}
      sx={{ 
        cursor: 'pointer', 
        border: '1px solid #e2e8f0', 
        borderRadius: 2, 
        transition: 'all 0.2s',
        '&:hover': { 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
          borderColor: 'primary.main', 
          transform: 'translateY(-2px)' 
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={0.5} mb={1} sx={{ color: 'primary.main' }}>
          <WorkOutlineIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {jobTitle}
          </Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {app.candidate.fullName}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {app.candidate.experienceYears} Years Exp.
        </Typography>

        <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {new Date(app.submittedAt).toLocaleDateString()}
          </Typography>
          
          {app.reviews.length > 0 && (
            <Chip 
              label={`★ ${app.reviews[app.reviews.length - 1].score}`} 
              size="small" 
              sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 'bold', height: 20, fontSize: '0.7rem' }} 
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}