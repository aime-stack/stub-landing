'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import RewardsSystem from '@/components/RewardsSystem';
import Showcase from '@/components/Showcase';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import SignupModal from '@/components/SignupModal';

export default function Home() {
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const handleGetStarted = () => {
    setSignupModalOpen(true);
  };

  return (
    <main>
      <Header />
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <HowItWorks />
      <RewardsSystem />
      <Showcase />
      <Testimonials />
      <CTA onGetStarted={handleGetStarted} />
      <Footer />
      
      <SignupModal 
        isOpen={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)} 
      />
    </main>
  );
}
