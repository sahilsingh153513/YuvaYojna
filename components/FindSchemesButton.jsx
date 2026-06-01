'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useDaisyTheme } from '@/context/DaisyThemeContext';
import FormPage from '@/app/form/page';

export default function FindSchemesButton() {
  const { theme } = useDaisyTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div data-theme={theme}>
      {/* Centered Button Container */}
      <div className="flex justify-center items-center py-8 mt-8">
        <button 
          onClick={handleClick}
          className="btn btn-primary btn-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <span>Find Schemes For You</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Modal */}
      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-5xl bg-base-100 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-base-100 z-10 pb-4 border-b border-base-300">
            <h3 className="font-bold text-lg text-primary">Find Your Perfect Schemes</h3>
            <button 
              className="btn btn-sm btn-circle btn-ghost hover:btn-error"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div className="py-4">
            <FormPage />
          </div>
        </div>
        
        {/* Modal Backdrop */}
        <div className="modal-backdrop bg-black/50" onClick={closeModal}>
          <button>close</button>
        </div>
      </div>
    </div>
  );
}