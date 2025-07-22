import { db } from '@/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Job, AthleteProfile, NILOpportunity } from '@shared/schema';

export async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Seed Jobs
    const jobs: Partial<Job>[] = [
      {
        title: 'Sports Analytics Manager',
        company: 'TATA Sports',
        description: 'Lead data-driven insights for India\'s premier cricket franchise. Perfect for ex-players with analytical mindset.',
        requirements: ['Cricket knowledge', 'Data analysis', '5+ years experience'],
        location: 'Mumbai, Maharashtra',
        city: 'Mumbai',
        state: 'Maharashtra',
        salary: '₹12-18L per year',
        employmentType: 'full-time',
        sport: 'Cricket',
        experienceLevel: 'mid',
        postedBy: 'system',
        createdAt: new Date(),
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        sector: 'private',
      },
      {
        title: 'Youth Development Coach',
        company: 'JSW Sports',
        description: 'Shape the next generation of Indian football talent. Looking for passionate ex-players with coaching certification.',
        requirements: ['Football background', 'Coaching certification', 'Youth development'],
        location: 'Bengaluru, Karnataka',
        city: 'Bengaluru',
        state: 'Karnataka',
        salary: '₹8-12L per year',
        employmentType: 'contract',
        sport: 'Football',
        experienceLevel: 'mid',
        postedBy: 'system',
        createdAt: new Date(),
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        isActive: true,
        sector: 'private',
      },
      {
        title: 'Sports Marketing Executive',
        company: 'Adidas India',
        description: 'Drive marketing campaigns for sports products. Experience in athlete partnerships preferred.',
        requirements: ['Marketing degree', 'Sports industry knowledge', '3+ years experience'],
        location: 'Delhi, NCR',
        city: 'Delhi',
        state: 'Delhi',
        salary: '₹10-15L per year',
        employmentType: 'full-time',
        experienceLevel: 'mid',
        postedBy: 'system',
        createdAt: new Date(),
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        isActive: true,
        sector: 'private',
      },
    ];

    for (const job of jobs) {
      await addDoc(collection(db, 'jobs'), job);
    }

    // Seed NIL Opportunities
    const nilOpportunities: Partial<NILOpportunity>[] = [
      {
        title: 'Nike India Performance Gear Campaign',
        brandName: 'Nike India',
        description: 'Looking for cricket athletes to showcase new performance gear. 2 Instagram posts + 1 story required.',
        compensation: '₹25,000 per post',
        requirements: ['5K+ Instagram followers', 'Cricket background', 'Performance gear focus'],
        sport: 'Cricket',
        minFollowers: 5000,
        platforms: ['Instagram'],
        duration: '15 days',
        createdBy: 'system',
        createdAt: new Date(),
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: true,
        category: 'product',
      },
      {
        title: 'HealthKart Nutrition Partnership',
        brandName: 'HealthKart',
        description: 'Feature our protein supplements in your training routine videos. 1 YouTube video + social amplification.',
        compensation: '₹15,000 per video',
        requirements: ['1K+ YouTube subscribers', 'Fitness content', 'Training videos'],
        minFollowers: 1000,
        platforms: ['YouTube', 'Instagram'],
        duration: '7 days',
        createdBy: 'system',
        createdAt: new Date(),
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        isActive: true,
        category: 'product',
      },
      {
        title: 'Dream11 Brand Ambassador',
        brandName: 'Dream11',
        description: 'Become a brand ambassador for India\'s leading fantasy sports platform. Multiple content requirements.',
        compensation: '₹40,000 monthly',
        requirements: ['10K+ followers', 'Cricket focus', 'Multi-platform presence'],
        sport: 'Cricket',
        minFollowers: 10000,
        platforms: ['Instagram', 'YouTube', 'Twitter'],
        duration: '6 months',
        createdBy: 'system',
        createdAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        category: 'brand-ambassador',
      },
    ];

    for (const nil of nilOpportunities) {
      await addDoc(collection(db, 'nilOpportunities'), nil);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
