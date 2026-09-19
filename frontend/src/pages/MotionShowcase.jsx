import React from 'react';
import { TextEffect } from '../../components/motion-primitives/text-effect';
import { TextScramble } from '../../components/motion-primitives/text-scramble';

const MotionShowcase = () => {
  return (
    <div className="min-h-screen bg-black text-white p-12 flex flex-col items-center justify-center space-y-24">
      
      <div className="text-center space-y-4">
        <h2 className="text-xl text-gray-400 mb-2">Text Effect</h2>
        <TextEffect 
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
          per="word"
          preset="blur"
        >
          Beautifully designed motion components for your next project.
        </TextEffect>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-xl text-gray-400 mb-2">Text Scramble</h2>
        <TextScramble 
          className="text-3xl md:text-5xl font-mono text-emerald-400"
          duration={1.2}
          characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        >
          SYSTEM INITIALIZED. WELCOME TO MOTORMATE.
        </TextScramble>
      </div>

    </div>
  );
};

export default MotionShowcase;
