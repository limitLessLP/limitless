import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-light mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including personal information, financial information, and accreditation status. We also collect data about how you use our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">2. How We Use Your Information</h2>
            <p>We use collected information to provide and improve our services, process your transactions, communicate with you, and comply with legal obligations. We may share your information with fund managers and regulatory authorities as required.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">3. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">4. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-black dark:text-white">5. Updates to Privacy Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy; 