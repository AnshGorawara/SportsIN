import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore } from '@/hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { 
  Users, Briefcase, Star, AlertTriangle, BarChart3, 
  TrendingUp, UserCheck, Building, Shield, Settings 
} from 'lucide-react';
import { Job, NILOpportunity, User as AppUser, JobApplication } from '@shared/schema';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data for admin panel
  const { data: users } = useFirestore<AppUser>('users', [orderBy('createdAt', 'desc')]);
  const { data: jobs } = useFirestore<Job>('jobs', [orderBy('createdAt', 'desc')]);
  const { data: nilOpportunities } = useFirestore<NILOpportunity>('nilOpportunities', [orderBy('createdAt', 'desc')]);
  const { data: applications } = useFirestore<JobApplication>('jobApplications', [orderBy('appliedAt', 'desc')]);

  // Calculate statistics
  const totalUsers = users.length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.isActive).length;
  const totalNILs = nilOpportunities.length;
  const activeNILs = nilOpportunities.filter(nil => nil.isActive).length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;

  // Get recent registrations (last 7 days)
  const recentUsers = users.filter(user => {
    const userDate = new Date(user.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate >= weekAgo;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the SportsIN platform</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin Access
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-sports">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-xs text-green-600">+{recentUsers.length} this week</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-sports">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Job Listings</p>
                <p className="text-2xl font-bold">{totalJobs}</p>
                <p className="text-xs text-blue-600">{activeJobs} active</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-sports">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">NIL Deals</p>
                <p className="text-2xl font-bold">{totalNILs}</p>
                <p className="text-xs text-purple-600">{activeNILs} active</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-sports">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{totalApplications}</p>
                <p className="text-xs text-orange-600">{pendingApplications} pending</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="nil">NIL Deals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">{user.name} joined as {user.role}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>Key metrics and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Jobs</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {((activeJobs / totalJobs) * 100).toFixed(0)}% Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Engagement</span>
                  <Badge variant="secondary">High</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Application Rate</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0} per job
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={user.role === 'admin' ? 'bg-red-100 text-red-800' : ''}
                      >
                        {user.role}
                      </Badge>
                      {user.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>Monitor and manage job listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 10).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={job.isActive ? 'secondary' : 'outline'}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {job.applicantCount || 0} applications
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NIL Tab */}
        <TabsContent value="nil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NIL Deal Management</CardTitle>
              <CardDescription>Monitor and moderate NIL opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nilOpportunities.slice(0, 10).map((nil) => (
                  <div key={nil.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="font-medium">{nil.title}</p>
                        <p className="text-sm text-muted-foreground">{nil.brandName} • {nil.compensation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={nil.isActive ? 'secondary' : 'outline'}>
                        {nil.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {nil.category.replace('-', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>User registration and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Athletes</span>
                    <span className="font-bold">
                      {users.filter(u => u.role === 'athlete').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Brands</span>
                    <span className="font-bold">
                      {users.filter(u => u.role === 'brand').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coaches</span>
                    <span className="font-bold">
                      {users.filter(u => u.role === 'coach').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scouts</span>
                    <span className="font-bold">
                      {users.filter(u => u.role === 'scout').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Reports</CardTitle>
                <CardDescription>Platform activity and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Job Applications</span>
                    <span className="font-bold text-blue-600">{totalApplications}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Reviews</span>
                    <span className="font-bold text-orange-600">{pendingApplications}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-bold text-green-600">
                      {totalApplications > 0 ? 
                        ((applications.filter(app => app.status === 'hired').length / totalApplications) * 100).toFixed(1) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
