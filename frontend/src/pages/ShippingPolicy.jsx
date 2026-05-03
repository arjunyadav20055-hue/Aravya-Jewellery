import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="bg-[#fffafb] min-h-screen py-20 px-6 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-pink-100">
        <h1 className="font-serif text-4xl mb-8 text-center text-gray-900">Shipping Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            Thank you for visiting and shopping at Aravya Jewels. The following are the terms and conditions that constitute our Shipping Policy.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Domestic Shipping Policy</h2>
          <p><strong>Shipment processing time</strong></p>
          <p>
            All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.
            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Shipping rates & delivery estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout. 
            We currently offer Free Shipping across all locations in India for orders above ₹10,000.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard Delivery:</strong> 5-7 business days</li>
            <li><strong>Express Delivery:</strong> 2-3 business days (Subject to pin code serviceability)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). 
            The tracking number will be active within 24 hours. All our shipments are fully insured until they reach your doorstep.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Damages</h2>
          <p>
            Aravya Jewels is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
            Please save all packaging materials and damaged goods before filing a claim.
          </p>
          
          <p className="mt-8 pt-6 border-t border-gray-200 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
