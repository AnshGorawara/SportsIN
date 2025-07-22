import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Briefcase, Star, CheckCircle, ArrowRight, UserPlus, Search, MapPin, DollarSign } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFirestore } from '@/hooks/useFirestore';
import { orderBy, limit } from 'firebase/firestore';
import { Job, AthleteProfile, NILOpportunity } from '@shared/schema';

export default function Home() {
  const [, setLocation] = useLocation();
  
  const { data: featuredJobs } = useFirestore<Job>('jobs', [orderBy('createdAt', 'desc'), limit(2)]);
  const { data: featuredAthletes } = useFirestore<AthleteProfile>('athleteProfiles', [limit(3)]);
  const { data: featuredNILs } = useFirestore<NILOpportunity>('nilOpportunities', [orderBy('createdAt', 'desc'), limit(3)]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-champion to-energy text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Dynamic sports background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white transform rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white transform rotate-12"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Star className="h-4 w-4 text-victory" />
                  <span className="text-sm font-medium">India's #1 Sports Career Platform</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight">
                  Your Sports Career
                  <span className="block gradient-victory bg-clip-text text-transparent">
                    Starts Here
                  </span>
                </h1>
                <p className="text-xl text-gray-200 max-w-lg">
                  Connect with top brands, discover dream opportunities, and build your legacy in the world of sports. Join 50,000+ athletes already winning.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-sports" onClick={() => navigate('/auth')}>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Opportunities
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-victory">50K+</div>
                  <div className="text-sm text-gray-200">Athletes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-victory">2K+</div>
                  <div className="text-sm text-gray-200">Jobs Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-victory">500+</div>
                  <div className="text-sm text-gray-200">Brands</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative z-10">
                {/* Central heroic athlete image */}
                <div className="mx-auto w-80 h-80 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
                    alt="Athlete in action" 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-victory to-energy rounded-2xl p-4 shadow-2xl">
                  <div className="text-center text-white">
                    <div className="font-bold">₹2.5L+ NIL Earned</div>
                    <div className="text-sm opacity-90">This Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Opportunities & Talent</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Athletes */}
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="text-primary" />
                Top Athletes
              </h4>
              {featuredAthletes.map((athlete) => (
                <Card key={athlete.id} className="card-sports cursor-pointer">
                  <CardHeader className="pb-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
                        alt="Athlete Profile" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">Featured Athlete</CardTitle>
                        <CardDescription>{athlete.sport} • {athlete.position}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Hot Jobs */}
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold flex items-center gap-2">
                <Briefcase className="text-primary" />
                Hot Jobs
              </h4>
              {featuredJobs.map((job) => (
                <Card key={job.id} className="card-sports cursor-pointer">
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* NIL Deals */}
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold flex items-center gap-2">
                <Star className="text-primary" />
                NIL Deals
              </h4>
              {featuredNILs.map((nil) => (
                <Card key={nil.id} className="card-sports cursor-pointer">
                  <CardHeader>
                    <CardTitle>{nil.title}</CardTitle>
                    <CardDescription>{nil.brandName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {nil.compensation}
                      </span>
                      <Badge>{nil.sport || 'Any Sport'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
