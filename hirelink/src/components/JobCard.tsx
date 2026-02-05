import { Card, CardContent, Typography, Button, Box, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Define the shape of the data this component expects
interface JobCardProps {
  id: string;
  title: string;
  company: string;
  date: number;
  location: string;
  salary: string;
  type: string;
}

export default function JobCard({ id, title, company, date, location, salary, type }: JobCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: 6 
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Chip label={type} size="small" color="secondary" sx={{ fontWeight: 600, borderRadius: 1 }} />
          <Typography variant="caption" color="text.secondary">Posted {date}d ago</Typography>
        </Box>
        
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <BusinessIcon fontSize="small" />
            <Typography variant="body2">{company}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">{location}</Typography>
          </Box>
        </Stack>
        
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          {salary}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          component={Link} 
          to={`/apply/${id}`} 
          variant="contained" 
          fullWidth 
          size="large"
        >
          Apply Now
        </Button>
      </Box>
    </Card>
  );
}