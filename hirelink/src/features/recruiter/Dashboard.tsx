import { useState, useRef } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Rating, Divider,
  InputAdornment, IconButton
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Icon for reject
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

  const [score, setScore] = useState<number | null>(app.reviews[0]?.score || 0);
  const [notes, setNotes] = useState(app.reviews[0]?.notes || '');
  const [interviewDate, setInterviewDate] = useState('');
  const [showOfferDraft, setShowOfferDraft] = useState(false);
  
  // NEW: State for the custom Reject Dialog
  const [rejectOpen, setRejectOpen] = useState(false);

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

  const handleConfirmReject = () => {
    updateStatus(app.id, 'rejected');
    setRejectOpen(false); // Close the small popup
    onClose(); // Close the main modal
  };

  const mockOfferLetter = `Dear ${app.candidate.fullName},

We are pleased to offer you the position at HireLink! 
Based on your impressive experience of ${app.candidate.experienceYears} years and your skills in ${app.candidate.skills}, we believe you will be a great asset to our team.

Start Date: [Date]
Salary: [Salary Amount]

Sincerely,
The Hiring Team`;

  return (
    <>
      {/* MAIN MODAL */}
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
            {/* LEFT COLUMN: Candidate Details */}
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

              {/* View Resume Logic */}
              <Box mt={2} p={2} bgcolor="grey.50" borderRadius={2} border="1px dashed #cbd5e1">
                <Typography variant="caption" color="text.secondary" fontWeight="bold" gutterBottom display="block">
                  RESUME ATTACHMENT
                </Typography>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ bgcolor: '#ffebee', p: 1, borderRadius: 1 }}>
                      <Typography variant="h6">📄</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" noWrap sx={{ maxWidth: 150 }}>
                        {app.candidate.resumeFileName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PDF Document
                      </Typography>
                    </Box>
                  </Box>

                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => {
                      const newWindow = window.open('', '_blank');
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head>
                              <title>Resume - ${app.candidate.fullName}</title>
                              <style>
                                body { font-family: 'Helvetica', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
                                header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                                h1 { margin: 0; text-transform: uppercase; letter-spacing: 2px; }
                                .contact { color: #666; margin-top: 5px; }
                                .section { margin-bottom: 30px; }
                                .section-title { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; color: #4F46E5; }
                                .disclaimer { margin-top: 50px; font-size: 12px; color: #999; border-top: 1px dashed #ccc; padding-top: 10px; text-align: center; }
                              </style>
                            </head>
                            <body>
                              <header>
                                <h1>${app.candidate.fullName}</h1>
                                <div class="contact">${app.candidate.email} | ${app.candidate.phone}</div>
                              </header>
                              <div class="section">
                                <div class="section-title">Professional Summary</div>
                                <p>Experienced professional with ${app.candidate.experienceYears} years of experience in ${app.candidate.skills}.</p>
                              </div>
                              <div class="disclaimer">[Generated by HireLink System] Mock Resume View</div>
                            </body>
                          </html>
                        `);
                        newWindow.document.close();
                      }
                    }}
                  >
                    View Tab
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* RIGHT COLUMN: Progressive Actions */}
            <Grid size={{ xs: 12, md: 6 }}>
              
              {/* 1. Review Section (Always visible unless rejected) */}
              {app.status !== 'rejected' && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>1. Review Candidate</Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography component="legend" mr={1}>Score:</Typography>
                    <Rating value={score} onChange={(_, val) => setScore(val)} disabled={app.status === 'offer_sent'} />
                  </Box>
                  <TextField 
                    fullWidth multiline rows={2} label="Internal Notes" variant="outlined" size="small"
                    value={notes} onChange={(e) => setNotes(e.target.value)} disabled={app.status === 'offer_sent'}
                  />
                  {app.status === 'applied' && (
                    <Button onClick={handleReviewSubmit} variant="contained" size="small" sx={{ mt: 1 }}>
                      Save & Move to Reviewed
                    </Button>
                  )}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* 2. Schedule Section (Hidden until Reviewed) */}
              {app.status !== 'applied' && app.status !== 'rejected' && app.status !== 'offer_sent' && !showOfferDraft && (
                <Box>
                  <Typography variant="h6" gutterBottom>2. Schedule Interview</Typography>
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
                    Confirm Schedule
                  </Button>
                </Box>
              )}

              {/* 3. Offer Stage (Hidden until Interviewed) */}
              {app.status === 'interview_scheduled' && !showOfferDraft && (
                <Box mt={2}>
                   <Typography variant="h6" gutterBottom>3. Final Decision</Typography>
                   <Button 
                    onClick={() => setShowOfferDraft(true)} 
                    variant="contained" 
                    color="success" 
                    fullWidth 
                    startIcon={<EmailIcon />}
                  >
                    Draft Offer
                  </Button>
                </Box>
              )}

              {/* Mock Offer Letter Preview */}
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

              {/* Status Message if Rejected */}
              {app.status === 'rejected' && (
                <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: 2, textAlign: 'center', color: '#dc2626' }}>
                  <Typography fontWeight="bold">⛔ This application has been rejected.</Typography>
                </Box>
              )}

            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          {/* REJECT BUTTON - Opens the NEW Dialog */}
          {app.status !== 'rejected' && app.status !== 'offer_sent' && (
            <Button onClick={() => setRejectOpen(true)} color="error" startIcon={<WarningAmberIcon />}>
              Reject Candidate
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* --- NEW: REJECT CONFIRMATION POPUP --- */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon /> Reject Candidate?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reject <strong>{app.candidate.fullName}</strong>? 
            This action moves them to the "Rejected" column.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmReject} color="error" variant="contained" autoFocus>
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
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