"use client"
import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, ExternalLink, Award, Users, FileText, Briefcase, ChevronRight } from 'lucide-react';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

export default function GovernmentFooter() {
  const { theme } = useDaisyTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .footer-container[data-theme="${theme}"] {
          background: hsl(var(--b1));
          color: hsl(var(--bc));
          border-top: 1px solid hsl(var(--b3));
        }
        .footer-container[data-theme="${theme}"] .bg-base-100 {
          background: hsl(var(--b1)) !important;
        }
        .footer-container[data-theme="${theme}"] .text-base-content {
          color: hsl(var(--bc)) !important;
        }
        .footer-container[data-theme="${theme}"] .border-base-300 {
          border-color: hsl(var(--b3)) !important;
        }
      `}</style>
      
      <div className="footer-container w-full" data-theme={theme}>
        <footer className="relative bg-base-100 text-base-content overflow-hidden border-t border-base-300 w-full">
          {/* Animated background elements - theme responsive */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse" style={{ background: 'hsl(var(--p))' }}></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ background: 'hsl(var(--s))' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-3xl animate-pulse delay-500" style={{ background: 'hsl(var(--a))' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Brand Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-2xl font-bold" style={{ color: 'hsl(var(--bc))' }}>
                    ©️2025 <span style={{ color: 'hsl(var(--su))' }}>Yuva</span><span style={{ color: 'hsl(var(--bc))' }}>Yojna</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm opacity-60" style={{ color: 'hsl(var(--bc))' }}>Powered by</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `linear-gradient(to right, hsl(var(--p)), hsl(var(--s)), hsl(var(--a)))` }}>
                        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'hsl(var(--b2))' }}>
                          <Award className="w-3 h-3" style={{ color: 'hsl(var(--bc))' }} />
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium" style={{ color: 'hsl(var(--bc))' }}>Digital India</div>
                        <div className="text-xs opacity-50" style={{ color: 'hsl(var(--bc))' }}>Be Empowered</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm opacity-60 leading-relaxed" style={{ color: 'hsl(var(--bc))' }}>
                    Digital India Corporation (DIC)<br/>
                    Ministry of Electronics & IT (MeitY)<br/>
                    Government of India®️
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex space-x-3">
                  {[
                    { name: 'LinkedIn', icon: 'in' },
                    { name: 'Facebook', icon: 'f' },
                    { name: 'Twitter', icon: 'x' },
                    { name: 'Instagram', icon: 'ig' }
                  ].map((social, index) => (
                    <a
                      key={social.name}
                      href="#"
                      className="btn btn-circle btn-outline btn-sm hover:btn-primary transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-xs font-bold">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Government Schemes */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold" style={{ color: 'hsl(var(--bc))' }}>Government Schemes</h3>
                <ul className="space-y-1">
                  {[
                    'PM Kisan Samman Nidhi',
                    'Ayushman Bharat',
                    'Digital India Initiative',
                    'Skill India Mission',
                    'Startup India',
                    'Pradhan Mantri Mudra Yojana',
                    'Beti Bachao Beti Padhao'
                  ].map((link, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-all duration-300 p-2 rounded-lg hover:bg-opacity-20"
                        style={{ 
                          color: 'hsl(var(--bc))',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'hsl(var(--b2))';
                          e.target.style.color = 'hsl(var(--p))';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'hsl(var(--bc))';
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-sm">{link}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Internship Programs */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold" style={{ color: 'hsl(var(--bc))' }}>Internship Programs</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Parliamentary Internship', icon: 'PI' },
                    { name: 'ISRO Student Program', icon: 'IS' },
                    { name: 'Ministry Internships', icon: 'MI' },
                    
                  ].map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block p-3 backdrop-blur-sm rounded-lg transition-all duration-300 border opacity-80 hover:opacity-100"
                      style={{
                        backgroundColor: 'hsl(var(--b2) / 0.3)',
                        borderColor: 'hsl(var(--bc) / 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'hsl(var(--b2) / 0.6)';
                        e.target.style.borderColor = 'hsl(var(--p) / 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'hsl(var(--b2) / 0.3)';
                        e.target.style.borderColor = 'hsl(var(--bc) / 0.1)';
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white" style={{ background: `linear-gradient(to right, hsl(var(--p)), hsl(var(--s)))` }}>
                          {item.icon}
                        </div>
                        <div className="text-sm opacity-70 hover:opacity-100 transition-colors" style={{ color: 'hsl(var(--bc))' }}>
                          {item.name}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Get in Touch */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold" style={{ color: 'hsl(var(--bc))' }}>Get in touch</h3>
                <div className="space-y-4">
                  <div className="text-sm opacity-60 leading-relaxed" style={{ color: 'hsl(var(--bc))' }}>
                    1st Floor, C3, Bennett University, Greater Noida, Uttar Pradesh - XXXXXX, India
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--p))' }} />
                      <a 
                        href="mailto:support-yuvayojna@digitalindia.gov.in" 
                        className="text-sm transition-colors underline hover:opacity-80"
                        style={{ color: 'hsl(var(--p))' }}
                      >
                        support-yuvayojna@digitalindia.gov.in
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--p))' }} />
                      <span className="text-sm opacity-60" style={{ color: 'hsl(var(--bc))' }}>
                        (011) 24303714 (9:00 AM to 5:30 PM)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tricolor bottom bar - theme responsive */}
          <div className="h-1 opacity-80" style={{ background: `linear-gradient(to right, hsl(var(--p)), hsl(var(--s)), hsl(var(--a)))` }}></div>
        </footer>
      </div>
    </>
  );
}