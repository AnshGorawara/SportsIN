import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Award, Star, Users } from 'lucide-react';
import { AthleteProfile } from '@shared/schema';

interface ProfileStatsProps {
  profile: AthleteProfile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const achievements = profile.achievements || [];
  const stats = profile.stats || {};
  const experience = profile.experience || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Performance Stats */}
      <Card className="card-sports">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-victory" />
            <span>Performance Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-lg font-bold text-primary">{value}</span>
              </div>
              {typeof value === 'number' && value <= 100 && (
                <Progress value={value} className="h-2" />
              )}
            </div>
          ))}
          {Object.keys(stats).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No performance stats yet. Add your achievements!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Career Highlights */}
      <Card className="card-sports">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-energy" />
            <span>Career Highlights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.slice(0, 5).map((achievement, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-victory rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">{achievement}</p>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No achievements added yet. Showcase your wins!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Experience Timeline */}
      <Card className="card-sports">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-champion" />
            <span>Experience</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-primary pl-4 pb-4 relative">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-2 top-1"></div>
              <h4 className="font-medium">{exp.team}</h4>
              <p className="text-sm text-muted-foreground">{exp.position}</p>
              <p className="text-xs text-muted-foreground">{exp.duration}</p>
              {exp.achievements && (
                <p className="text-sm mt-2">{exp.achievements}</p>
              )}
            </div>
          ))}
          {experience.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No experience added yet. Build your timeline!
            </p>
          )}
        </CardContent>
      </Card>

      {/* NIL & Engagement */}
      <Card className="card-sports">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>NIL & Engagement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total NIL Earnings</span>
            <span className="text-xl font-bold text-green-600">
              ₹{profile.nilEarnings?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Followers</span>
            <span className="text-lg font-bold text-primary">
              {profile.followers?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Video Highlights</span>
            <span className="text-lg font-bold text-champion">
              {profile.highlights?.length || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sport & Position */}
      <Card className="card-sports">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-victory" />
            <span>Sport Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{profile.sport}</div>
            {profile.position && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {profile.position}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Career Stage</span>
              <span className="text-sm">
                {experience.length > 5 ? 'Veteran' : experience.length > 2 ? 'Experienced' : 'Rising Star'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Achievement Level</span>
              <span className="text-sm">
                {achievements.length > 10 ? 'Elite' : achievements.length > 5 ? 'Accomplished' : 'Developing'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="card-sports">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span>Education</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile.education?.map((edu, index) => (
            <div key={index} className="border rounded-lg p-3">
              <h4 className="font-medium">{edu.degree}</h4>
              <p className="text-sm text-muted-foreground">{edu.institution}</p>
              <p className="text-xs text-muted-foreground">{edu.year}</p>
            </div>
          ))}
          {(!profile.education || profile.education.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              No education details added yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
