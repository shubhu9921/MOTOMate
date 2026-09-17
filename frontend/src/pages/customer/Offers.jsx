import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import api from '../../services/api';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.data.success) {
        setOffers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Offers & Coupons</h1>
            <p className="text-zinc-400 mt-1">Special discounts just for you.</p>
          </div>
        </div>
        
        {offers.length === 0 ? (
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-50 mb-2">No active offers</h2>
            <p className="text-zinc-400">Check back later for new discounts and promotions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-zinc-950 border-2 border-dashed border-yellow-900 rounded-2xl p-6 relative hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 bg-zinc-800 text-blue-800 font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl text-sm">
                  {offer.code}
                </div>
                <div className="mt-2">
                  <h3 className="text-2xl font-bold text-zinc-50">
                    {offer.discountType === 'PERCENTAGE' ? `${offer.discount}% OFF` : `₹${offer.discount} OFF`}
                  </h3>
                  <p className="text-zinc-400 mt-2">{offer.description}</p>
                  {offer.minBookingAmount && (
                    <p className="text-xs text-zinc-400 mt-2 font-medium">Min. order: ₹{offer.minBookingAmount}</p>
                  )}
                  <p className="text-xs text-zinc-400 mt-1">Valid until {new Date(offer.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Offers;
