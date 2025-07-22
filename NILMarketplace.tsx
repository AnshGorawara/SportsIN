import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { NILCard } from './NILCard';
import { orderBy, where } from 'firebase/firestore';
import { 
  Search, Filter, Star, TrendingUp, DollarSign, Users, 
  Sparkles, Target, Award, Calendar, Zap
} from 'lucide-react';
import { NILOpportunity } from '@shared/schema';

const CATEGORY_FILTER = [
  'All Categories', 'product', 'service', 'event', 'brand-ambassador'
];

const SPORT_FILTER = [
  'All Sports', 'Cricket', 'Football', 'Badminton', 'Hockey', 'Basketball', 'Tennis'
];

const PLATFORM_FILTER = [
  'All Platforms', 'Instagram', 'YouTube', 'Twitter', 'TikTok', 'Facebook'
];

export default function NILMarketplace() {
  const { user, userData } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [activeTab, setActiveTab] = useState('explore');

  // Fetch NIL opportunities
  const { data: allOpportunities, loading } = useFirestore<NILOpportunity>('nilOpportunities', [
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  ]);

  // Filter opportunities
  const filteredOpportunities = allOpportunities.filter(opportunity => {
    const matchesSearch = !searchQuery || 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' || 
      opportunity.category === selectedCategory;

    const matchesSport = selectedSport === 'All Sports' || 
      opportunity.sport === selectedSport ||
      !opportunity.sport;

    const matchesPlatform = selectedPlatform === 'All Platforms' || 
      opportunity.platforms.includes(selectedPlatform);

    return matchesSearch && matchesCategory && matchesSport && matchesPlatform;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedSport('All Sports');
    setSelectedPlatform('All Platforms');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold">
          NIL 
          <span className="text-gradient"> Marketplace</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Monetize your athletic influence and connect with brands looking for authentic partnerships
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-champion text-white">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">₹2.1Cr</div>
            <div className="text-sm opacity-90">Total NIL Value</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-victory text-white">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{allOpportunities.length}+</div>
            <div className="text-sm opacity-90">Active Opportunities</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm opacity-90">Payment Success Rate</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">24hrs</div>
            <div className="text-sm opacity-90">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explore">Explore Deals</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="my-applications">My Applications</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        {/* Explore Tab */}
        <TabsContent value="explore" className="space-y-6">
          {/* Search & Filters */}
          <Card>
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search NIL opportunities, brands, or campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_FILTER.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'All Categories' ? category : 
                         category.split('-').map(word => 
                           word.charAt(0).toUpperCase() + word.slice(1)
                         ).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORT_FILTER.map(sport => (
                      <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_FILTER.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(selectedCategory !== 'All Categories' || selectedSport !== 'All Sports' || 
                  selectedPlatform !== 'All Platforms' || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredOpportunities.length} Opportunities Available
            </h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Sorted by best match</span>
            </div>
          </div>

          {/* NIL Cards */}
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
          ) : filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map(opportunity => (
                <NILCard 
                  key={opportunity.id} 
                  opportunity={opportunity}
                  onApply={(nil) => {
                    // Handle NIL application
                    console.log('Apply to NIL:', nil);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No opportunities found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or check back later for new deals
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-energy" />
                <span>Trending NIL Deals</span>
              </CardTitle>
              <CardDescription>Most popular opportunities this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allOpportunities
                  .sort((a, b) => (b.applicantCount || 0) - (a.applicantCount || 0))
                  .slice(0, 6)
                  .map(opportunity => (
                    <NILCard 
                      key={opportunity.id} 
                      opportunity={opportunity}
                      onApply={(nil) => console.log('Apply to trending NIL:', nil)}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Applications Tab */}
        <TabsContent value="my-applications" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">
                Start applying to NIL opportunities to track your progress here
              </p>
              <Button 
                className="btn-sports"
                onClick={() => setActiveTab('explore')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Explore Opportunities
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Earnings Overview */}
            <Card className="gradient-victory text-white">
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">₹0</div>
                <div className="text-sm opacity-90">All time earnings</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-green-600">₹0</div>
                <div className="text-sm text-muted-foreground">Current month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-orange-600">₹0</div>
                <div className="text-sm text-muted-foreground">Awaiting payment</div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Start earning today!</h3>
              <p className="text-muted-foreground mb-6">
                Complete your first NIL deal to see your earnings history here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
