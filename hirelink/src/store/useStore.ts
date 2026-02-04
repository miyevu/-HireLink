import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- DEFINITIONS (Moved here to fix the error) ---

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
  id: string; // Unique ID
  jobId: string;
  candidate: Candidate;
  status: ApplicationStatus;
  reviews: Review[];
  submittedAt: string;
  interviewDate?: string; 
}

// --- STORE LOGIC ---

interface AppState {
  jobs: Job[];
  applications: Application[];
  
  // Actions
  addApplication: (application: Application) => void;
  updateStatus: (appId: string, status: ApplicationStatus) => void;
  addReview: (appId: string, review: Review) => void;
  scheduleInterview: (appId: string, date: string) => void;
}

// Mock Data
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Engineer',
    location: 'Remote',
    description: 'Build realistic, stateful frontend applications using React.',
    requirements: ['React', 'TypeScript', 'State Management'],
  },
  {
    id: '2',
    title: 'Product Designer',
    location: 'Accra, Ghana',
    description: 'Design intuitive user experiences for digital products.',
    requirements: ['Figma', 'Prototyping', 'UX Research'],
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      jobs: MOCK_JOBS,
      applications: [], 

      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, application],
        })),

      updateStatus: (appId, status) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === appId ? { ...app, status } : app
          ),
        })),

      addReview: (appId, review) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === appId
              ? { ...app, reviews: [...app.reviews, review], status: 'reviewed' }
              : app
          ),
        })),

      scheduleInterview: (appId, date) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === appId
              ? { ...app, interviewDate: date, status: 'interview_scheduled' }
              : app
          ),
        })),
    }),
    {
      name: 'hirelink-storage', 
    }
  )
);