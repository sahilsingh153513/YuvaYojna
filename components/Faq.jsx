import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDaisyTheme } from '@/context/DaisyThemeContext';

const faqs = [
  {
    question: "What is Yuva Yojgar?",
    answer: "Yuva Yojgar is a portal to help young jobseekers find curated opportunities, upskill, and connect with employers. (Replace with actual content.)",
  },
  {
    question: "How does Yuva Yojgar help me?",
    answer: "It connects you with job opportunities, skill-building programs, and career guidance.",
  },
  {
    question: "Who can apply on Yuva Yojgar?",
    answer: "Any young job seeker looking for opportunities can apply via the platform.",
  },
  {
    question: "Is Yuva Yojgar an official government website?",
    answer: "No, this is not an official government website.",
  },
  {
    question: "Do I need to pay any fee to apply via Yuva Yojgar?",
    answer: "No, the service is free of cost.",
  },
];

export default function YuvaYojgarFAQ() {
  const { theme } = useDaisyTheme();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4" data-theme={theme}>
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Illustration */}
        <div className="flex justify-center">
         <img src="faq2.png" alt="FAQ Illustration" className="w-full h-auto max-w-md" />
        </div>

        {/* Right FAQ Section */}
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4 leading-tight">
              FAQs - Helping You Step{" "}
              <span className="text-primary">Closer </span> to{" "}
              <span className="text-secondary">Opportunities</span>
            </h1>
          </div>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="overflow-hidden">
                <div
                  className={`
                    flex items-center justify-between p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg
                    ${index % 2 === 0 
                      ? 'bg-primary text-primary-content hover:bg-primary/90' 
                      : 'bg-secondary text-secondary-content hover:bg-secondary/90'
                    }
                    ${openIndex === index ? 'shadow-xl' : 'shadow-md'}
                  `}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-semibold">
                    {`${index + 1}. ${item.question}`}
                  </span>
                  <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </div>
                
                <div className={`
                  transition-all duration-300 ease-in-out overflow-hidden
                  ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="p-6 bg-base-100 border-l-4 border-r-4 border-b-4 rounded-b-2xl border-base-300 shadow-md">
                    <p className="text-base-content/80 text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              VIEW MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}