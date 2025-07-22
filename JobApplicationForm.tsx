import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { db } from '@/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { Job, JobApplication } from '@shared/schema';
import { X, Save, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { triggerCelebration } from '@/lib/confetti';

interface JobApplicationFormProps {
  job: Job;
  onClose: () => void;
}

const STEPS = 4;
const STEP_NAMES = ['Personal Info', 'Background', 'Documents', 'Review'];

const SPORTS = [
  'Cricket', 'Football', 'Badminton', 'Hockey', 'Basketball', 'Tennis',
  'Kabaddi', 'Athletics', 'Swimming', 'Volleyball', 'Wrestling', 'Boxing',
  'Table Tennis', 'Cycling', 'Golf', 'Other'
];

const INDIAN_CITIES = [
  'Mumbai, Maharashtra', 'Delhi, NCR', 'Bengaluru, Karnataka', 'Hyderabad, Telangana',
  'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh'
];

export default function JobApplicationForm({ job, onClose }: JobApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const { user } = useAuthContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: user?.email || '',
    phoneNumber: '',
    location: '',
    
    // Sports Background
    primarySport: '',
    position: '',
    experience: '',
    achievements: '',
    
    // Documents
    resumeUrl: '',
    coverLetterUrl: '',
    portfolioUrl: '',
    
    // Custom Questions
    whyInterested: '',
    keyStrengths: '',
    availability: '',
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (user && Object.values(formData).some(value => value.trim() !== '')) {
        autoSaveForm();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, user]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const autoSaveForm = async () => {
    if (!user) return;
    
    setAutoSaving(true);
    try {
      const draftKey = `job_application_draft_${job.id}_${user.uid}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const loadDraft = () => {
    if (!user) return;
    
    const draftKey = `job_application_draft_${job.id}_${user.uid}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draftData }));
        toast({
          title: "Draft loaded",
          description: "Your previously saved progress has been restored.",
        });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  };

  useEffect(() => {
    loadDraft();
  }, []);

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

  const submitApplication = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const applicationData: Partial<JobApplication> = {
        jobId: job.id!,
        applicantId: user.uid,
        status: 'pending',
        resumeUrl: formData.resumeUrl,
        coverLetterUrl: formData.coverLetterUrl,
        customAnswers: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          primarySport: formData.primarySport,
          position: formData.position,
          experience: formData.experience,
          achievements: formData.achievements,
          whyInterested: formData.whyInterested,
          keyStrengths: formData.keyStrengths,
          availability: formData.availability,
        },
        appliedAt: new Date(),
        lastUpdated: new Date(),
      };

      await addDoc(collection(db, 'jobApplications'), applicationData);

      // Update job application count
      await updateDoc(doc(db, 'jobs', job.id!), {
        applicantCount: (job.applicantCount || 0) + 1
      });

      // Clear draft
      const draftKey = `job_application_draft_${job.id}_${user.uid}`;
      localStorage.removeItem(draftKey);

      triggerCelebration("Application Submitted Successfully!");
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: "Submission Error",
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
            <div>
              <h3 className="text-xl font-bold mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Sports Background</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primarySport">Primary Sport *</Label>
                  <Select value={formData.primarySport} onValueChange={(value) => updateFormData('primarySport', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS.map((sport) => (
                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">Position/Role</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => updateFormData('position', e.target.value)}
                    placeholder="e.g., Batsman, Defender, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="experience">Sports Experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    placeholder="Describe your sports experience, teams played for, tournaments..."
                    rows={4}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => updateFormData('achievements', e.target.value)}
                    placeholder="List your major achievements, awards, records..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Documents</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Resume/CV *</Label>
                  <FileUpload
                    onFileUploaded={(url, filename) => {
                      updateFormData('resumeUrl', url);
                      toast({
                        title: "Resume uploaded",
                        description: `${filename} has been uploaded successfully.`,
                      });
                    }}
                    uploadPath="resumes"
                    acceptedFileTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Cover Letter</Label>
                  <FileUpload
                    onFileUploaded={(url, filename) => {
                      updateFormData('coverLetterUrl', url);
                      toast({
                        title: "Cover letter uploaded",
                        description: `${filename} has been uploaded successfully.`,
                      });
                    }}
                    uploadPath="cover-letters"
                    acceptedFileTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="whyInterested">Why are you interested in this role? *</Label>
                <Textarea
                  id="whyInterested"
                  value={formData.whyInterested}
                  onChange={(e) => updateFormData('whyInterested', e.target.value)}
                  placeholder="Explain your interest in this specific role and company..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="keyStrengths">What are your key strengths for this role? *</Label>
                <Textarea
                  id="keyStrengths"
                  value={formData.keyStrengths}
                  onChange={(e) => updateFormData('keyStrengths', e.target.value)}
                  placeholder="Highlight your relevant skills and experiences..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Review Your Application</h3>
              
              {/* Application Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Personal Information</p>
                      <p className="text-sm text-muted-foreground">{formData.fullName}</p>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                      <p className="text-sm text-muted-foreground">{formData.phoneNumber}</p>
                      <p className="text-sm text-muted-foreground">{formData.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Sports Background</p>
                      <p className="text-sm text-muted-foreground">{formData.primarySport} {formData.position && `- ${formData.position}`}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium">Documents</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.resumeUrl && <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">✓ Resume</span>}
                      {formData.coverLetterUrl && <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">✓ Cover Letter</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="availability">When can you start?</Label>
                <Select value={formData.availability} onValueChange={(value) => updateFormData('availability', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="1-week">Within 1 week</SelectItem>
                    <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: 
        return formData.fullName && formData.email && formData.phoneNumber && formData.location;
      case 2: 
        return formData.primarySport;
      case 3: 
        return formData.resumeUrl && formData.whyInterested && formData.keyStrengths;
      case 4: 
        return formData.availability;
      default: 
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="sticky top-0 bg-background border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Apply for {job.title}</CardTitle>
              <CardDescription>{job.company} • {job.location}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">{STEP_NAMES[currentStep - 1]}</span>
              <span className="text-muted-foreground">
                Step {currentStep} of {STEPS} • {Math.round((currentStep / STEPS) * 100)}% Complete
                {autoSaving && <span className="ml-2 text-blue-500">Saving...</span>}
              </span>
            </div>
            <Progress value={(currentStep / STEPS) * 100} className="h-2" />
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => autoSaveForm()}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep === STEPS ? (
                <Button
                  onClick={submitApplication}
                  disabled={!canProceed() || loading}
                  className="btn-sports"
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="btn-sports"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
