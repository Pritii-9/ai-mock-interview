import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import InterviewCard from '../components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.actions'; // Import your auth action
import { redirect } from 'next/navigation';

// Make the component an 'async' Server Component
const page = async () => {

  // Fetch the current user's data
  const user = await getCurrentUser();

  // If there's no user, redirect to the sign-in page.
  // This is a safety check in case the middleware fails for any reason.
  if (!user) {
    redirect('/sign-in');
  }

  // TODO: Replace dummyInterviews with a function that fetches user-specific interviews from your database.
  // For now, we'll keep the dummy data for demonstration.
  const dummyInterviews = [
    // Your dummy data here...
    { id: '1', userId: 'user1', role: 'Software Engineer', type: 'Technical', techstack: ['React', 'Node.js'], createdAt: new Date().toISOString() },
    { id: '2', userId: 'user1', role: 'Data Analyst', type: 'Behavioral', techstack: ['Python', 'SQL'], createdAt: new Date().toISOString() },
  ];

  return (
    <>
      <section className='card-cta'>
        <div className="flex flex-col gap-6 max-w-lg">
          {/* You can now use the user's name here! */}
          <h2>Welcome, {user.name}! Get Interview-Ready with AI-Powered Feedback</h2>
          <p className='text-lg'>
            Practice on real interview questions & get instant feedback 
          </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
          <Image src="/robot.png" alt='robo-dude' width={400} height={400} className='max-sm:hidden' />
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}       
          {/* A message for when there are no interviews */}
          {dummyInterviews.length === 0 && <p>You haven&apos;t taken any interviews yet</p>}
        </div>
      </section>
      {/* You can remove this section if you only want to show user's interviews */}
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}       
        </div>
      </section>
    </>
  )
}

export default page;