'use client';

import React from 'react';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

const TestThemeComponent = () => {
  const { theme } = useDaisyTheme();

  return (
    <div className="fixed top-4 left-4 z-50 max-w-sm">
      {/* Test Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-4">
          <h2 className="card-title text-primary">Theme Test</h2>
          <p className="text-base-content">Current theme: <span className="font-bold text-secondary">{theme}</span></p>
          
          {/* Test Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="btn btn-primary btn-sm">Primary</button>
            <button className="btn btn-secondary btn-sm">Secondary</button>
            <button className="btn btn-accent btn-sm">Accent</button>
          </div>
          
          {/* Test Badge */}
          <div className="flex gap-2 mt-2">
            <span className="badge badge-primary">Primary Badge</span>
            <span className="badge badge-secondary">Secondary Badge</span>
          </div>
          
          {/* Test Alert */}
          <div className="alert alert-info mt-2">
            <span className="text-xs">If colors change, themes work!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestThemeComponent;