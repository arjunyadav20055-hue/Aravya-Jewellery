import React from "react";

const TermsConditions = () => {
  return (
    <div className="bg-[#fffafb] min-h-screen py-20 px-6 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-pink-100">
        <h1 className="font-serif text-4xl mb-8 text-center text-gray-900">Terms & Conditions</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            Welcome to Aravya Jewels. These terms and conditions outline the rules and regulations for the use of our Website.
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Aravya Jewels if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. License</h2>
          <p>
            Unless otherwise stated, Aravya Jewels and/or its licensors own the intellectual property rights for all material on Aravya Jewels. All intellectual property rights are reserved. You may access this from Aravya Jewels for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must not republish material from our website.</li>
            <li>You must not sell, rent or sub-license material from Aravya Jewels.</li>
            <li>You must not reproduce, duplicate or copy material from Aravya Jewels.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Product Pricing & Availability</h2>
          <p>
            All prices are subject to change without notice. The price of gold fluctuates, and as such, our final product prices are dynamically calculated. 
            We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Accuracy of Information</h2>
          <p>
            We attempt to be as accurate as possible when describing our products on the Site; however, to the extent permitted by applicable law, we do not warrant that the product descriptions, colors, information or other content available on the Site are accurate, complete, reliable, current, or error-free.
          </p>
          
          <p className="mt-8 pt-6 border-t border-gray-200 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
