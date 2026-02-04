import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, TextField, Rating, 
  Divider, Chip, Grid 
} from '@mui/material';
import { useStore, Application } from '../../store/useStore'; // Importing from store since we moved types there

interface ReviewModalProps {
  app: Application;
  onClose: () => void;
}

export default function ReviewModal({ app, onClose }: ReviewModalProps) {
  const { addReview, updateStatus, scheduleInterview } = useStore();
  
  // Local State for Form Inputs
  const [score, setScore] = useState<number | null>(0);
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  
  // Handle "Submit Review"
  const handleReviewSubmit = () => {
    if (score && notes) {
      addReview(app.id, {
        score,
        notes,
        date: new Date().toISOString(),
      });
      // Auto-move status if needed, but we'll keep it manual or simple
    }
  };

  // Handle "Schedule Interview"
  const handleSchedule = () => {
    if (interviewDate) {
      scheduleInterview(app.id, interviewDate);
      onClose(); // Close after scheduling
    }
  };

  // Handle "Send Offer"
  const handleSendOffer = () => {
    const confirm = window.confirm(`Send offer letter to ${app.candidate.fullName}?`);
    if (confirm) {
      updateStatus(app.id, 'offer_sent');
      onClose();
    }
  };

  const handleReject = () => {
    if(window.confirm('Reject this candidate?')) {
      updateStatus(app.id, 'rejected');
      onClose();
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{app.candidate.fullName}</Typography>
          <Chip label={app.status.replace('_', ' ').toUpperCase()} color="primary" />
        </Box>
        <Typography variant="subtitle2" color="text.secondary">{app.candidate.email} | {app.candidate.phone}</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* LEFT: Candidate Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Application Details</Typography>
            <Typography><strong>Experience:</strong> {app.candidate.experienceYears} Years</Typography>
            <Typography><strong>Skills:</strong> {app.candidate.skills}</Typography>
            <Typography><strong>Portfolio:</strong> {app.candidate.portfolioUrl || 'N/A'}</Typography>
            <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">MOCK RESUME PREVIEW</Typography>
              <Typography variant="body2">📄 {app.candidate.resumeFileName}</Typography>
            </Box>
          </Grid>

          {/* RIGHT: Recruiter Actions */}
          <Grid item xs={12} md={6}>
            
            {/* 1. REVIEW SECTION */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>Recruiter Review</Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography component="legend" mr={1}>Score:</Typography>
                <Rating value={score} onChange={(_, val) => setScore(val)} />
              </Box>
              <TextField 
                fullWidth 
                multiline 
                rows={2} 
                label="Internal Notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                variant="outlined" 
                size="small"
              />
              <Button onClick={handleReviewSubmit} variant="contained" size="small" sx={{ mt: 1 }}>
                Save Review
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 2. INTERVIEW SCHEDULER */}
            {app.status !== 'rejected' && app.status !== 'offer_sent' && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>Schedule Interview</Typography>
                <TextField 
                  type="datetime-local" 
                  fullWidth 
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  size="small"
                />
                <Button 
                  onClick={handleSchedule} 
                  disabled={!interviewDate}
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 1 }}
                >
                  Confirm Interview Time
                </Button>
              </Box>
            )}

            {/* 3. OFFER SECTION */}
            {app.status === 'interview_scheduled' && (
              <Box>
                <Typography variant="h6" gutterBottom color="success.main">Final Decision</Typography>
                <Button 
                  onClick={handleSendOffer} 
                  variant="contained" 
                  color="success" 
                  fullWidth
                >
                  Draft & Send Offer
                </Button>
              </Box>
            )}

          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleReject} color="error">Reject Candidate</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}