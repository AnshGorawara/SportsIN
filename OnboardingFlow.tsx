import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useLocation } from 'wouter';
import { Trophy, Users, Target, BookOpen, Building, UserCheck } from 'lucide-react';

const STEPS = 4;

const ROLES = [
  { id: 'athlete', label: 'Athlete', icon: Trophy, description: 'Professional or aspiring athlete' },
  { id: 'brand', label: 'Brand', icon: Building, description: 'Sports brand or company' },
  { id: 'coach', label: 'Coach', icon: UserCheck, description: 'Sports coach or trainer' },
  { id: 'scout', label: 'Scout', icon: Target, description: 'Talent scout or recruiter' },
  { id: 'admin', label: 'Admin', icon: Users, description: 'Platform administrator' },
  { id: 'manager', label: 'Manager', icon: BookOpen, description: 'Sports manager or agent' },
];

const SPORTS = [
  'Cricket', 'Football', 'Badminton', 'Hockey', 'Basketball', 'Tennis', 
  'Kabaddi', 'Athletics', 'Swimming', 'Volleyball', 'Wrestling', 'Boxing',
  'Table Tennis', 'Cycling', 'Golf', 'Other'
];

const INDIAN_CITIES = [
  'Mumbai, Maharashtra', 'Delhi, NCR', 'Bengaluru, Karnataka', 'Hyderabad, Telangana',
  'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh'
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    sport: '',
    position: '',
    city: '',
    bio: '',
    experience: '',
    goals: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update user document
      await updateDoc(doc(db, 'users', user.uid), {
        role: formData.role,
        city: formData.city,
        bio: formData.bio,
        onboardingComplete: true,
      });

      // Create role-specific profile
      if (formData.role === 'athlete') {
        await setDoc(doc(db, 'athleteProfiles', user.uid), {
          userId: user.uid,
          sport: formData.sport,
          position: formData.position,
          achievements: [],
          stats: {},
          education: [],
          experience: [],
          nilEarnings: 0,
          followers: 0,
          highlights: [],
        });
      }

      toast({
        title: "Welcome to SportsIN! 🎉",
        description: "Your profile has been created successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Choose Your Role</h2>
              <p className="text-gray-600 dark:text-gray-400">What best describes you?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <Card
                    key={role.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      formData.role === role.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => updateFormData('role', role.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="font-bold mb-2">{role.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Tell Us About Your Sport</h2>
              <p className="text-gray-600 dark:text-gray-400">Help us personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="sport">Primary Sport</Label>
                <Select value={formData.sport} onValueChange={(value) => updateFormData('sport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'athlete' && (
                <div>
                  <Label htmlFor="position">Position/Role</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => updateFormData('position', e.target.value)}
                    placeholder="e.g., Batsman, Defender, etc."
                  />
                </div>
              )}

              <div>
                <Label htmlFor="city">Location</Label>
                <Select value={formData.city} onValueChange={(value) => updateFormData('city', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Share Your Story</h2>
              <p className="text-gray-600 dark:text-gray-400">Tell us about yourself and your experience</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  placeholder="Describe your sports experience..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">What Are Your Goals?</h2>
              <p className="text-gray-600 dark:text-gray-400">Help us recommend the best opportunities for you</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="goals">Your Goals</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => updateFormData('goals', e.target.value)}
                  placeholder="What do you hope to achieve on SportsIN?"
                  rows={4}
                />
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6">
              <h3 className="font-bold mb-2">You're Almost Done! 🎉</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your profile will be created and you'll have access to all SportsIN features.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.role !== '';
      case 2: return formData.sport !== '' && formData.city !== '';
      case 3: return formData.bio !== '';
      case 4: return formData.goals !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-display">Welcome to SportsIN</CardTitle>
              <span className="text-sm text-gray-500">Step {currentStep} of {STEPS}</span>
            </div>
            <Progress value={(currentStep / STEPS) * 100} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === STEPS ? (
              <Button
                onClick={completeOnboarding}
                disabled={!canProceed() || loading}
                className="btn-sports"
              >
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-sports"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
