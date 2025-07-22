export interface User {
  id: string;
  email: string;
  name: string;
  role: 'athlete' | 'brand' | 'coach' | 'scout' | 'admin' | 'manager';
  profilePicUrl?: string;
  city?: string;
  bio?: string;
  createdAt: Date;
  onboardingComplete: boolean;
  verified: boolean;
}

export interface AthleteProfile {
  id?: string;
  userId: string;
  sport: string;
  position?: string;
  achievements: string[];
  stats: Record<string, any>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience: Array<{
    team: string;
    position: string;
    duration: string;
    achievements?: string;
  }>;
  nilEarnings: number;
  followers: number;
  highlights: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface Job {
  id?: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  city: string;
  state: string;
  salary: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  sport?: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  postedBy: string;
  createdAt: Date;
  applicationDeadline: Date;
  isActive: boolean;
  sector: 'private' | 'public' | 'government' | 'ngo';
  applicantCount?: number;
}

export interface NILOpportunity {
  id?: string;
  title: string;
  brandName: string;
  description: string;
  compensation: string;
  requirements: string[];
  sport?: string;
  minFollowers: number;
  platforms: string[];
  duration: string;
  createdBy: string;
  createdAt: Date;
  deadline: Date;
  isActive: boolean;
  category: 'product' | 'service' | 'event' | 'brand-ambassador';
  applicantCount?: number;
}

export interface JobApplication {
  id?: string;
  jobId: string;
  applicantId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  resumeUrl: string;
  coverLetterUrl?: string;
  customAnswers: Record<string, any>;
  appliedAt: Date;
  lastUpdated: Date;
  matchPercentage?: number;
}