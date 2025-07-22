import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useFirestore } from '@/hooks/useFirestore';
import { ProfileStats } from './ProfileStats';
import { 
  Edit, Camera, MapPin, Calendar, Star, Trophy, Users, 
  Instagram, Twitter, Youtube, ExternalLink, CheckCircle,
  TrendingUp, Award, Target, BookOpen
} from 'lucide-react';
import { AthleteProfile as AthleteProfileType } from '@shared/schema';
import { where } from 'firebase/firestore';

interface AthleteProfileProps {
  userId?: string;
}

export default function AthleteProfile({ userId }: AthleteProfileProps) {
  const { user, userData } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const isOwnProfile = !userId || userId === user?.uid;
  const profileUserId = userId || user?.uid;

  const { data: athleteProfiles } = useFirestore<AthleteProfileType>('athleteProfiles', 
    profileUserId ? [where('userId', '==', profileUserId)] : []
  );
  
  const profile = athleteProfiles[0];

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Athlete Profile Found</h2>
            <p className="text-muted-foreground mb-6">
              {isOwnProfile 
                ? "You haven't created your athlete profile yet." 
                : "This user hasn't created an athlete profile yet."}
            </p>
            {isOwnProfile && (
              <Button className="btn-sports">
                <Edit className="mr-2 h-4 w-4" />
                Create Profile
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card className="card-sports">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary via-champion to-energy rounded-t-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Athlete
              </Badge>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 relative z-10">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage 
                    src={userData?.profilePicUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                    alt={userData?.name || 'Athlete'}
                  />
                  <AvatarFallback className="text-2xl">
                    {userData?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{userData?.name}</h1>
                    <p className="text-xl text-muted-foreground">
                      {profile.sport} {profile.position && `• ${profile.position}`}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {userData?.city || 'Location not specified'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {new Date(userData?.createdAt || '').getFullYear()}
                      </div>
                    </div>
                  </div>
                  
                  {isOwnProfile ? (
                    <Button className="mt-4 md:mt-0">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button className="btn-sports">
                        <Users className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile.followers?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-victory">
                  {profile.achievements?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{profile.nilEarnings?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">NIL Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-champion">
                  {profile.experience?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Teams</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Performance</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="nil">NIL Deals</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {userData?.bio || "No bio provided yet."}
                  </p>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-victory" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.achievements && profile.achievements.length > 0 ? (
                    <div className="space-y-3">
                      {profile.achievements.slice(0, 5).map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Award className="w-5 h-5 text-victory mt-0.5" />
                          <p>{achievement}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No achievements listed yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social Media */}
              {profile.socialMedia && (
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.socialMedia.instagram && (
                      <a 
                        href={`https://instagram.com/${profile.socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-pink-500" />
                        <span>@{profile.socialMedia.instagram}</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    {profile.socialMedia.twitter && (
                      <a 
                        href={`https://twitter.com/${profile.socialMedia.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Twitter className="w-5 h-5 text-blue-500" />
                        <span>@{profile.socialMedia.twitter}</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    {profile.socialMedia.youtube && (
                      <a 
                        href={`https://youtube.com/${profile.socialMedia.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Youtube className="w-5 h-5 text-red-500" />
                        <span>{profile.socialMedia.youtube}</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Availability</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Looking for</span>
                    <span className="text-sm font-medium">Opportunities</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Rate</span>
                    <span className="text-sm font-medium text-green-600">95%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Performance Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <ProfileStats profile={profile} />
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-champion" />
                <span>Professional Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.experience && profile.experience.length > 0 ? (
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-6 pb-6 relative">
                      <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-1"></div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">{exp.team}</h3>
                          <Badge variant="outline">{exp.duration}</Badge>
                        </div>
                        <p className="text-muted-foreground">{exp.position}</p>
                        {exp.achievements && (
                          <p className="text-sm">{exp.achievements}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  No professional experience listed yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                        <Badge variant="outline">{edu.year}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  No education details added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Highlights Tab */}
        <TabsContent value="highlights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Highlights</CardTitle>
              <CardDescription>
                Showcase your best moments and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.highlights && profile.highlights.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.highlights.map((highlight, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Button variant="ghost" size="lg">
                          <Youtube className="w-8 h-8" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium">Highlight {index + 1}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Youtube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No highlights yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload your best gameplay moments to showcase your skills
                  </p>
                  {isOwnProfile && (
                    <Button className="btn-sports">
                      Upload Highlights
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NIL Deals Tab */}
        <TabsContent value="nil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>NIL Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{profile.nilEarnings?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Active Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-champion">0</div>
                  <div className="text-sm text-muted-foreground">Completed Deals</div>
                </div>
              </div>
              
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Ready for NIL opportunities</h3>
                <p className="text-muted-foreground mb-6">
                  Start earning from your sports influence and build your personal brand
                </p>
                <Button className="btn-sports">
                  Explore NIL Deals
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
