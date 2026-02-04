import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
  Container, Paper, Typography, Stepper, Step, StepLabel, 
  Button, TextField, Box, Grid, Alert, Card, Divider, FormHelperText,
  Autocomplete, Chip 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useStore } from '../../store/useStore';

// --- PRE-DEFINED SKILLS LIST ---
const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 
  'C#', 'SQL', 'AWS', 'Docker', 'Git', 'Figma', 'Product Management', 
  'Communication', 'Leadership', 'Marketing', 'Sales'
];

export default function ApplicationForm() {
  const { jobId } = useParams();
  const addApplication = useStore((state) => state.addApplication);
  
  const [activeStep, setActiveStep] = useState(0);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const steps = ['Personal Information', 'Experience & Skills', 'Review'];

  const { control, handleSubmit, trigger, watch, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      experienceYears: 0,
      skills: [] as string[], // CHANGE: Default is now an empty ARRAY
      portfolioUrl: '',
      resume: null as File | null,
    },
    mode: 'onChange'
  });

  const formValues = watch(); 

  const handleNext = async () => {
    let isValid = false;
    
    if (activeStep === 0) {
      isValid = await trigger(['fullName', 'email', 'phone']);
    } else if (activeStep === 1) {
      isValid = await trigger(['experienceYears', 'skills', 'resume']);
    } else {
      isValid = true;
    }

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onFinalSubmit = (data: any) => {
    const newId = crypto.randomUUID().split('-')[0].toUpperCase();
    const finalResumeName = data.resume ? data.resume.name : 'unknown-file.pdf';

    // Convert the Array of skills back to a comma-separated String for storage
    const skillsString = data.skills.join(', ');

    const newApplication = {
      id: newId,
      jobId: jobId || '1',
      candidate: {
        ...data,
        skills: skillsString, // Store as string
        resumeFileName: finalResumeName
      },
      status: 'applied' as const,
      reviews: [],
      submittedAt: new Date().toISOString(),
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
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for applying. Your application has been successfully submitted.
          </Typography>
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
        <Typography variant="h4" align="center" gutterBottom>
          Job Application
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form>
          {/* STEP 1: Personal Info */}
          <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: "Full Name is required" }}
                  render={({ field }) => (
                    <TextField {...field} label="Full Name" fullWidth error={!!errors.fullName} helperText={errors.fullName?.message?.toString()} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }}
                  render={({ field }) => (
                    <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message?.toString()} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone is required" }}
                  render={({ field }) => (
                    <TextField {...field} label="Phone" fullWidth error={!!errors.phone} helperText={errors.phone?.message?.toString()} />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* STEP 2: Experience & Resume Upload */}
          <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="experienceYears"
                  control={control}
                  rules={{ min: { value: 0, message: "Cannot be negative" } }}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Years of Experience" fullWidth error={!!errors.experienceYears} helperText={errors.experienceYears?.message?.toString()} />
                  )}
                />
              </Grid>
              
              {/* --- NEW SKILLS AUTOCOMPLETE --- */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="skills"
                  control={control}
                  rules={{ 
                    validate: (value) => value.length > 0 || "Please add at least one skill" 
                  }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      options={SUGGESTED_SKILLS}
                      value={value || []}
                      onChange={(_, newValue) => onChange(newValue)}
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => {
                           const { key, ...tagProps } = getTagProps({ index });
                           return (
                             <Chip variant="outlined" label={option} key={key} {...tagProps} />
                           );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Skills (Select or Type)"
                          placeholder="Type and press Enter..."
                          error={!!errors.skills}
                          helperText={errors.skills?.message?.toString() || "Select from list or type your own"}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              
              {/* --- RESUME UPLOAD SECTION --- */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="resume"
                  control={control}
                  rules={{ 
                    required: "Resume file is required",
                    validate: {
                      fileType: (value) => {
                        if (!value) return true;
                        const validExtensions = ['pdf', 'doc', 'docx'];
                        const extension = value.name.split('.').pop()?.toLowerCase();
                        return validExtensions.includes(extension || '') || "Only PDF, DOC, and DOCX files allowed";
                      },
                      fileSize: (value) => {
                        if (!value) return true;
                        return value.size < 5000000 || "File size must be under 5MB";
                      }
                    }
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Box 
                      sx={{ 
                        border: '2px dashed', 
                        borderColor: errors.resume ? 'error.main' : 'grey.300',
                        borderRadius: 2, 
                        p: 3, 
                        textAlign: 'center',
                        bgcolor: 'grey.50'
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                      />
                      <label htmlFor="resume-upload">
                        <Button 
                          variant="outlined" 
                          component="span" 
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload Resume
                        </Button>
                      </label>
                      
                      {value && (
                        <Box mt={2} display="flex" alignItems="center" justifyContent="center" gap={1}>
                          <InsertDriveFileIcon color="primary" />
                          <Typography variant="body1" fontWeight="bold">
                            {value.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({(value.size / 1024 / 1024).toFixed(2)} MB)
                          </Typography>
                        </Box>
                      )}

                      {!value && (
                         <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                           Supported formats: PDF, DOC, DOCX (Max 5MB)
                         </Typography>
                      )}

                      {errors.resume && (
                        <FormHelperText error sx={{ textAlign: 'center', mt: 1 }}>
                          {errors.resume.message?.toString()}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="portfolioUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Portfolio URL (Optional)" fullWidth />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* STEP 3: Review */}
          {activeStep === 2 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please review your application details below.
              </Alert>
              
              <Paper variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom color="primary">Personal Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1">{formValues.fullName}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{formValues.email}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{formValues.phone}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom color="primary">Experience & Skills</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                    <Typography variant="body1">{formValues.experienceYears} years</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Portfolio</Typography>
                    <Typography variant="body1">{formValues.portfolioUrl || 'N/A'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                    {/* DISPLAY SKILLS AS CHIPS IN REVIEW */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      {formValues.skills && formValues.skills.length > 0 ? (
                        formValues.skills.map((skill: string) => (
                          <Chip key={skill} label={skill} size="small" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No skills selected</Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  {/* REVIEW RESUME SECTION */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">Resume</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <InsertDriveFileIcon color="action" fontSize="small" />
                      <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                         {formValues.resume ? formValues.resume.name : 'No file uploaded'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}

          {/* CONTROL BUTTONS */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined" type="button">Back</Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext} type="button">
                Next
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleSubmit(onFinalSubmit)}
                type="button"
              >
                Submit Application
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}