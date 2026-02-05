import { useState, useRef } from 'react';
import { 
  Grid, Typography, Box, Chip, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Button, TextField, Rating, Divider,
  InputAdornment, IconButton
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useStore } from '../../store/useStore';
import { getJobTitle } from '../../data/mockJobs'; 
import type { JobApplication } from './recruiterTypes'; 

interface InternalReviewModalProps {
  app: JobApplication; 
  onClose: () => void;
}

export default function InternalReviewModal({ app, onClose }: InternalReviewModalProps) {
  const { addReview, updateStatus, scheduleInterview } = useStore();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [score, setScore] = useState<number | null>(app.reviews[0]?.score || 0);
  const [notes, setNotes] = useState(app.reviews[0]?.notes || '');
  const [interviewDate, setInterviewDate] = useState('');
  const [showOfferDraft, setShowOfferDraft] = useState(false);
  const [offerSalary, setOfferSalary] = useState('');
  const [offerStartDate, setOfferStartDate] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);

  const jobTitle = getJobTitle(app.jobId);

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
    setRejectOpen(false);
    onClose();
  };

  const mockOfferLetter = `Dear ${app.candidate.fullName},

We are pleased to offer you the position of ${jobTitle} at HireLink! 

Based on your impressive experience of ${app.candidate.experienceYears} years and your skills in ${app.candidate.skills}, we believe you will be a great asset to our team.

Start Date: ${offerStartDate || '[Select Date]'}
Salary: ${offerSalary || '[Enter Salary]'}

Sincerely,
The Hiring Team`;

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            {app.candidate.fullName}
            <Typography variant="caption" display="block" color="text.secondary">
              Applying for: <strong>{jobTitle}</strong>
            </Typography>
          </Box>
          <Chip label={app.status.replace('_', ' ')} size="small" color="primary" sx={{ textTransform: 'uppercase' }} />
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>Candidate Details</Typography>
              <Typography><strong>Email:</strong> {app.candidate.email}</Typography>
              <Typography><strong>Phone:</strong> {app.candidate.phone}</Typography>
              <Typography><strong>Exp:</strong> {app.candidate.experienceYears} Years</Typography>
              <Typography>
                <strong>Portfolio:</strong>{' '}
                {app.candidate.portfolioUrl ? <a href={app.candidate.portfolioUrl} target="_blank">{app.candidate.portfolioUrl}</a> : <span style={{ color: 'gray' }}>N/A</span>}
              </Typography>
              <Typography sx={{ mt: 1 }}><strong>Skills:</strong></Typography>
              <Typography variant="body2" color="text.secondary" paragraph>{app.candidate.skills}</Typography>
              <Box mt={2} p={2} bgcolor="grey.50" borderRadius={2} border="1px dashed #cbd5e1">
                <Typography variant="caption" color="text.secondary" fontWeight="bold" gutterBottom display="block">RESUME ATTACHMENT</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ bgcolor: '#ffebee', p: 1, borderRadius: 1 }}><Typography variant="h6">📄</Typography></Box>
                    <Box><Typography variant="body2" fontWeight="bold" noWrap sx={{ maxWidth: 150 }}>{app.candidate.resumeFileName}</Typography><Typography variant="caption" color="text.secondary">PDF Document</Typography></Box>
                  </Box>
                  <Button size="small" variant="outlined" onClick={() => { const w = window.open('', '_blank'); w?.document.write(`<html><body><h1>${app.candidate.fullName}</h1><p>Mock Resume</p></body></html>`); w?.document.close(); }}>View Tab</Button>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {app.status !== 'rejected' && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>1. Review Candidate</Typography>
                  <Box display="flex" alignItems="center" mb={1}><Typography component="legend" mr={1}>Score:</Typography><Rating value={score} onChange={(_, val) => setScore(val)} disabled={app.status === 'offer_sent'} /></Box>
                  <TextField fullWidth multiline rows={2} label="Internal Notes" variant="outlined" size="small" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={app.status === 'offer_sent'} />
                  {app.status === 'applied' && <Button onClick={handleReviewSubmit} variant="contained" size="small" sx={{ mt: 1 }}>Save & Move to Reviewed</Button>}
                </Box>
              )}
              <Divider sx={{ my: 2 }} />

              {app.status !== 'applied' && app.status !== 'rejected' && app.status !== 'offer_sent' && !showOfferDraft && (
                <Box>
                  <Typography variant="h6" gutterBottom>2. Schedule Interview</Typography>
                  <TextField 
                    label="Interview Date & Time" 
                    type="datetime-local" 
                    fullWidth 
                    size="medium" 
                    sx={{ 
                      mb: 1,
                      '& input::-webkit-calendar-picker-indicator': { display: 'none', WebkitAppearance: 'none' }
                    }} 
                    value={interviewDate} 
                    onChange={(e) => setInterviewDate(e.target.value)} 
                    inputRef={dateInputRef} 
                    InputLabelProps={{ shrink: true }} 
                    InputProps={{ 
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => dateInputRef.current?.showPicker()}>
                            <CalendarMonthIcon color="primary" />
                          </IconButton>
                        </InputAdornment>
                      ) 
                    }} 
                  />
                  <Button onClick={handleSchedule} disabled={!interviewDate} variant="outlined" fullWidth>Confirm Schedule</Button>
                </Box>
              )}

              {app.status === 'interview_scheduled' && !showOfferDraft && (
                <Box mt={2}><Typography variant="h6" gutterBottom>3. Final Decision</Typography><Button onClick={() => setShowOfferDraft(true)} variant="contained" color="success" fullWidth startIcon={<EmailIcon />}>Draft Offer</Button></Box>
              )}

              {showOfferDraft && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #c8e6c9', borderRadius: 2, bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom fontWeight="bold">Prepare Offer Details</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                        <TextField 
                            label="Salary Offer" 
                            size="small" 
                            fullWidth 
                            placeholder="$120,000" 
                            value={offerSalary} 
                            onChange={(e) => setOfferSalary(e.target.value)} 
                            InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment>, sx: { bgcolor: 'white' } }} 
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField 
                            type="date" 
                            label="Start Date" 
                            size="small" 
                            fullWidth 
                            value={offerStartDate} 
                            onChange={(e) => setOfferStartDate(e.target.value)} 
                            InputLabelProps={{ shrink: true }} 
                            sx={{
                                '& input::-webkit-calendar-picker-indicator': { display: 'none', WebkitAppearance: 'none' }
                            }}
                            InputProps={{ sx: { bgcolor: 'white' } }} 
                        />
                    </Grid>
                  </Grid>
                  <Typography variant="caption" color="text.secondary">PREVIEW:</Typography>
                  <TextField fullWidth multiline rows={6} value={mockOfferLetter} InputProps={{ readOnly: true }} variant="standard" sx={{ mb: 2, bgcolor: 'white', p: 1, border: '1px solid #ddd' }} />
                  <Button onClick={handleFinalSendOffer} variant="contained" color="success" fullWidth disabled={!offerSalary || !offerStartDate}>Send Offer Letter</Button>
                  <Button onClick={() => setShowOfferDraft(false)} size="small" sx={{ mt: 1, display: 'block', mx: 'auto' }}>Cancel Draft</Button>
                </Box>
              )}

              {app.status === 'rejected' && <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: 2, textAlign: 'center', color: '#dc2626' }}><Typography fontWeight="bold">⛔ This application has been rejected.</Typography></Box>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          {app.status !== 'rejected' && app.status !== 'offer_sent' && <Button onClick={() => setRejectOpen(true)} color="error" startIcon={<WarningAmberIcon />}>Reject Candidate</Button>}
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}><WarningAmberIcon /> Reject Candidate?</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to reject <strong>{app.candidate.fullName}</strong>? This action moves them to the "Rejected" column.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setRejectOpen(false)} color="inherit">Cancel</Button><Button onClick={handleConfirmReject} color="error" variant="contained" autoFocus>Confirm Reject</Button></DialogActions>
      </Dialog>
    </>
  );
}