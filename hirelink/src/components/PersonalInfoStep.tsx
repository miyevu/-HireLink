import { Grid, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

// ✅ NOTICE THE 'export default' HERE
export default function PersonalInfoStep() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="fullName"
          control={control}
          rules={{ 
            required: "Full Name is required",
            maxLength: { value: 50, message: "Name cannot exceed 50 characters" }
          }}
          render={({ field }) => (
            <TextField {...field} label="Full Name" fullWidth error={!!errors.fullName} helperText={errors.fullName?.message?.toString()} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="email"
          control={control}
          rules={{ 
            required: "Email is required", 
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
          }}
          render={({ field }) => (
            <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message?.toString()} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="phone"
          control={control}
          rules={{ 
            required: "Phone is required",
            maxLength: { value: 20, message: "Phone number too long" },
            pattern: { value: /^[0-9+\- ()]*$/, message: "Invalid phone number" }
          }}
          render={({ field }) => (
            <TextField {...field} label="Phone" fullWidth error={!!errors.phone} helperText={errors.phone?.message?.toString()} />
          )}
        />
      </Grid>
    </Grid>
  );
}