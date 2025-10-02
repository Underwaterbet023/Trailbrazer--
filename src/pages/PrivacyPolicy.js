import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-600 mb-4">Last updated: June 2023</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-700 mb-3">
            Welcome to Trailblazers. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. The Data We Collect</h2>
          <p className="text-gray-700 mb-3">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-3">
            <li className="mb-2">Identity Data includes first name, last name, username or similar identifier.</li>
            <li className="mb-2">Contact Data includes email address and telephone numbers.</li>
            <li className="mb-2">Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li className="mb-2">Profile Data includes your username and password, your interests, preferences, feedback and survey responses.</li>
            <li className="mb-2">Usage Data includes information about how you use our website, products and services.</li>
            <li className="mb-2">Location Data includes your current location when you use our travel tracking features.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Data</h2>
          <p className="text-gray-700 mb-3">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-3">
            <li className="mb-2">To register you as a new customer.</li>
            <li className="mb-2">To process and deliver your bookings.</li>
            <li className="mb-2">To manage our relationship with you.</li>
            <li className="mb-2">To enable you to participate in community features.</li>
            <li className="mb-2">To provide travel safety information based on your location.</li>
            <li className="mb-2">To improve our website, products/services, marketing or customer relationships.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
          <p className="text-gray-700 mb-3">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
            used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data 
            to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Your Legal Rights</h2>
          <p className="text-gray-700 mb-3">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-3">
            <li className="mb-2">Request access to your personal data.</li>
            <li className="mb-2">Request correction of your personal data.</li>
            <li className="mb-2">Request erasure of your personal data.</li>
            <li className="mb-2">Object to processing of your personal data.</li>
            <li className="mb-2">Request restriction of processing your personal data.</li>
            <li className="mb-2">Request transfer of your personal data.</li>
            <li className="mb-2">Right to withdraw consent.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Contact Us</h2>
          <p className="text-gray-700 mb-3">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">Email: kumarsanskar52515@gmail.com</p>
            <p className="text-gray-700">Phone: +91 7302028936</p>
            <p className="text-gray-700">Address: Gautam Buddha University, Greater Noida</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;