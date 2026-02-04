import { useState, useRef } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating, Divider,
  InputAdornment, IconButton
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import { useStore } from '../../store/useStore';

// --- TYPES ---
type ApplicationStatus = 'applied' | 'reviewed' | 'interview_scheduled' | 'offer_sent' | 'rejected';

interface Application {
  id: string;
  jobId: string;
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    experienceYears: number;
    skills: string; 
    portfolioUrl?: string;
    resumeFileName: string;
  };
  status: ApplicationStatus;
  reviews: {
    score: number;
    notes: string;
    date: string;
  }[];
  submittedAt: string;
  interviewDate?: string; 
}

// --- INTERNAL COMPONENT: REVIEW MODAL ---
function InternalReviewModal({ app, onClose }: { app: Application; onClose: () => void }) {
  const { addReview, updateStatus, scheduleInterview } = useStore();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [score, setScore] = useState<number | null>(0);
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [showOfferDraft, setShowOfferDraft] = useState(false);

  const handleReviewSubmit = () => {
    if (score && notes) {
      addReview(app.id, { score, notes, date: new Date().toISOString() });
      updateStatus(app.id, 'reviewed'); 
    }
  };

  const handleSchedule = () => {
    if (interviewDate) {
      scheduleInterview(app.id, interviewDate);
      updateStatus(app.id, 'interview_scheduled'); 
      onClose();
    }
  };

  const handleFinalSendOffer = () => {
    updateStatus(app.id, 'offer_sent');
    onClose();
  };

  const handleReject = () => {
    if (window.confirm('Are you sure you want to reject this candidate?')) {
      updateStatus(app.id, 'rejected');
      onClose();
    }
  };

  const mockOfferLetter = `Dear ${app.candidate.fullName},

We are pleased to offer you the position at HireLink! 
Based on your impressive experience of ${app.candidate.experienceYears} years and your skills in ${app.candidate.skills}, we believe you will be a great asset to our team.

Start Date: [Date]
Salary: [Salary Amount]

Sincerely,
The Hiring Team`;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {app.candidate.fullName}
        <Chip 
          label={app.status.replace('_', ' ')} 
          size="small" 
          color="primary" 
          sx={{ ml: 2, textTransform: 'uppercase' }} 
        />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* FIX: Use 'size' instead of 'item xs md' */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>Candidate Details</Typography>
            <Typography><strong>Email:</strong> {app.candidate.email}</Typography>
            <Typography><strong>Phone:</strong> {app.candidate.phone}</Typography>
            <Typography><strong>Exp:</strong> {app.candidate.experienceYears} Years</Typography>
            
            <Typography>
              <strong>Portfolio:</strong>{' '}
              {app.candidate.portfolioUrl ? (
                <a href={app.candidate.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  {app.candidate.portfolioUrl}
                </a>
              ) : (
                <span style={{ color: 'gray', fontStyle: 'italic' }}>N/A</span>
              )}
            </Typography>

            <Typography sx={{ mt: 1 }}><strong>Skills:</strong></Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {app.candidate.skills}
            </Typography>

            <Box mt={2} p={1} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">RESUME</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                📄 {app.candidate.resumeFileName}
              </Typography>
            </Box>
          </Grid>

          {/* FIX: Use 'size' instead of 'item xs md' */}
          <Grid size={{ xs: 12, md: 6 }}>
            
            {/* Review Section */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Review</Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography component="legend" mr={1}>Score:</Typography>
                <Rating value={score} onChange={(_, val) => setScore(val)} />
              </Box>
              <TextField 
                fullWidth multiline rows={2} label="Internal Notes" variant="outlined" size="small"
                value={notes} onChange={(e) => setNotes(e.target.value)} 
              />
              <Button onClick={handleReviewSubmit} variant="contained" size="small" sx={{ mt: 1 }}>
                Save Review
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Schedule Section */}
            {app.status !== 'offer_sent' && !showOfferDraft && (
              <Box>
                <Typography variant="h6" gutterBottom>Next Steps</Typography>
                <TextField 
                  label="Interview Date & Time"
                  type="datetime-local" fullWidth size="medium" sx={{ mb: 1 }}
                  value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)}
                  inputRef={dateInputRef} InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => dateInputRef.current?.showPicker()}>
                          <CalendarMonthIcon color="primary" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button onClick={handleSchedule} disabled={!interviewDate} variant="outlined" fullWidth>
                  Schedule Interview
                </Button>
              </Box>
            )}

            {/* Offer Button */}
            {app.status === 'interview_scheduled' && !showOfferDraft && (
              <Button 
                onClick={() => setShowOfferDraft(true)} 
                variant="contained" 
                color="success" 
                fullWidth 
                sx={{ mt: 2 }}
                startIcon={<EmailIcon />}
              >
                Draft Offer
              </Button>
            )}

            {/* Mock Offer Letter */}
            {showOfferDraft && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid #c8e6c9', borderRadius: 2, bgcolor: '#e8f5e9' }}>
                <Typography variant="subtitle2" color="success.main" gutterBottom fontWeight="bold">
                  Mock Offer Letter Preview
                </Typography>
                <TextField
                  fullWidth multiline rows={6} value={mockOfferLetter}
                  InputProps={{ readOnly: true }} variant="standard"
                  sx={{ mb: 2, bgcolor: 'white', p: 1 }}
                />
                <Button onClick={handleFinalSendOffer} variant="contained" color="success" fullWidth>
                  Send Offer Letter
                </Button>
                <Button onClick={() => setShowOfferDraft(false)} size="small" sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                  Cancel Draft
                </Button>
              </Box>
            )}

          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        {app.status !== 'rejected' && (
          <Button onClick={handleReject} color="error">Reject Candidate</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// --- MAIN DASHBOARD COMPONENT ---
const COLUMNS: { id: ApplicationStatus; label: string }[] = [
  { id: 'applied', label: 'New Applications' },
  { id: 'reviewed', label: 'Reviewed' },
  { id: 'interview_scheduled', label: 'Interview Scheduled' },
  { id: 'offer_sent', label: 'Offer Sent' },
  { id: 'rejected', label: 'Rejected' }
];

export default function RecruiterDashboard() {
  const applications = useStore((state) => state.applications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const getAppsByStatus = (status: string) => {
    if (!applications) return [];
    return applications.filter((app: any) => app.status === status) as Application[];
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Recruiter Pipeline
      </Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 150px)', overflowX: 'auto' }}>
        {COLUMNS.map((col) => (
          // FIX: Use 'size' instead of 'item xs md'
          <Grid size={{ xs: 12, md: 2.4 }} key={col.id} sx={{ minWidth: 250 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, height: '100%', bgcolor: '#eef2f6', border: '1px solid #e2e8f0', borderRadius: 3, overflowY: 'auto' 
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
                    <Card 
                      key={app.id} elevation={0}
                      sx={{ 
                        cursor: 'pointer', border: '1px solid #e2e8f0', borderRadius: 2, transition: 'all 0.2s',
                        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderColor: 'primary.main', transform: 'translateY(-2px)' }
                      }}
                      onClick={() => setSelectedApp(app)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          {app.candidate.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          💼 {app.candidate.experienceYears} Years Exp.
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {app.reviews.length > 0 && (
                            <Chip 
                              label={`★ ${app.reviews[app.reviews.length - 1].score}`} 
                              size="small" 
                              sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 'bold', height: 24 }} 
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
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