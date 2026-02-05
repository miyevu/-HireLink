export type ApplicationStatus = 'applied' | 'reviewed' | 'interview_scheduled' | 'offer_sent' | 'rejected';

export interface JobApplication {
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