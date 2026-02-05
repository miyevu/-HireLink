import { Grid, TextField, Box, Button, FormHelperText, Autocomplete, Chip, Typography } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 
  'C#', 'SQL', 'AWS', 'Docker', 'Git', 'Figma', 'Product Management', 
  'Communication', 'Leadership', 'Marketing', 'Sales'
];

export default function ExperienceStep() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="experienceYears"
          control={control}
          rules={{ 
            min: { value: 0, message: "Cannot be negative" },
            max: { value: 50, message: "Please enter a valid number (max 50)" }
          }}
          render={({ field }) => (
            <TextField {...field} type="number" label="Years of Experience" fullWidth error={!!errors.experienceYears} helperText={errors.experienceYears?.message?.toString()} />
          )}
        />
      </Grid>
      
      <Grid size={{ xs: 12 }}>
        <Controller
          name="skills"
          control={control}
          rules={{ validate: (value) => value.length > 0 || "Please select at least one skill" }}
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
                   return <Chip variant="outlined" label={option} key={key} {...tagProps} />;
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Select or Type..."
                  error={!!errors.skills}
                  helperText={errors.skills?.message?.toString()}
                />
              )}
            />
          )}
        />
      </Grid>
      
      <Grid size={{ xs: 12 }}>
        <Controller
          name="resume"
          control={control}
          rules={{ 
            required: "Resume file is required",
            validate: {
              fileType: (value) => {
                if (!value) return true;
                const ext = value.name.split('.').pop()?.toLowerCase();
                return ['pdf', 'doc', 'docx'].includes(ext || '') || "Only PDF, DOC, DOCX allowed";
              },
              fileSize: (value) => (!value || value.size < 5000000) || "Max size 5MB"
            }
          }}
          render={({ field: { value, onChange } }) => (
            <Box sx={{ border: '2px dashed', borderColor: errors.resume ? 'error.main' : 'grey.300', borderRadius: 2, p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
              <input type="file" hidden id="resume-upload" accept=".pdf,.doc,.docx" onChange={(e) => { const f = e.target.files?.[0]; if(f) onChange(f); }} />
              <label htmlFor="resume-upload">
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>Upload Resume</Button>
              </label>
              {value && (
                <Box mt={2} display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <InsertDriveFileIcon color="primary" />
                  <Typography variant="body1" fontWeight="bold">{value.name}</Typography>
                </Box>
              )}
              {errors.resume && <FormHelperText error sx={{ textAlign: 'center', mt: 1 }}>{errors.resume.message?.toString()}</FormHelperText>}
            </Box>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          name="portfolioUrl"
          control={control}
          rules={{ pattern: { value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, message: "Invalid URL" } }}
          render={({ field }) => (
            <TextField {...field} label="Portfolio URL (Optional)" fullWidth error={!!errors.portfolioUrl} helperText={errors.portfolioUrl?.message?.toString()} />
          )}
        />
      </Grid>
    </Grid>
  );
}