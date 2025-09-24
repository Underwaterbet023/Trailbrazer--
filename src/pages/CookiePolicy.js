import React from 'react';

function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-600 mb-4">Last updated: June 2023</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. What Are Cookies</h2>
          <p className="text-gray-700 mb-3">
            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you.
          </p>
          <p className="text-gray-700 mb-3">
            Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Cookies</h2>
          <p className="text-gray-700 mb-3">
            When you use and access our service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-3">
            <li className="mb-2">To enable certain functions of the service</li>
            <li className="mb-2">To provide analytics</li>
            <li className="mb-2">To store your preferences</li>
            <li className="mb-2">To enable advertisements delivery, including behavioral advertising</li>
          </ul>
          <p className="text-gray-700 mb-3">
            We use both session and persistent cookies on the service and we use different types of cookies to run the service:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-3">
            <li className="mb-2">Essential cookies. We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
            <li className="mb-2">Preferences cookies. We may use preferences cookies to remember information that changes the way the service behaves or looks, such as the "remember me" functionality.</li>
            <li className="mb-2">Analytics cookies. We may use analytics cookies to track information how the service is used so that we can make improvements.</li>
            <li className="mb-2">Advertising cookies. These cookies collect information about your visit to our website, the content you viewed, the links you followed and information about your browser, device, and your IP address.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Third-Party Cookies</h2>
          <p className="text-gray-700 mb-3">
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. What Are Your Choices Regarding Cookies</h2>
          <p className="text-gray-700 mb-3">
            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
          </p>
          <p className="text-gray-700 mb-3">
            Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Where Can You Find More Information About Cookies</h2>
          <p className="text-gray-700 mb-3">
            You can learn more about cookies and the following third-party websites:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-3">
            <li className="mb-2">AllAboutCookies: <a href="http://www.allaboutcookies.org/" className="text-primary-600 hover:text-primary-800">http://www.allaboutcookies.org/</a></li>
            <li className="mb-2">Network Advertising Initiative: <a href="http://www.networkadvertising.org/" className="text-primary-600 hover:text-primary-800">http://www.networkadvertising.org/</a></li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Contact Us</h2>
          <p className="text-gray-700 mb-3">
            If you have any questions about our Cookie Policy, please contact us at:
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

export default CookiePolicy;