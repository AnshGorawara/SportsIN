import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock, Building, Calendar } from 'lucide-react';
import { Job } from '@shared/schema';
import { useMatchmaking } from '@/hooks/useMatchmaking';

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  athleteProfile?: any;
  showMatch?: boolean;
}

export function JobCard({ job, onApply, athleteProfile, showMatch = true }: JobCardProps) {
  const { getMatchScore } = useMatchmaking(athleteProfile);
  const matchScore = showMatch ? getMatchScore(job.id!) : null;

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
  };

  return (
    <Card className="card-sports">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-champion rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <span>{job.company}</span>
                {job.sector && (
                  <Badge variant="outline" className="text-xs">
                    {job.sector}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            {matchScore && (
              <Badge className={getMatchColor(matchScore.score)}>
                {matchScore.score}% Match
              </Badge>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(job.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {job.sport && (
            <Badge variant="secondary">{job.sport}</Badge>
          )}
          <Badge variant="secondary">{job.employmentType}</Badge>
          <Badge variant="secondary">{job.experienceLevel}</Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        {/* Job details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium text-green-600 dark:text-green-400">
              {job.salary}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Requirements preview */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Key Requirements:</p>
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {job.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{job.requirements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Match reasons */}
        {matchScore && matchScore.reasons.length > 0 && (
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
            <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">
              Why this is a great match:
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {matchScore.reasons[0]}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{job.applicantCount || 0} applications</span>
          </div>
          <Button 
            className="btn-sports"
            onClick={() => onApply?.(job)}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
