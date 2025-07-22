import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Calendar, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { NILOpportunity } from '@shared/schema';

interface NILCardProps {
  opportunity: NILOpportunity;
  onApply?: (opportunity: NILOpportunity) => void;
}

export function NILCard({ opportunity, onApply }: NILCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product': return '👕';
      case 'service': return '⚡';
      case 'event': return '🎉';
      case 'brand-ambassador': return '👑';
      default: return '🌟';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product': return 'from-blue-500 to-purple-600';
      case 'service': return 'from-green-500 to-teal-600';
      case 'event': return 'from-orange-500 to-red-600';
      case 'brand-ambassador': return 'from-purple-500 to-pink-600';
      default: return 'from-primary to-champion';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <Card className="card-sports">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(opportunity.category)} rounded-2xl flex items-center justify-center text-2xl`}>
            {getCategoryIcon(opportunity.category)}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{opportunity.compensation}</div>
            <div className="text-sm text-muted-foreground capitalize">
              {opportunity.category.replace('-', ' ')}
            </div>
          </div>
        </div>

        <CardTitle className="text-xl">{opportunity.title}</CardTitle>
        <CardDescription className="font-medium">{opportunity.brandName}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {opportunity.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {opportunity.sport && (
            <Badge variant="secondary">{opportunity.sport}</Badge>
          )}
          {opportunity.platforms.map((platform) => (
            <Badge key={platform} variant="outline">{platform}</Badge>
          ))}
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{opportunity.minFollowers.toLocaleString()}+ followers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{opportunity.duration}</span>
          </div>
        </div>

        {/* Requirements list */}
        {opportunity.requirements.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Requirements:</p>
            <div className="space-y-1">
              {opportunity.requirements.slice(0, 3).map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            <Star className="h-4 w-4 inline mr-1" />
            {opportunity.applicantCount || 0} applied
          </span>
          <span>
            Expires {formatDate(opportunity.deadline)}
          </span>
        </div>

        {/* Action Button */}
        <Button 
          className={`w-full bg-gradient-to-r ${getCategoryColor(opportunity.category)} text-white font-bold hover:opacity-90 transform hover:scale-105 transition-all duration-200`}
          onClick={() => onApply?.(opportunity)}
        >
          Apply Now
        </Button>

        {/* Success rate indicator */}
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span>High approval rate brand</span>
        </div>
      </CardContent>
    </Card>
  );
}
