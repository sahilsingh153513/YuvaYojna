'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus, ExternalLink, MapPin, Building, Tag, ChevronDown, ChevronRight, Volume2, VolumeX, X, Sparkles, Clock, Target, BookOpen, TrendingUp, Download, FileText, Share2 } from 'lucide-react';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

const GovernmentSchemesPortal = () => {
  const { theme } = useDaisyTheme();
  const skills = ['JavaScript', 'Python', 'React', 'Node.js', 'Django', 'Machine Learning', 'Data Science'];
  const [schemesData, setSchemesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Schemes');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCaste, setSelectedCaste] = useState('');
  const [selectedBenefitType, setSelectedBenefitType] = useState('');
  const [selectedMinority, setSelectedMinority] = useState('');
  const [selectedDisability, setSelectedDisability] = useState('');
  const [selectedBpl, setSelectedBpl] = useState('');
  const [selectedEmployment, setSelectedEmployment] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [sortBy, setSortBy] = useState('Relevance');
  const [itemsToShow, setItemsToShow] = useState(10);
  const [loadMoreCount, setLoadMoreCount] = useState(0);
  const [additionalSchemes, setAdditionalSchemes] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    schemeCategory: true,
    gender: false,
    caste: false,
    benefitType: false,
    residence: false,
    maritalStatus: false,
    employment: false,
    occupation: false
  });
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [currentSpeaking, setCurrentSpeaking] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [currentScheme, setCurrentScheme] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // Fetch data from gov.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/gov.json');
        if (!response.ok) {
          throw new Error('Failed to fetch schemes data');
        }
        const data = await response.json();
        setSchemesData(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Clean up speech on component unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  // Function to load more schemes from different files
  const loadMoreSchemes = async () => {
    setLoadingMore(true);
    try {
      let fileName = '';
      if (loadMoreCount === 0) {
        fileName = '/schemes_data.json';
      } else if (loadMoreCount === 1) {
        fileName = '/schemes_data3.json';
      } else {
        setLoadingMore(false);
        return;
      }

      const response = await fetch(fileName);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}`);
      }
      const data = await response.json();
      
      // Add new schemes to additional schemes array
      setAdditionalSchemes(prev => [...prev, ...data.items]);
      setLoadMoreCount(prev => prev + 1);
      setLoadingMore(false);
    } catch (err) {
      console.error('Error loading more schemes:', err);
      setLoadingMore(false);
    }
  };

  // Filter schemes (combine original and additional schemes)
  const filteredSchemes = useMemo(() => {
    let allSchemes = [];
    
    // Add original schemes from gov.json
    if (schemesData?.hits?.items) {
      allSchemes = [...schemesData.hits.items];
    }
    
    // Add additional schemes from other JSON files
    if (additionalSchemes.length > 0) {
      allSchemes = [...allSchemes, ...additionalSchemes];
    }

    let filtered = allSchemes.filter(scheme => {
      const matchesSearch = searchTerm === '' || 
        scheme.fields.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.fields.briefDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.fields.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || 
        scheme.fields.schemeCategory?.includes(selectedCategory);
      
      const matchesState = selectedState === '' || selectedState === 'All' ||
        scheme.fields.beneficiaryState?.includes(selectedState);
      
      const matchesLevel = selectedLevel === 'All Schemes' ||
        (selectedLevel === 'Central Schemes' && scheme.fields.level === 'Central') ||
        (selectedLevel === 'State Schemes' && scheme.fields.level === 'State');

      return matchesSearch && matchesCategory && matchesState && matchesLevel;
    });

    return filtered;
  }, [schemesData, additionalSchemes, searchTerm, selectedCategory, selectedState, selectedLevel]);

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedState('');
    setSelectedLevel('All Schemes');
    setSelectedGender('');
    setSelectedCaste('');
    setSelectedBenefitType('');
    setSelectedMinority('');
    setSelectedDisability('');
    setSelectedBpl('');
    setSelectedEmployment('');
    setSearchTerm('');
  };

  const handleApplyNow = (slug) => {
    window.open(`https://www.myscheme.gov.in/schemes/${slug}`, '_blank');
  };

  const handleReadAloud = (scheme) => {
    if (!speechSynthesis) {
      alert('Speech synthesis not supported in this browser');
      return;
    }

    // If currently speaking this scheme, stop it
    if (currentSpeaking === scheme.id && isSpeaking) {
      speechSynthesis.cancel();
      setCurrentSpeaking(null);
      setIsSpeaking(false);
      return;
    }

    // If speaking something else, stop it first
    if (isSpeaking) {
      speechSynthesis.cancel();
    }

    // Create text to read
    const textToRead = `
      Scheme Name: ${scheme.fields.schemeName}.
      Ministry: ${scheme.fields.nodalMinistryName}.
      State: ${scheme.fields.beneficiaryState?.[0] || 'All States'}.
      Level: ${scheme.fields.level}.
      Description: ${scheme.fields.briefDescription}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setCurrentSpeaking(scheme.id);
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setCurrentSpeaking(null);
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setCurrentSpeaking(null);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const generateAIRoadmap = async (scheme) => {
    setCurrentScheme(scheme);
    setShowRoadmapModal(true);
    setLoadingRoadmap(true);
    
    try {
      const prompt = `Create a detailed roadmap for the government scheme "${scheme.fields.schemeName}". 
      
      Scheme Description: ${scheme.fields.briefDescription}
      Ministry: ${scheme.fields.nodalMinistryName}
      Level: ${scheme.fields.level}
      State: ${scheme.fields.beneficiaryState?.[0] || 'All States'}
      
      Based on this scheme, provide:
      1. Skills required to benefit from or work with this scheme (4-6 specific skills)
      2. Step-by-step roadmap to develop these skills (3 phases: Foundation, Intermediate, Advanced with duration and specific skills for each phase)
      3. Career opportunities after mastering these skills (4-5 specific job roles)
      4. Comprehensive learning resources organized as:
         - Free Resources: YouTube channels, free platforms, documentation
         - Premium Resources: Paid courses, bootcamps, certifications
         - Books & References: Essential books, official documentation
         - Practice Platforms: Coding challenges, project ideas, communities
      
      Current user skills (assume basic level): Frontend Development (HTML, CSS, JavaScript, React)
      
      Make sure to provide specific, actionable, and relevant resources for this particular scheme. Don't give generic resources - tailor everything to this specific government scheme and its requirements.
      
      Format the response clearly with sections and detailed explanations.`;

      // Direct Gemini API call
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const roadmapText = response.text();

      // Parse the AI response
      const roadmap = parseAIResponse(roadmapText, scheme.fields.schemeName);
      setRoadmapData(roadmap);
      setLoadingRoadmap(false);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      // Fallback roadmap data
      const fallbackRoadmap = generateFallbackRoadmap(scheme);
      setRoadmapData(fallbackRoadmap);
      setLoadingRoadmap(false);
    }
  };

  const generateFallbackRoadmap = (scheme) => {
    const schemeCategory = scheme.fields.schemeCategory?.[0] || '';
    const schemeName = scheme.fields.schemeName;
    
    // Generate skills based on scheme type
    let requiredSkills = [];
    let careerPaths = [];
    let timeline = [];
    
    if (schemeCategory.includes('Education') || schemeName.includes('Education') || schemeName.includes('Skill')) {
      requiredSkills = [
        'Digital Literacy',
        'Communication Skills',
        'Project Management',
        'Data Analysis',
        'Online Learning Platforms'
      ];
      careerPaths = [
        'Educational Technology Specialist',
        'Training Coordinator',
        'Academic Consultant',
        'E-learning Developer'
      ];
      timeline = [
        { phase: 'Foundation', duration: '2-3 months', skills: ['Digital Literacy', 'Basic Communication'] },
        { phase: 'Intermediate', duration: '3-4 months', skills: ['Project Management', 'Data Analysis'] },
        { phase: 'Advanced', duration: '4-6 months', skills: ['E-learning Development', 'Training Design'] }
      ];
    } else if (schemeCategory.includes('Health') || schemeName.includes('Health')) {
      requiredSkills = [
        'Healthcare Management',
        'Medical Records Systems',
        'Patient Care Coordination',
        'Health Data Analysis',
        'Digital Health Tools'
      ];
      careerPaths = [
        'Healthcare Administrator',
        'Health Data Analyst',
        'Medical Records Specialist',
        'Public Health Coordinator'
      ];
      timeline = [
        { phase: 'Foundation', duration: '3-4 months', skills: ['Healthcare Basics', 'Medical Terminology'] },
        { phase: 'Intermediate', duration: '4-5 months', skills: ['Healthcare Management', 'Data Systems'] },
        { phase: 'Advanced', duration: '5-7 months', skills: ['Health Analytics', 'Policy Implementation'] }
      ];
    } else if (schemeCategory.includes('Agriculture') || schemeName.includes('Agriculture')) {
      requiredSkills = [
        'Agricultural Technology',
        'Farm Management Systems',
        'Crop Analysis',
        'Supply Chain Management',
        'Digital Marketing for Agriculture'
      ];
      careerPaths = [
        'Agricultural Technology Specialist',
        'Farm Management Consultant',
        'Agricultural Data Analyst',
        'Agri-business Developer'
      ];
      timeline = [
        { phase: 'Foundation', duration: '2-3 months', skills: ['Agricultural Basics', 'Technology Adoption'] },
        { phase: 'Intermediate', duration: '3-4 months', skills: ['Farm Management', 'Data Collection'] },
        { phase: 'Advanced', duration: '4-6 months', skills: ['Advanced Analytics', 'Business Development'] }
      ];
    } else {
      // General scheme roadmap
      requiredSkills = [
        'Government Portal Navigation',
        'Documentation Management',
        'Digital Application Process',
        'Compliance Understanding',
        'Beneficiary Support'
      ];
      careerPaths = [
        'Government Liaison Officer',
        'Scheme Implementation Specialist',
        'Public Service Coordinator',
        'Community Outreach Manager'
      ];
      timeline = [
        { phase: 'Foundation', duration: '1-2 months', skills: ['Portal Navigation', 'Basic Documentation'] },
        { phase: 'Intermediate', duration: '2-3 months', skills: ['Application Process', 'Compliance'] },
        { phase: 'Advanced', duration: '3-4 months', skills: ['Implementation', 'Community Support'] }
      ];
    }

    return {
      schemeName: schemeName,
      requiredSkills,
      timeline,
      careerPaths,
      resources: {
        free: { youtube: ['CodeWithHarry', 'Apna College'], platforms: ['FreeCodeCamp.org', 'Khan Academy'] },
        premium: { courses: ['Udemy Courses', 'Coursera'], bootcamps: ['The Odin Project'] },
        books: { essential: ['JavaScript Guide'], documentation: ['MDN Docs'] },
        practice: { coding: ['LeetCode'], projects: ['Portfolio'], communities: ['Stack Overflow'] }
      }
    };
  };

  // Function to parse AI response into structured format
  const parseAIResponse = (text, schemeName) => {
    try {
      const skillsMatch = text.match(/(?:Required Skills|Skills Required|Key Skills)[:\n]([\s\S]*?)(?=\n(?:Learning Timeline|Timeline|Career|Resources)|$)/i);
      const timelineMatch = text.match(/(?:Learning Timeline|Timeline|Phases)[:\n]([\s\S]*?)(?=\n(?:Career|Resources|Opportunities)|$)/i);
      const careerMatch = text.match(/(?:Career Opportunities|Career Paths|Job Roles)[:\n]([\s\S]*?)(?=\n(?:Resources|Learning Resources)|$)/i);
      const resourcesMatch = text.match(/(?:Learning Resources|Resources|Platforms)[:\n]([\s\S]*?)$/i);

      // Parse skills
      const requiredSkills = skillsMatch 
        ? skillsMatch[1].split(/\n/).filter(line => line.trim()).map(skill => 
            skill.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
          ).filter(skill => skill.length > 0).slice(0, 6)
        : ['Digital Literacy', 'Communication Skills', 'Project Management', 'Data Analysis'];

      // Parse timeline
      let timeline = [];
      if (timelineMatch) {
        const timelineText = timelineMatch[1];
        const phases = timelineText.split(/(?=Foundation|Intermediate|Advanced|Phase \d)/i);
        
        phases.forEach(phase => {
          if (phase.trim()) {
            const phaseMatch = phase.match(/(Foundation|Intermediate|Advanced|Phase \d)[:\s]*([^:]*?)(?:Duration[:\s]*([^:]*?))?(?:Skills[:\s]*([\s\S]*?))?$/i);
            if (phaseMatch) {
              const phaseName = phaseMatch[1];
              const duration = phaseMatch[3] || '2-3 months';
              const skills = phaseMatch[4] 
                ? phaseMatch[4].split(/\n/).filter(line => line.trim()).map(skill => 
                    skill.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
                  ).filter(skill => skill.length > 0).slice(0, 3)
                : ['Basic Skills'];
              
              timeline.push({
                phase: phaseName,
                duration: duration.trim(),
                skills: skills
              });
            }
          }
        });
      }

      if (timeline.length === 0) {
        timeline = [
          { phase: 'Foundation', duration: '2-3 months', skills: ['Basic Understanding', 'Core Concepts'] },
          { phase: 'Intermediate', duration: '3-4 months', skills: ['Practical Application', 'Advanced Concepts'] },
          { phase: 'Advanced', duration: '4-6 months', skills: ['Expert Level', 'Implementation'] }
        ];
      }

      const careerPaths = careerMatch
        ? careerMatch[1].split(/\n/).filter(line => line.trim()).map(career => 
            career.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
          ).filter(career => career.length > 0).slice(0, 5)
        : ['Specialist', 'Coordinator', 'Analyst', 'Consultant'];

      // Parse resources dynamically from AI response
      let resources = {
        free: {
          youtube: [],
          platforms: []
        },
        premium: {
          courses: [],
          bootcamps: []
        },
        books: {
          essential: [],
          documentation: []
        },
        practice: {
          coding: [],
          projects: [],
          communities: []
        }
      };

      if (resourcesMatch) {
        const resourceText = resourcesMatch[1];
        
        // Extract different resource categories using flexible patterns
        const freeResourcesMatch = resourceText.match(/(?:Free Resources|Free|YouTube|Free Platforms)[:\n]([\s\S]*?)(?=Premium|Paid|Books|Practice|$)/i);
        const premiumResourcesMatch = resourceText.match(/(?:Premium Resources|Premium|Paid|Courses|Bootcamps)[:\n]([\s\S]*?)(?=Books|Practice|Free|$)/i);
        const booksMatch = resourceText.match(/(?:Books|Documentation|References)[:\n]([\s\S]*?)(?=Practice|Free|Premium|$)/i);
        const practiceMatch = resourceText.match(/(?:Practice|Projects|Communities|Coding)[:\n]([\s\S]*?)$/i);

        // Parse free resources
        if (freeResourcesMatch) {
          const freeText = freeResourcesMatch[1];
          const youtubeMatches = freeText.match(/YouTube[:\s]*([\s\S]*?)(?=Platforms|Free Platforms|$)/i);
          const platformMatches = freeText.match(/(?:Platforms|Free Platforms)[:\s]*([\s\S]*?)$/i);
          
          if (youtubeMatches) {
            resources.free.youtube = youtubeMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
          
          if (platformMatches) {
            resources.free.platforms = platformMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
        }

        // Parse premium resources
        if (premiumResourcesMatch) {
          const premiumText = premiumResourcesMatch[1];
          const courseMatches = premiumText.match(/(?:Courses|Online Courses)[:\s]*([\s\S]*?)(?=Bootcamps|$)/i);
          const bootcampMatches = premiumText.match(/Bootcamps[:\s]*([\s\S]*?)$/i);
          
          if (courseMatches) {
            resources.premium.courses = courseMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
          
          if (bootcampMatches) {
            resources.premium.bootcamps = bootcampMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
        }

        // Parse books and documentation
        if (booksMatch) {
          const booksText = booksMatch[1];
          const essentialMatches = booksText.match(/(?:Essential|Books)[:\s]*([\s\S]*?)(?=Documentation|Official|$)/i);
          const docMatches = booksText.match(/(?:Documentation|Official)[:\s]*([\s\S]*?)$/i);
          
          if (essentialMatches) {
            resources.books.essential = essentialMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
          
          if (docMatches) {
            resources.books.documentation = docMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
        }

        // Parse practice resources
        if (practiceMatch) {
          const practiceText = practiceMatch[1];
          const codingMatches = practiceText.match(/(?:Coding|Practice)[:\s]*([\s\S]*?)(?=Projects|Communities|$)/i);
          const projectMatches = practiceText.match(/Projects[:\s]*([\s\S]*?)(?=Communities|$)/i);
          const communityMatches = practiceText.match(/Communities[:\s]*([\s\S]*?)$/i);
          
          if (codingMatches) {
            resources.practice.coding = codingMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
          
          if (projectMatches) {
            resources.practice.projects = projectMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
          
          if (communityMatches) {
            resources.practice.communities = communityMatches[1].split(/\n/).filter(line => line.trim()).map(item => 
              item.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()
            ).filter(item => item.length > 0).slice(0, 4);
          }
        }
      }

      // Fallback resources if parsing fails
      if (!resources.free.youtube.length) {
        resources.free.youtube = ['CodeWithHarry', 'Apna College', 'FreeCodeCamp', 'Traversy Media'];
      }
      if (!resources.free.platforms.length) {
        resources.free.platforms = ['FreeCodeCamp.org', 'Codecademy Free', 'Khan Academy', 'MDN Web Docs'];
      }
      if (!resources.premium.courses.length) {
        resources.premium.courses = ['Udemy Courses', 'Coursera Specializations', 'edX Certificates', 'Pluralsight'];
      }
      if (!resources.premium.bootcamps.length) {
        resources.premium.bootcamps = ['The Odin Project', 'Lambda School', 'General Assembly', 'Flatiron School'];
      }

      return {
        schemeName,
        requiredSkills,
        timeline,
        careerPaths,
        resources
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        schemeName,
        requiredSkills: ['Digital Literacy', 'Communication Skills', 'Project Management', 'Data Analysis'],
        timeline: [
          { phase: 'Foundation', duration: '2-3 months', skills: ['Basic Understanding'] },
          { phase: 'Intermediate', duration: '3-4 months', skills: ['Practical Application'] },
          { phase: 'Advanced', duration: '4-6 months', skills: ['Expert Level'] }
        ],
        careerPaths: ['Specialist', 'Coordinator', 'Analyst', 'Consultant'],
        resources: {
          free: { youtube: ['CodeWithHarry', 'Apna College'], platforms: ['FreeCodeCamp.org', 'Khan Academy'] },
          premium: { courses: ['Udemy Courses', 'Coursera'], bootcamps: ['The Odin Project'] },
          books: { essential: ['JavaScript Guide'], documentation: ['MDN Docs'] },
          practice: { coding: ['LeetCode'], projects: ['Portfolio'], communities: ['Stack Overflow'] }
        }
      };
    }
  };

  // Download roadmap as PDF/Text
  const downloadRoadmap = () => {
    if (!roadmapData || !currentScheme) return;

    const roadmapContent = `🎯 AI GENERATED ROADMAP
Scheme: ${roadmapData.schemeName}
Ministry: ${currentScheme.fields.nodalMinistryName}
Level: ${currentScheme.fields.level}
Generated on: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 REQUIRED SKILLS
${roadmapData.requiredSkills.map((skill, i) => `${i + 1}. ${skill}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ DETAILED LEARNING TIMELINE

${roadmapData.timeline.map((phase, i) => `
📍 ${phase.phase} Phase (${phase.duration})
Skills to Master:
${phase.skills.map(skill => `  • ${skill}`).join('\n')}

Weekly Study Plan:
  • Week 1-2: Theory and fundamentals
  • Week 3-4: Practical exercises and projects
  • Week 5-6: Real-world applications
  • Week 7-8: Assessment and skill consolidation

Key Milestones:
  ✅ Complete Basics
  ✅ Build Project
  ✅ Get Certified
`).join('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 CAREER OPPORTUNITIES
${roadmapData.careerPaths.map((career, i) => `${i + 1}. ${career}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 AI-GENERATED LEARNING RESOURCES

🆓 FREE RESOURCES:
YouTube Channels:
${roadmapData.resources?.free?.youtube?.map(channel => `  • ${channel}`).join('\n') || '  • No specific channels recommended'}

Free Platforms:
${roadmapData.resources?.free?.platforms?.map(platform => `  • ${platform}`).join('\n') || '  • No specific platforms recommended'}

💰 PREMIUM RESOURCES:
Online Courses:
${roadmapData.resources?.premium?.courses?.map(course => `  • ${course}`).join('\n') || '  • No specific courses recommended'}

Coding Bootcamps:
${roadmapData.resources?.premium?.bootcamps?.map(bootcamp => `  • ${bootcamp}`).join('\n') || '  • No specific bootcamps recommended'}

📖 BOOKS & DOCUMENTATION:
Essential Books:
${roadmapData.resources?.books?.essential?.map(book => `  • ${book}`).join('\n') || '  • No specific books recommended'}

Official Documentation:
${roadmapData.resources?.books?.documentation?.map(doc => `  • ${doc}`).join('\n') || '  • No specific documentation recommended'}

🚀 PRACTICE & PROJECTS:
Coding Practice:
${roadmapData.resources?.practice?.coding?.map(platform => `  • ${platform}`).join('\n') || '  • No specific platforms recommended'}

Project Ideas:
${roadmapData.resources?.practice?.projects?.map(project => `  • ${project}`).join('\n') || '  • No specific projects recommended'}

Communities:
${roadmapData.resources?.practice?.communities?.map(community => `  • ${community}`).join('\n') || '  • No specific communities recommended'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Generated by AI Roadmap Generator
📄 Save this roadmap and start your learning journey today!
🎯 Good luck with your skill development!

`;

    // Create and download file
    const element = document.createElement('a');
    const file = new Blob([roadmapContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${roadmapData.schemeName.replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Share roadmap
  const shareRoadmap = async () => {
    if (!roadmapData) return;

    const shareText = `🎯 Check out this AI-generated learning roadmap for ${roadmapData.schemeName}!\n\n📚 Skills: ${roadmapData.requiredSkills.slice(0, 3).join(', ')}...\n⏰ Timeline: ${roadmapData.timeline.length} phases\n🚀 Career paths included!\n\n#LearningRoadmap #SkillDevelopment #GovernmentSchemes`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Learning Roadmap - ${roadmapData.schemeName}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Roadmap details copied to clipboard!');
      } catch (error) {
        console.log('Copy failed');
      }
    }
  };

  const closeRoadmapModal = () => {
    setShowRoadmapModal(false);
    setCurrentScheme(null);
    setRoadmapData(null);
    setLoadingRoadmap(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center" data-theme={theme}>
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content text-lg">Loading Government Schemes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center" data-theme={theme}>
        <div className="alert alert-error max-w-md">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200" style={{ fontSize: `${fontSize}px` }} data-theme={theme}>
      <div className="max-w-full mx-auto px-6 py-6 flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-80 card bg-base-100 shadow-xl h-fit sticky top-6">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-base-content">Filter By</h2>
              <button 
                onClick={resetFilters}
                className="btn btn-link btn-sm text-primary p-0"
              >
                Reset Filters
              </button>
            </div>

            {/* State Filter */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-medium">State</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select State</option>
                {schemesData?.facets?.find(f => f.identifier === 'beneficiaryState')?.entries?.map(entry => (
                  <option key={entry.label} value={entry.label}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheme Category Filter */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilter('schemeCategory')}
                className="btn btn-ghost btn-sm justify-between w-full p-0"
              >
                <span className="label-text font-medium">Scheme Category</span>
                {expandedFilters.schemeCategory ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {expandedFilters.schemeCategory && (
                <div className="space-y-2 max-h-48 overflow-y-auto mt-2">
                  {schemesData?.facets?.find(f => f.identifier === 'schemeCategory')?.entries?.map(entry => (
                    <label key={entry.label} className="label cursor-pointer justify-start">
                      <input
                        type="radio"
                        name="category"
                        value={entry.label}
                        checked={selectedCategory === entry.label}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="radio radio-primary radio-sm mr-2"
                      />
                      <span className="label-text text-sm">
                        {entry.label} 
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilter('gender')}
                className="btn btn-ghost btn-sm justify-between w-full p-0"
              >
                <span className="label-text font-medium">Gender</span>
                {expandedFilters.gender ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {expandedFilters.gender && (
                <div className="space-y-2 mt-2">
                  {schemesData?.facets?.find(f => f.identifier === 'gender')?.entries?.map(entry => (
                    <label key={entry.label} className="label cursor-pointer justify-start">
                      <input
                        type="radio"
                        name="gender"
                        value={entry.label}
                        checked={selectedGender === entry.label}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="radio radio-primary radio-sm mr-2"
                      />
                      <span className="label-text text-sm">
                        {entry.label} ({entry.count})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Caste Filter */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilter('caste')}
                className="btn btn-ghost btn-sm justify-between w-full p-0"
              >
                <span className="label-text font-medium">Caste</span>
                {expandedFilters.caste ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {expandedFilters.caste && (
                <div className="space-y-2 mt-2">
                  {schemesData?.facets?.find(f => f.identifier === 'caste')?.entries?.map(entry => (
                    <label key={entry.label} className="label cursor-pointer justify-start">
                      <input
                        type="radio"
                        name="caste"
                        value={entry.label}
                        checked={selectedCaste === entry.label}
                        onChange={(e) => setSelectedCaste(e.target.value)}
                        className="radio radio-primary radio-sm mr-2"
                      />
                      <span className="label-text text-sm">
                        {entry.label} ({entry.count})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Special Checkboxes */}
            <div className="space-y-4">
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  checked={selectedMinority === 'Yes'}
                  onChange={(e) => setSelectedMinority(e.target.checked ? 'Yes' : '')}
                  className="checkbox checkbox-primary checkbox-sm mr-2"
                />
                <span className="label-text text-sm">
                  Minority (68)
                </span>
              </label>
              
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  checked={selectedDisability === 'Yes'}
                  onChange={(e) => setSelectedDisability(e.target.checked ? 'Yes' : '')}
                  className="checkbox checkbox-primary checkbox-sm mr-2"
                />
                <span className="label-text text-sm">
                  Differently Abled (295)
                </span>
              </label>

              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  checked={selectedBpl === 'Yes'}
                  onChange={(e) => setSelectedBpl(e.target.checked ? 'Yes' : '')}
                  className="checkbox checkbox-primary checkbox-sm mr-2"
                />
                <span className="label-text text-sm">
                  Below Poverty Line (160)
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search and Tabs */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body p-6 border-b border-base-300">
              <div className="form-control">
                <div className="input-group relative">
                 <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder='For an exact match, put the words in quotes. For example: "Scheme Name".'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-bordered">
              {['All Schemes', 'State Schemes', 'Central Schemes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedLevel(tab)}
                  className={`tab tab-bordered ${
                    selectedLevel === tab ? 'tab-active' : ''
                  }`}
                >
                   &nbsp;&nbsp;   {tab}     &nbsp;&nbsp;
                </button>
              ))}
            </div>
          </div>

          {/* Schemes List */}
          <div className="space-y-6">
            {filteredSchemes.slice(0, itemsToShow).map((scheme) => (
              <div key={scheme.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <h3 className="card-title text-lg hover:text-primary cursor-pointer">
                    {scheme.fields.schemeName} 
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm opacity-70 mb-3">
                    <div className="flex items-center gap-1">
                      <Building size={14} />
                      <span>{scheme.fields.nodalMinistryName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{scheme.fields.beneficiaryState?.[0] || 'All States'}</span>
                    </div>
                    <div className={`badge ${
                      scheme.fields.level === 'Central' 
                        ? 'badge-info' 
                        : 'badge-success'
                    }`}>
                      {scheme.fields.level}
                    </div>
                  </div>

                  <p className="text-base-content/80 mb-4 leading-relaxed">
                    {scheme.fields.briefDescription}
                  </p>

                  {/* Tags */}
                  {scheme.fields.tags && scheme.fields.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scheme.fields.tags.slice(0, 8).map((tag, index) => (
                        <div key={index} className="badge badge-outline badge-sm">
                          {tag}
                        </div>
                      ))}
                      {scheme.fields.tags.length > 8 && (
                        <span className="text-xs opacity-60">
                          +{scheme.fields.tags.length - 8} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="card-actions justify-start">
                    <button
                      onClick={() => handleApplyNow(scheme.fields.slug)}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                      <ExternalLink size={14} />
                    </button>
                    <button 
                      onClick={() => generateAIRoadmap(scheme)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Sparkles size={14} />
                      AI Roadmap
                    </button>
                    <button
                      onClick={() => handleReadAloud(scheme)}
                      className={`btn btn-outline btn-sm ${
                        currentSpeaking === scheme.id && isSpeaking 
                          ? 'btn-error' 
                          : 'btn-info'
                      }`}
                      disabled={!speechSynthesis}
                      title={
                        currentSpeaking === scheme.id && isSpeaking 
                          ? 'Stop Reading' 
                          : 'Read Aloud'
                      }
                    >
                      {currentSpeaking === scheme.id && isSpeaking ? (
                        <>
                          <VolumeX size={14} />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} />
                          Read Aloud
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {(itemsToShow < filteredSchemes.length || loadMoreCount < 2) && (
            <div className="text-center mt-8">
              {itemsToShow >= filteredSchemes.length && loadMoreCount < 2 ? (
                <button
                  onClick={loadMoreSchemes}
                  disabled={loadingMore}
                  className="btn btn-primary btn-lg"
                >
                  {loadingMore ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Loading More Schemes...
                    </>
                  ) : (
                    'Load More Schemes'
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setItemsToShow(prev => prev + 10)}
                  className="btn btn-outline btn-primary btn-lg"
                >
                  View More Schemes 
                </button>
              )}
            </div>
          )}

          {/* No Results */}
          {filteredSchemes.length === 0 && (
            <div className="hero bg-base-100 rounded-lg py-12">
              <div className="hero-content text-center">
                <div>
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">No schemes found</h3>
                  <p className="opacity-70">Try adjusting your search criteria or filters</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI Roadmap Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-base-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary" size={24} />
                <h2 className="text-xl font-bold">AI Generated Roadmap</h2>
              </div>
              <button
                onClick={closeRoadmapModal}
                className="btn btn-ghost btn-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingRoadmap ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-lg">Generating AI Roadmap...</p>
                    <p className="text-sm opacity-70">Analyzing scheme requirements and creating personalized roadmap</p>
                  </div>
                </div>
              ) : roadmapData ? (
                <div className="space-y-8">
                  {/* Scheme Info */}
                  <div className="alert alert-info">
                    <Sparkles size={20} />
                    <div>
                      <h3 className="font-bold">Roadmap for: {roadmapData.schemeName}</h3>
                      <p className="text-sm opacity-70">Based on your current skills: Frontend Development (HTML, CSS, JavaScript, React)</p>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title flex items-center gap-2">
                        <Target className="text-primary" size={20} />
                        Required Skills
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {roadmapData.requiredSkills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-base-100 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="font-medium">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Learning Timeline */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title flex items-center gap-2">
                        <Clock className="text-secondary" size={20} />
                        Detailed Learning Timeline
                      </h4>
                      <div className="space-y-6">
                        {roadmapData.timeline.map((phase, index) => (
                          <div key={index} className="relative">
                            <div className="flex items-start gap-4 p-6 bg-base-100 rounded-lg border-l-4 border-secondary">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-secondary text-secondary-content rounded-full flex items-center justify-center font-bold text-lg">
                                  {index + 1}
                                </div>
                                {index < roadmapData.timeline.length - 1 && (
                                  <div className="w-0.5 h-12 bg-secondary/30 mt-4"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-bold text-xl text-secondary">{phase.phase} Phase</h5>
                                  <div className="badge badge-secondary badge-lg">{phase.duration}</div>
                                </div>
                                <div className="mb-4">
                                  <h6 className="font-semibold mb-2 text-base-content/80">Skills to Master:</h6>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {phase.skills.map((skill, skillIndex) => (
                                      <div key={skillIndex} className="flex items-center gap-2 p-2 bg-base-200 rounded">
                                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                        <span className="text-sm font-medium">{skill}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Weekly Breakdown */}
                                <div className="bg-base-200 p-4 rounded-lg">
                                  <h6 className="font-semibold mb-2 text-sm">Weekly Study Plan:</h6>
                                  <div className="text-xs space-y-1 opacity-80">
                                    <p>• Week 1-2: Theory and fundamentals</p>
                                    <p>• Week 3-4: Practical exercises and projects</p>
                                    <p>• Week 5-6: Real-world applications</p>
                                    <p>• Week 7-8: Assessment and skill consolidation</p>
                                  </div>
                                </div>
                                
                                {/* Milestones */}
                                <div className="mt-4">
                                  <h6 className="font-semibold mb-2 text-sm">Key Milestones:</h6>
                                  <div className="flex flex-wrap gap-2">
                                    <span className="badge badge-outline badge-sm">Complete Basics</span>
                                    <span className="badge badge-outline badge-sm">Build Project</span>
                                    <span className="badge badge-outline badge-sm">Get Certified</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Career Opportunities */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title flex items-center gap-2">
                        <TrendingUp className="text-success" size={20} />
                        Career Opportunities
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {roadmapData.careerPaths.map((career, index) => (
                          <div key={index} className="p-4 bg-base-100 rounded-lg border-l-4 border-success">
                            <h5 className="font-semibold text-success">{career}</h5>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Learning Resources */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title flex items-center gap-2">
                        <BookOpen className="text-info" size={20} />
                        AI-Generated Learning Resources
                      </h4>
                      
                      {/* Free Resources */}
                      <div className="mb-6">
                        <h5 className="font-bold text-lg mb-3 text-success">Free Resources</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-success">
                            <h6 className="font-semibold text-success mb-2">YouTube Channels</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.free?.youtube?.map((channel, index) => (
                                <li key={index}>• {channel}</li>
                              )) || <li>• No specific channels found</li>}
                            </ul>
                          </div>
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-success">
                            <h6 className="font-semibold text-success mb-2">Free Platforms</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.free?.platforms?.map((platform, index) => (
                                <li key={index}>• {platform}</li>
                              )) || <li>• No specific platforms found</li>}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Premium Resources */}
                      <div className="mb-6">
                        <h5 className="font-bold text-lg mb-3 text-warning">Premium Resources</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-warning">
                            <h6 className="font-semibold text-warning mb-2">Online Courses</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.premium?.courses?.map((course, index) => (
                                <li key={index}>• {course}</li>
                              )) || <li>• No specific courses found</li>}
                            </ul>
                          </div>
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-warning">
                            <h6 className="font-semibold text-warning mb-2">Coding Bootcamps</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.premium?.bootcamps?.map((bootcamp, index) => (
                                <li key={index}>• {bootcamp}</li>
                              )) || <li>• No specific bootcamps found</li>}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Books & Documentation */}
                      <div className="mb-6">
                        <h5 className="font-bold text-lg mb-3 text-info">Books & Documentation</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-info">
                            <h6 className="font-semibold text-info mb-2">Essential Books</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.books?.essential?.map((book, index) => (
                                <li key={index}>• {book}</li>
                              )) || <li>• No specific books found</li>}
                            </ul>
                          </div>
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-info">
                            <h6 className="font-semibold text-info mb-2">Official Documentation</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.books?.documentation?.map((doc, index) => (
                                <li key={index}>• {doc}</li>
                              )) || <li>• No specific documentation found</li>}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Practice Platforms */}
                      <div>
                        <h5 className="font-bold text-lg mb-3 text-secondary">Practice & Projects</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-secondary">
                            <h6 className="font-semibold text-secondary mb-2">Coding Practice</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.practice?.coding?.map((platform, index) => (
                                <li key={index}>• {platform}</li>
                              )) || (
                                <>
                                  <li>• LeetCode</li>
                                  <li>• HackerRank</li>
                                  <li>• Codepen</li>
                                  <li>• JSFiddle</li>
                                </>
                              )}
                            </ul>
                          </div>
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-secondary">
                            <h6 className="font-semibold text-secondary mb-2">Project Ideas</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.practice?.projects?.map((project, index) => (
                                <li key={index}>• {project}</li>
                              )) || (
                                <>
                                  <li>• Government Portal Clone</li>
                                  <li>• Scheme Tracker App</li>
                                  <li>• Document Manager</li>
                                  <li>• Citizen Services Portal</li>
                                </>
                              )}
                            </ul>
                          </div>
                          <div className="p-4 bg-base-100 rounded-lg border-l-4 border-secondary">
                            <h6 className="font-semibold text-secondary mb-2">Communities</h6>
                            <ul className="text-sm space-y-1">
                              {roadmapData.resources?.practice?.communities?.map((community, index) => (
                                <li key={index}>• {community}</li>
                              )) || (
                                <>
                                  <li>• Stack Overflow</li>
                                  <li>• Dev.to Community</li>
                                  <li>• Reddit r/webdev</li>
                                  <li>• Discord Dev Servers</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-base-300">
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button 
                        onClick={downloadRoadmap}
                        className="btn btn-primary btn-lg"
                      >
                        <Download size={18} />
                        Download Roadmap
                      </button>
                      
                      <button 
                        onClick={shareRoadmap}
                        className="btn btn-secondary btn-lg"
                      >
                        <Share2 size={18} />
                        Share Roadmap
                      </button>
                      
                      <button 
                        onClick={() => handleApplyNow(currentScheme?.fields?.slug)}
                        className="btn btn-accent btn-lg"
                      >
                        <ExternalLink size={18} />
                        View Scheme Details
                      </button>
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        onClick={closeRoadmapModal}
                        className="btn btn-outline btn-lg"
                      >
                        <X size={18} />
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">❌</div>
                  <h3 className="text-lg font-medium mb-2">Failed to generate roadmap</h3>
                  <p className="opacity-70 mb-4">Please try again later</p>
                  <button 
                    onClick={closeRoadmapModal}
                    className="btn btn-primary"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Animated Elements with theme colors */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
    </div>
  );
};

export default GovernmentSchemesPortal;
