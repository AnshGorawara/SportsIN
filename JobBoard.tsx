import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { JobCard } from './JobCard';
import JobApplicationForm from '../forms/JobApplicationForm';
import { orderBy, where, limit } from 'firebase/firestore';
import { Search, Filter, Briefcase, MapPin, Star, TrendingUp } from 'lucide-react';
import { Job, AthleteProfile } from '@shared/schema';

const SPORTS_FILTER = [
  'All Sports', 'Cricket', 'Football', 'Badminton', 'Hockey', 'Basketball', 
  'Tennis', 'Kabaddi', 'Athletics', 'Swimming', 'Volleyball'
];

const LOCATION_FILTER = [
  'All Locations', 'Mumbai, Maharashtra', 'Delhi, NCR', 'Bengaluru, Karnataka', 
  'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra'
];

const EXPERIENCE_FILTER = [
  'All Levels', 'entry', 'mid', 'senior', 'executive'
];

const EMPLOYMENT_TYPE_FILTER = [
  'All Types', 'full-time', 'part-time', 'contract', 'internship'
];

const SECTOR_FILTER = [
  'All Sectors', 'private', 'public', 'government', 'ngo'
];

export default function JobBoard() {
  const { user, userData } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedExperience, setSelectedExperience] = useState('All Levels');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All Types');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [showFilters, setShowFilters] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  // Fetch jobs
  const { data: allJobs, loading } = useFirestore<Job>('jobs', [
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  ]);

  // Fetch athlete profile for matchmaking
  const { data: athleteProfiles } = useFirestore<AthleteProfile>('athleteProfiles', 
    user ? [where('userId', '==', user.uid)] : []
  );
  
  const athleteProfile = athleteProfiles[0];
  const { calculateMatches, getMatchScore } = useMatchmaking(athleteProfile);

  // Filter jobs based on search and filters
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSport = selectedSport === 'All Sports' || 
      job.sport === selectedSport || 
      !job.sport;

    const matchesLocation = selectedLocation === 'All Locations' || 
      job.location.includes(selectedLocation.split(',')[0]);

    const matchesExperience = selectedExperience === 'All Levels' || 
      job.experienceLevel === selectedExperience;

    const matchesEmploymentType = selectedEmploymentType === 'All Types' || 
      job.employmentType === selectedEmploymentType;

    const matchesSector = selectedSector === 'All Sectors' || 
      job.sector === selectedSector;

    return matchesSearch && matchesSport && matchesLocation && 
           matchesExperience && matchesEmploymentType && matchesSector;
  });

  // Calculate match scores when jobs or profile changes
  useEffect(() => {
    if (filteredJobs.length > 0 && athleteProfile) {
      calculateMatches(filteredJobs);
    }
  }, [filteredJobs, athleteProfile]);

  // Sort jobs by match score if available
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const scoreA = getMatchScore(a.id!)?.score || 0;
    const scoreB = getMatchScore(b.id!)?.score || 0;
    return scoreB - scoreA;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSport('All Sports');
    setSelectedLocation('All Locations');
    setSelectedExperience('All Levels');
    setSelectedEmploymentType('All Types');
    setSelectedSector('All Sectors');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold">
          Discover Your Next 
          <span className="text-gradient"> Sports Career</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find opportunities that match your skills and ambitions in the sports industry
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPORTS_FILTER.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_FILTER.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedSport !== 'All Sports' || selectedLocation !== 'All Locations' || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_FILTER.map(level => (
                      <SelectItem key={level} value={level}>
                        {level === 'All Levels' ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Employment Type</label>
                <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPE_FILTER.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'All Types' ? type : type.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sector</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTOR_FILTER.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector === 'All Sectors' ? sector : sector.charAt(0).toUpperCase() + sector.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
          {athleteProfile && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Star className="w-3 h-3 mr-1" />
              AI-Matched Results
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>Sorted by relevance</span>
        </div>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="w-full h-4 bg-muted rounded"></div>
                <div className="w-3/4 h-3 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-muted rounded"></div>
                  <div className="w-5/6 h-3 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              athleteProfile={athleteProfile}
              onApply={setApplyingJob}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters to find more opportunities
            </p>
            <Button onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Job Application Modal */}
      {applyingJob && (
        <JobApplicationForm 
          job={applyingJob} 
          onClose={() => setApplyingJob(null)} 
        />
      )}
    </div>
  );
}
