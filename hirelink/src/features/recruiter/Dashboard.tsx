import { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Chip } from '@mui/material';
import { useStore } from '../../store/useStore';
import type { JobApplication, ApplicationStatus } from './recruiterTypes';
import InternalReviewModal from './InternalReviewModal';
import ApplicationCard from './ApplicationCard';

const COLUMNS: { id: ApplicationStatus; label: string }[] = [
  { id: 'applied', label: 'New Applications' },
  { id: 'reviewed', label: 'Reviewed' },
  { id: 'interview_scheduled', label: 'Interview Scheduled' },
  { id: 'offer_sent', label: 'Offer Sent' },
  { id: 'rejected', label: 'Rejected' }
];

export default function RecruiterDashboard() {
  const applications = useStore((state) => state.applications);
  
  // ✅ USE THE NEW NAME
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const getAppsByStatus = (status: string) => {
    if (!applications) return [];
    // ✅ CAST AS JobApplication[]
    return applications.filter((app: any) => app.status === status) as JobApplication[];
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Recruiter Pipeline
      </Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 150px)', overflowX: 'auto' }}>
        {COLUMNS.map((col) => (
          <Grid size={{ xs: 12, md: 2.4 }} key={col.id} sx={{ minWidth: 250 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                height: '100%', 
                bgcolor: '#eef2f6', 
                border: '1px solid #e2e8f0', 
                borderRadius: 3, 
                overflowY: 'auto' 
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight="800" sx={{ textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 1 }}>
                  {col.label}
                </Typography>
                <Chip label={getAppsByStatus(col.id).length} size="small" sx={{ bgcolor: 'white', fontWeight: 'bold' }} />
              </Box>
              
              <Box display="flex" flexDirection="column" gap={2}>
                {getAppsByStatus(col.id).map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    app={app} 
                    onClick={() => setSelectedApp(app)} 
                  />
                ))}
                  
                {getAppsByStatus(col.id).length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center', opacity: 0.5, border: '2px dashed #cbd5e1', borderRadius: 2 }}>
                    <Typography variant="caption" fontWeight="bold">Empty</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selectedApp && (
        <InternalReviewModal 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
        />
      )}
    </Container>
  );
}