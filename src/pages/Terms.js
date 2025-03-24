import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-light mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">1. Agreement to Terms</h2>
            <p>By accessing or using Limitless&apos;s services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">2. Investment Risks</h2>
            <p>Investing in venture capital funds involves substantial risk, including the possible loss of principal. Past performance is not indicative of future results. Investments are not FDIC insured.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">3. Accredited Investor Status</h2>
            <p>Access to investment opportunities requires verification of accredited investor status as defined by SEC Regulation D. Users must meet minimum income or net worth requirements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">4. User Responsibilities</h2>
            <p>Users are responsible for maintaining the confidentiality of their account information and for all activities under their account. Users must provide accurate and complete information during registration.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">5. Limitation of Liability</h2>
            <p>Limitless shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms; 