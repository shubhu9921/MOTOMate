import React from 'react';
import { History } from 'lucide-react';

const WashHistory = () => {
  return (
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Wash History</h1>
            <p className="text-zinc-400 mt-1">View your past completed services.</p>
          </div>
        </div>
        
        <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-10 text-center">
          <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-50 mb-2">No past history</h2>
          <p className="text-zinc-400">Your completed washes will appear here.</p>
        </div>
      </div>
    </>
  );
};

export default WashHistory;
