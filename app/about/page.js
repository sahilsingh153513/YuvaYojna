'use client';

import { useDaisyTheme } from '@/context/DaisyThemeContext';

export default function AboutUs() {
  const { theme } = useDaisyTheme();
  
  return (
    <div className="min-h-screen bg-base-100 py-12" data-theme={theme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div>
            <h1 className="text-4xl font-bold text-primary mb-8">About Us</h1>
            <div className="space-y-6 text-base-content/70">
              <p className="text-lg leading-relaxed">
                Yuva Yojna is a comprehensive platform dedicated to empowering students across India 
                with the tools, guidance, and opportunities they need to build successful careers.
              </p>
              <p className="text-lg leading-relaxed">
                We believe that every student deserves access to quality career guidance, skill development 
                programs, and direct connections with industry leaders. Our platform bridges the gap between 
                education and employment, helping students discover their potential and achieve their dreams.
              </p>
              
              {/* Additional content with cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="card-body p-4">
                    <h3 className="card-title text-secondary text-sm">Our Mission</h3>
                    <p className="text-base-content/80 text-sm">Empowering youth with career opportunities and skill development</p>
                  </div>
                </div>
                <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="card-body p-4">
                    <h3 className="card-title text-accent text-sm">Our Vision</h3>
                    <p className="text-base-content/80 text-sm">Creating a future where every student achieves their career goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
           
          {/* Video Section */}
          <div className="relative">
            <div className="aspect-video bg-base-200 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/bNOWkB-6cmc"
                title="About Us Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full blur-lg"></div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-16">
          <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-base-200 w-full">
            <div className="stat">
              <div className="stat-title text-base-content/60">Students Helped</div>
              <div className="stat-value text-primary">10K+</div>
              <div className="stat-desc text-base-content/50">Across India</div>
            </div>
            
            <div className="stat">
              <div className="stat-title text-base-content/60">Career Opportunities</div>
              <div className="stat-value text-secondary">500+</div>
              <div className="stat-desc text-base-content/50">Available daily</div>
            </div>
            
            <div className="stat">
              <div className="stat-title text-base-content/60">Success Rate</div>
              <div className="stat-value text-accent">85%</div>
              <div className="stat-desc text-base-content/50">Job placement</div>
            </div>
            
            <div className="stat">
              <div className="stat-title text-base-content/60">Partner Companies</div>
              <div className="stat-value text-info">200+</div>
              <div className="stat-desc text-base-content/50">Hiring partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}