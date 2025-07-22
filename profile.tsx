import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import AthleteProfile from '@/components/profile/AthleteProfile';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function Profile() {
  const { user, userData, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  // If user hasn't completed onboarding, show onboarding flow
  if (userData && !userData.onboardingComplete) {
    return <OnboardingFlow />;
  }

  // Show athlete profile for authenticated users
  return <AthleteProfile />;
}
