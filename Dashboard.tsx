import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useFirestore } from '@/hooks/useFirestore';
import { useLocation } from 'wouter';
import { orderBy, limit, where } from 'firebase/firestore';
import { 
  Briefcase, Users, Star, TrendingUp, Calendar, Eye, 
  CheckCircle, ArrowRight, PlusCircle, Trophy, Target 
} from 'lucide-react';
import { Job, NILOpportunity, JobApplication } from '@shared/schema';

export default function Dashboard() {
  const { user, userData } = useAuthContext();
  const [, setLocation] = useLocation();
  
  const { data: recommendedJobs } = useFirestore<Job>('jobs', [
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
    limit(3)
  ]);
  
  const { data: myApplications } = useFirestore<JobApplication>('jobApplications', [
    where('applicantId', '==', user?.uid || ''),
    orderBy('appliedAt', 'desc'),
    limit(5)
  ]);
  
  const { data: nilOpportunities } = useFirestore<NILOpportunity>('nilOpportunities', [
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
    limit(3)
  ]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const profileCompletion = calculateProfileCompletion(userData);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Welcome back, {userData.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ready to take your sports career to the next level?
          </p>
        </div>
        <Button className="btn-sports" onClick={() => navigate('/profile')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Complete Profile
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-champion text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/jobs')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                {recommendedJobs.length} New
              </Badge>
            </div>
            <h3 className="font-bold text-lg mb-2">Job Opportunities</h3>
            <p className="text-sm opacity-90">Discover your next career move</p>
          </CardContent>
        </Card>

        <Card className="gradient-victory text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/nil')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                ₹45K
              </Badge>
            </div>
            <h3 className="font-bold text-lg mb-2">NIL Marketplace</h3>
            <p className="text-sm opacity-90">Monetize your influence</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/athletes')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                5 New
              </Badge>
            </div>
            <h3 className="font-bold text-lg mb-2">Network</h3>
            <p className="text-sm opacity-90">Connect with peers & mentors</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/education')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                New
              </Badge>
            </div>
            <h3 className="font-bold text-lg mb-2">Education Hub</h3>
            <p className="text-sm opacity-90">Upskill & get certified</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recommended for You</CardTitle>
                <CardDescription>Based on your profile and preferences</CardDescription>
              </div>
              <Button variant="ghost" onClick={() => navigate('/jobs')}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Applications</CardTitle>
              <CardDescription>Track your application status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myApplications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No applications yet. Start applying to jobs!
                </p>
              ) : (
                myApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Strength
                <span className="text-2xl font-bold text-primary">{profileCompletion}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={profileCompletion} className="mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Basic info completed
                </div>
                <div className="flex items-center text-gray-500">
                  <div className="w-4 h-4 border border-gray-300 rounded-full mr-2" />
                  Add sports achievements
                </div>
                <div className="flex items-center text-gray-500">
                  <div className="w-4 h-4 border border-gray-300 rounded-full mr-2" />
                  Upload profile photo
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => navigate('/profile')}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-bold">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applications Sent</span>
                <span className="font-bold">{myApplications.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">NIL Earnings</span>
                <span className="font-bold text-green-600">₹0</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Profile updated</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Joined SportsIN</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const navigate = useNavigate();
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold">{job.title}</h4>
          <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          92% Match
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {job.sport && <Badge variant="outline">{job.sport}</Badge>}
        <Badge variant="outline">{job.employmentType}</Badge>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{job.location}</span>
        <span className="font-bold text-green-600">{job.salary}</span>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: JobApplication }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium">Application #{application.id.slice(-6)}</h4>
          <p className="text-sm text-gray-500">
            Applied {new Date(application.appliedAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={getStatusColor(application.status)}>
          {application.status}
        </Badge>
      </div>
      
      {application.matchPercentage && (
        <div className="text-sm text-gray-600">
          Match: {application.matchPercentage}%
        </div>
      )}
    </div>
  );
}

function calculateProfileCompletion(userData: any): number {
  let completion = 0;
  const totalFields = 6;
  
  if (userData.name) completion++;
  if (userData.email) completion++;
  if (userData.bio) completion++;
  if (userData.city) completion++;
  if (userData.profilePicUrl) completion++;
  if (userData.role) completion++;
  
  return Math.round((completion / totalFields) * 100);
}
