import React from "react";

const RefundPolicy = () => {
  return (
    <div className="bg-[#fffafb] min-h-screen py-20 px-6 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-pink-100">
        <h1 className="font-serif text-4xl mb-8 text-center text-gray-900">Refund & Return Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            At Aravya Jewels, we want you to be completely satisfied with your purchase. 
            If you are not entirely happy, we're here to help.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Returns</h2>
          <p>
            You have 14 calendar days to return an item from the date you received it.
            To be eligible for a return, your item must be unused, unworn, and in the same condition that you received it.
            Your item must be in the original packaging, complete with all certificates, tags, and documentation.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Non-returnable Items</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Customized, engraved, or personalized jewellery.</li>
            <li>Items that have been altered or resized by a third party.</li>
            <li>Gift cards.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Refunds</h2>
          <p>
            Once we receive your item, we will inspect it and notify you that we have received your returned item. 
            We will immediately notify you on the status of your refund after inspecting the item.
            If your return is approved, we will initiate a refund to your credit card (or original method of payment).
            You will receive the credit within a certain amount of days, depending on your card issuer's policies.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Shipping for Returns</h2>
          <p>
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
            If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>
          
          <p className="mt-8 pt-6 border-t border-gray-200 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
