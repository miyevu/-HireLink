import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Container, Paper, Typography, Stepper, Step, StepLabel, Button, Box, Card } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useStore } from '../../store/useStore';
import PersonalInfoStep from '../../components/PersonalInfoStep';
import ExperienceStep from '../../components/ExperienceStep';
import ReviewStep from '../../components/ReviewStep';

export default function ApplicationForm() {
  const { jobId } = useParams();
  const addApplication = useStore((state) => state.addApplication);
  const [activeStep, setActiveStep] = useState(0);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const steps = ['Personal Information', 'Experience & Skills', 'Review'];

  const methods = useForm({
    defaultValues: {
      fullName: '', email: '', phone: '',
      experienceYears: 0, skills: [] as string[], portfolioUrl: '',
      resume: null as File | null,
    },
    mode: 'onChange'
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    let isValid = false;
    if (activeStep === 0) isValid = await trigger(['fullName', 'email', 'phone']);
    else if (activeStep === 1) isValid = await trigger(['experienceYears', 'skills', 'resume', 'portfolioUrl']);
    else isValid = true;

    if (isValid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onFinalSubmit = (data: any) => {
    const newId = crypto.randomUUID().split('-')[0].toUpperCase();
    const skillsString = data.skills.join(', ');
    const newApplication = {
      id: newId,
      jobId: jobId || '1',
      candidate: { ...data, skills: skillsString, resumeFileName: data.resume?.name || 'unknown.pdf' },
      status: 'applied' as const, reviews: [], submittedAt: new Date().toISOString(),
    };
    addApplication(newApplication);
    setSubmittedId(newId);
  };

  if (submittedId) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ textAlign: 'center', p: 4, boxShadow: 3 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" gutterBottom>Application Received!</Typography>
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, mb: 4, display: 'inline-block' }}>
            <Typography variant="caption" display="block" color="text.secondary">APPLICATION ID</Typography>
            <Typography variant="h6" fontWeight="bold">#{submittedId}</Typography>
          </Box>
          <Button component={Link} to="/" variant="contained" fullWidth>Return to Job Board</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>Job Application</Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        <FormProvider {...methods}>
          <form>
            <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
              <PersonalInfoStep />
            </Box>
            <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
              <ExperienceStep />
            </Box>
            <Box sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
              <ReviewStep />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              {activeStep > 0 && <Button onClick={handleBack} variant="outlined">Back</Button>}
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext}>Next</Button>
              ) : (
                <Button variant="contained" color="success" onClick={handleSubmit(onFinalSubmit)}>Submit Application</Button>
              )}
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
}