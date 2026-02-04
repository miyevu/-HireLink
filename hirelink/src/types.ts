// src/types.ts

export type ApplicationStatus = 'applied' | 'reviewed' | 'interview_scheduled' | 'offer_sent' | 'rejected';

export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
}

export interface Candidate {
  fullName: string;
  email: string;
  phone: string;
  experienceYears: number;
  skills: string; 
  portfolioUrl?: string;
  resumeFileName: string; 
}

export interface Review {
  score: number;
  notes: string;
  date: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidate: Candidate;
  status: ApplicationStatus;
  reviews: Review[];
  submittedAt: string;
  interviewDate?: string; 
}