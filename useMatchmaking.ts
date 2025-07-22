import { useState, useEffect } from 'react';
import { Job, AthleteProfile } from '@shared/schema';

interface MatchScore {
  jobId: string;
  score: number;
  reasons: string[];
}

export function useMatchmaking(athleteProfile: AthleteProfile | null) {
  const [matchScores, setMatchScores] = useState<MatchScore[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateMatchScore = (job: Job, profile: AthleteProfile): MatchScore => {
    let score = 0;
    const reasons: string[] = [];

    // Sport match (40% weight)
    if (job.sport && profile.sport === job.sport) {
      score += 40;
      reasons.push(`Perfect sport match: ${job.sport}`);
    } else if (job.sport && profile.sport) {
      // Partial sport similarity logic could go here
      score += 10;
      reasons.push(`Related sport experience`);
    } else {
      score += 20; // Neutral if no sport specified
    }

    // Location match (25% weight)
    const profileCity = profile.userId; // This would be retrieved from user data
    if (job.city && profileCity === job.city) {
      score += 25;
      reasons.push(`Same city: ${job.city}`);
    } else if (job.state && profileCity?.includes(job.state)) {
      score += 15;
      reasons.push(`Same state`);
    }

    // Experience level match (20% weight)
    const experienceYears = profile.experience?.length || 0;
    if (job.experienceLevel === 'entry' && experienceYears <= 2) {
      score += 20;
      reasons.push(`Perfect for entry level`);
    } else if (job.experienceLevel === 'mid' && experienceYears >= 2 && experienceYears <= 5) {
      score += 20;
      reasons.push(`Great mid-level fit`);
    } else if (job.experienceLevel === 'senior' && experienceYears >= 5) {
      score += 20;
      reasons.push(`Senior level experience`);
    } else {
      score += 10;
    }

    // Achievement match (15% weight)
    if (profile.achievements && profile.achievements.length > 0) {
      score += 15;
      reasons.push(`Strong achievement record`);
    }

    // Ensure score doesn't exceed 100
    score = Math.min(score, 100);

    return {
      jobId: job.id!,
      score: Math.round(score),
      reasons
    };
  };

  const calculateMatches = async (jobs: Job[]) => {
    if (!athleteProfile) return;

    setLoading(true);
    try {
      const scores = jobs.map(job => calculateMatchScore(job, athleteProfile));
      setMatchScores(scores.sort((a, b) => b.score - a.score));
    } finally {
      setLoading(false);
    }
  };

  const getMatchScore = (jobId: string): MatchScore | undefined => {
    return matchScores.find(match => match.jobId === jobId);
  };

  return {
    matchScores,
    loading,
    calculateMatches,
    getMatchScore
  };
}
