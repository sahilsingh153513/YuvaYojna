'use client'

import { useState, useEffect } from 'react';
import { 
  Search, 
  Building, 
  MapPin, 
  ExternalLink, 
  Volume2, 
  Route,
  Eye,
  BookOpen,
  GraduationCap,
  Award,
  Heart,
  Home,
  Scale,
  Atom,
  TrendingUp,
  Trophy,
  Bus,
  Globe,
  Wrench,
  Baby,
  Users
} from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useVoiceControl } from '@/context/VoiceControlContext';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

export default function SchemeDetailsPage() {
  const { theme } = useDaisyTheme();
  const { speak, processVoiceCommand } = useVoiceControl();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const schemes = [
    {
      id: 1,
      title: "Sarva Shiksha Abhiyan",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "Sarva Shiksha Abhiyan (SSA) is a flagship programme of the Government of India launched in 2001 with the aim of achieving universal elementary education. It seeks to provide free and compulsory education to all children between the ages of 6 and 14, in line with the 86th Constitutional Amendment and the Right to Education Act (2009). The scheme focuses on bridging social, regional, and gender gaps in education, while also improving the quality of learning through teacher training, curriculum reforms, and child-centered pedagogy.",
      tags: ["Elementary Education", "Universal", "Free Education", "RTE", "SSA"],
      source: "https://www.india.gov.in/official-website-sarva-shiksha-abhiyan-0",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Beti Bachao Beti Padhao",
      ministry: "Ministry of Women and Child Development",
      location: "All",
      type: "Central",
      description: "Beti Bachao Beti Padhao (BBBP) is a national campaign launched by the Government of India in 2015 to address the declining Child Sex Ratio (CSR) and promote the survival, protection, and education of the girl child. Implemented jointly by the Ministry of Women and Child Development, Ministry of Health and Family Welfare, and Ministry of Education, the scheme works through multi-sectoral interventions at the community, district, and state levels.",
      tags: ["Girl Child", "Education", "Gender Equality", "Awareness", "BBBP"],
      source: "https://wcd.gov.in/women/beti-bachao-beti-padhao",
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 3,
      title: "CBSE UDAAN",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "CBSE UDAAN is an initiative launched by the Central Board of Secondary Education (CBSE) under the guidance of the Ministry of Education, Government of India. The scheme is designed to support meritorious girls from economically disadvantaged backgrounds who aspire to pursue higher education in engineering and technical fields. UDAAN focuses on bridging the gender gap in technical education by providing academic support, mentoring, and resources to selected students.",
      tags: ["Girls Education", "Engineering", "Technical", "Mentoring", "STEM"],
      source: "https://popularschemes.com/cbse-udaan-scheme",
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Inclusive Education for Disabled Children (IEDC)",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The Inclusive Education for Disabled Children (IEDC) scheme is an initiative of the Government of India aimed at ensuring that children with disabilities have equal access to quality education. Implemented through the Department of School Education and Literacy, it focuses on integrating children with special needs into mainstream schools while also providing specialized support services.",
      tags: ["Inclusive Education", "Disabled Children", "Special Needs", "Accessibility", "IEDC"],
      source: "https://dsel.education.gov.in/",
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 5,
      title: "National Scholarships Portal",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The National Scholarships Portal (NSP) is a one-stop digital platform launched by the Government of India to streamline the process of applying for and managing scholarships. It brings together a wide range of scholarship schemes offered by central and state governments, as well as various ministries and departments, under a single online interface.",
      tags: ["Scholarships", "Digital Platform", "One-Stop", "NSP", "DBT"],
      source: "https://scholarships.gov.in/",
      icon: <Trophy className="w-5 h-5" />
    },
    {
      id: 6,
      title: "Pradhan Mantri Poshan Shakti Nirman (Mid-Day Meal)",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "Pradhan Mantri Poshan Shakti Nirman, commonly known as the Mid-Day Meal Scheme, is a flagship programme of the Government of India designed to improve both the nutritional status and learning outcomes of school children. Implemented by the Ministry of Education, the scheme provides free, nutritious meals to students of government and government-aided schools from classes I to VIII.",
      tags: ["Mid-Day Meal", "Nutrition", "School Children", "Food Security", "Poshan"],
      source: "https://pmposhan.education.gov.in/",
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 7,
      title: "Rashtriya Madhyamik Shiksha Abhiyan",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "Rashtriya Madhyamik Shiksha Abhiyan (RMSA) is a centrally sponsored scheme launched by the Government of India in 2009 to enhance access to quality secondary education. The programme aims to provide universal education for students in classes IX and X by expanding infrastructure, improving teacher quality, and removing barriers to enrollment.",
      tags: ["Secondary Education", "RMSA", "Infrastructure", "Quality Education"],
      source: "https://www.education.gov.in/en/rmsa",
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      id: 8,
      title: "Free and Compulsory Education (RTE)",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The Right of Children to Free and Compulsory Education (RTE) Act, 2009, is a landmark legislation enacted by the Government of India that makes education a fundamental right for all children aged 6 to 14 years. It mandates free and compulsory elementary education in neighborhood schools and outlines clear responsibilities for governments, local authorities, and schools to ensure universal access.",
      tags: ["RTE", "Fundamental Right", "Free Education", "Compulsory", "Act 2009"],
      source: "https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/RTE_Section_wise_rationale_rev_0.pdf",
      icon: <Scale className="w-5 h-5" />
    },
    {
      id: 9,
      title: "Samagra Shiksha",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "Samagra Shiksha is an integrated scheme launched by the Government of India in 2018 to holistically improve the quality of school education from pre-primary to senior secondary levels. It subsumes three major programmes—Sarva Shiksha Abhiyan (SSA), Rashtriya Madhyamik Shiksha Abhiyan (RMSA), and Teacher Education (TE)—to ensure unified and comprehensive development of the education sector.",
      tags: ["Integrated Scheme", "Pre-primary", "Senior Secondary", "Quality Education", "Samagra"],
      source: "https://samagra.education.gov.in/",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 10,
      title: "IDMI (Infrastructure Development in Minority Institutions)",
      ministry: "Ministry of Minority Affairs",
      location: "All",
      type: "Central",
      description: "The Infrastructure Development in Minority Institutions (IDMI) scheme is an initiative of the Ministry of Minority Affairs, Government of India, aimed at enhancing the quality of education in minority-managed institutions. Launched to strengthen infrastructure, the scheme supports schools and colleges in building classrooms, laboratories, libraries, hostels, and other essential facilities.",
      tags: ["Minority Institutions", "Infrastructure", "IDMI", "Classrooms", "Libraries"],
      source: "https://www.minorityaffairs.gov.in/",
      icon: <Building className="w-5 h-5" />
    },
    {
      id: 11,
      title: "National Digital Library of India",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The National Digital Library of India (NDLI) is an ambitious initiative of the Ministry of Education, managed by the Indian Institute of Technology, Kharagpur. It serves as a vast digital repository offering access to a wide range of academic resources including books, research papers, articles, theses, audio-visual materials, and exam preparation content.",
      tags: ["Digital Library", "NDLI", "Academic Resources", "Research Papers", "IIT Kharagpur"],
      source: "https://ndl.iitkgp.ac.in/",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 12,
      title: "Padhe Bharat Badhe Bharat",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "Padhe Bharat Badhe Bharat (PBBB) is a sub-programme of Sarva Shiksha Abhiyan launched by the Government of India to improve foundational learning in early grades. It primarily focuses on classes I and II, emphasizing the development of reading, writing, and comprehension skills along with early mathematics.",
      tags: ["Foundational Learning", "PBBB", "Early Grades", "Reading", "Mathematics"],
      source: "https://www.education.gov.in/sites/upload_files/mhrd/files/document-reports/Padhe-Bharat-Badhe-Bharat.pdf",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 13,
      title: "Scholarships for Minority Students",
      ministry: "Ministry of Minority Affairs",
      location: "All",
      type: "Central",
      description: "The Scholarships for Minority Students are initiatives of the Ministry of Minority Affairs, Government of India, designed to promote educational empowerment among students belonging to minority communities such as Muslims, Christians, Sikhs, Buddhists, Parsis, and Jains. These scholarships are offered at various levels—pre-matric, post-matric, and merit-cum-means—to support students from economically weaker sections.",
      tags: ["Minority Students", "Scholarships", "Pre-matric", "Post-matric", "Merit-cum-Means"],
      source: "https://www.minorityaffairs.gov.in/",
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 14,
      title: "Kasturba Gandhi Balika Vidyalaya",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The Kasturba Gandhi Balika Vidyalaya (KGBV) scheme is an initiative of the Government of India aimed at promoting girls' education, particularly among disadvantaged and marginalized communities. Launched in 2004, the scheme establishes residential schools at the upper primary level for girls belonging to Scheduled Castes, Scheduled Tribes, Other Backward Classes, minority communities, and families living below the poverty line.",
      tags: ["Girls Education", "KGBV", "Residential Schools", "SC/ST", "OBC"],
      source: "http://www.kgbv.upsdc.gov.in",
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 15,
      title: "SWAYAM",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "SWAYAM (Study Webs of Active Learning for Young Aspiring Minds) is a massive open online course (MOOC) platform launched by the Government of India to expand access to quality education. Managed by the Ministry of Education, it provides free online courses developed by some of the country's best teachers and institutions, covering subjects from school to postgraduate level.",
      tags: ["MOOC", "Online Courses", "SWAYAM", "Free Education", "Digital Learning"],
      source: "https://swayam.gov.in",
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 16,
      title: "Girls Hostel Scheme",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The Girls Hostel Scheme is a centrally sponsored initiative of the Department of School Education and Literacy, Government of India, aimed at promoting secondary education among girls, especially from disadvantaged communities. The scheme provides financial support for the construction and operation of hostels in educationally backward blocks to accommodate girl students from classes IX to XII.",
      tags: ["Girls Hostel", "Secondary Education", "Hostels", "Classes IX-XII", "Disadvantaged"],
      source: "https://www.india.gov.in/girls-hostel-scheme-department-school-education-and-literacy",
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 17,
      title: "National Merit-cum-Means Scholarship",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The National Merit-cum-Means Scholarship (NMMS) is a centrally sponsored scheme launched by the Government of India to support meritorious students from economically weaker sections in continuing their education beyond class VIII. Implemented through the Ministry of Education, the scholarship is awarded based on a competitive examination conducted at the state level.",
      tags: ["NMMS", "Merit-cum-Means", "Scholarship", "Class VIII", "Competitive Exam"],
      source: "https://www.education.gov.in/en/nmms",
      icon: <Trophy className="w-5 h-5" />
    },
    {
      id: 18,
      title: "Sukanya Samriddhi Yojana",
      ministry: "Ministry of Finance",
      location: "All",
      type: "Central",
      description: "Sukanya Samriddhi Yojana (SSY) is a savings scheme launched by the Government of India under the \"Beti Bachao Beti Padhao\" initiative to secure the financial future of the girl child. Introduced in 2015, it encourages parents or guardians to invest in their daughters' education and marriage expenses through a long-term savings account.",
      tags: ["SSY", "Savings Scheme", "Girl Child", "Financial Future", "Long-term Investment"],
      source: "https://www.india.gov.in/sukanya-samriddhi-yojna",
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 19,
      title: "National Scheme of Incentives to Girls for Secondary Education",
      ministry: "Ministry of Education",
      location: "All",
      type: "Central",
      description: "The National Scheme of Incentives to Girls for Secondary Education (NSIGSE) is a centrally sponsored programme launched by the Government of India to promote the enrollment and retention of girl students at the secondary level. The scheme primarily targets girls belonging to Scheduled Castes and Scheduled Tribes, as well as those who pass class VIII examinations from Kasturba Gandhi Balika Vidyalayas.",
      tags: ["NSIGSE", "Girls Secondary Education", "SC/ST", "KGBV", "Fixed Deposit"],
      source: "https://www.myscheme.gov.in/schemes/nsigse",
      icon: <Award className="w-5 h-5" />
    },
    // State Schemes
    {
      id: 20,
      title: "Karnataka State Scholarship for SC/ST Students",
      ministry: "Karnataka Department of Backward Classes Welfare",
      location: "Karnataka",
      type: "State",
      description: "A state-level scholarship scheme in Karnataka providing financial assistance to students belonging to Scheduled Castes and Scheduled Tribes pursuing higher education. The scheme covers tuition fees, maintenance allowance, and other educational expenses for undergraduate and postgraduate courses.",
      tags: ["Karnataka", "SC/ST", "Scholarship", "Higher Education", "State Scheme"],
      source: "https://karnataka.gov.in/",
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 21,
      title: "Tamil Nadu Free Laptop Scheme",
      ministry: "Tamil Nadu Department of Higher Education",
      location: "Tamil Nadu",
      type: "State",
      description: "A flagship scheme of the Tamil Nadu government providing free laptops to students who have completed class 12 and are pursuing higher education. The scheme aims to bridge the digital divide and enhance learning opportunities for students from economically weaker sections.",
      tags: ["Tamil Nadu", "Free Laptop", "Digital Education", "Class 12", "Higher Education"],
      source: "https://www.tn.gov.in/",
      icon: <Atom className="w-5 h-5" />
    },
    {
      id: 22,
      title: "Maharashtra Baliraja Krishi Pump Yojana",
      ministry: "Maharashtra Department of Agriculture",
      location: "Maharashtra",
      type: "State",
      description: "A state scheme providing free solar-powered irrigation pumps to farmers in Maharashtra. The scheme aims to reduce farmers' dependence on conventional electricity and diesel, promoting sustainable agriculture and reducing input costs.",
      tags: ["Maharashtra", "Agriculture", "Solar Pump", "Farmers", "Irrigation"],
      source: "https://maharashtra.gov.in/",
      icon: <Wrench className="w-5 h-5" />
    },
    {
      id: 23,
      title: "Gujarat Mukhyamantri Yuva Swavalamban Yojana",
      ministry: "Gujarat Department of Education",
      location: "Gujarat",
      type: "State",
      description: "A comprehensive youth employment scheme in Gujarat providing skill development training, entrepreneurship support, and financial assistance to unemployed youth. The scheme focuses on creating self-employment opportunities and enhancing employability skills.",
      tags: ["Gujarat", "Youth Employment", "Skill Development", "Entrepreneurship", "Self-Employment"],
      source: "https://gujarat.gov.in/",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 24,
      title: "Rajasthan Bhamashah Yojana",
      ministry: "Rajasthan Department of Social Justice and Empowerment",
      location: "Rajasthan",
      type: "State",
      description: "A direct benefit transfer scheme in Rajasthan that provides financial assistance directly to the bank accounts of women heads of families. The scheme aims to empower women and ensure efficient delivery of government benefits to the intended beneficiaries.",
      tags: ["Rajasthan", "Women Empowerment", "Direct Benefit Transfer", "Bank Account", "Financial Assistance"],
      source: "https://rajasthan.gov.in/",
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 25,
      title: "West Bengal Kanyashree Prakalpa",
      ministry: "West Bengal Department of Women and Child Development",
      location: "West Bengal",
      type: "State",
      description: "A conditional cash transfer scheme in West Bengal aimed at improving the status and well-being of girls by incentivizing their education and delaying their marriage. The scheme provides annual scholarships and one-time grants to girls from economically disadvantaged families.",
      tags: ["West Bengal", "Girls Education", "Cash Transfer", "Scholarship", "Marriage Delay"],
      source: "https://wb.gov.in/",
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 26,
      title: "Kerala Student Police Cadet Programme",
      ministry: "Kerala Department of General Education",
      location: "Kerala",
      type: "State",
      description: "A unique educational initiative in Kerala that integrates law enforcement education with regular school curriculum. The programme aims to develop leadership qualities, civic sense, and social responsibility among students while building a positive relationship between police and community.",
      tags: ["Kerala", "Student Police", "Leadership", "Civic Sense", "Community Policing"],
      source: "https://kerala.gov.in/",
      icon: <Scale className="w-5 h-5" />
    },
    {
      id: 27,
      title: "Punjab Smart Connect Scheme",
      ministry: "Punjab Department of School Education",
      location: "Punjab",
      type: "State",
      description: "A digital education initiative in Punjab providing free smartphones to class 12 students to facilitate online learning and digital literacy. The scheme aims to bridge the digital divide and ensure equal access to educational resources for all students.",
      tags: ["Punjab", "Smartphone", "Digital Education", "Class 12", "Online Learning"],
      source: "https://punjab.gov.in/",
      icon: <Atom className="w-5 h-5" />
    }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'central' && scheme.type === 'Central') ||
                      (activeTab === 'state' && scheme.type === 'State');
    
    const matchesState = selectedState === 'all' || scheme.location === selectedState;
    
    return matchesSearch && matchesTab && matchesState;
  });

  // Get unique states for dropdown
  const states = ['all', ...new Set(schemes.filter(scheme => scheme.type === 'State').map(scheme => scheme.location))];

  return (
    <>
      <style jsx>{`
        .scheme-container[data-theme="${theme}"] {
          background: hsl(var(--b1));
          color: hsl(var(--bc));
          min-height: 100vh;
        }
        .scheme-container[data-theme="${theme}"] .bg-white {
          background: hsl(var(--b2)) !important;
        }
        .scheme-container[data-theme="${theme}"] .bg-gray-50 {
          background: hsl(var(--b1)) !important;
        }
        .scheme-container[data-theme="${theme}"] .text-gray-900 {
          color: hsl(var(--bc)) !important;
        }
        .scheme-container[data-theme="${theme}"] .text-gray-700 {
          color: hsl(var(--bc) / 0.8) !important;
        }
        .scheme-container[data-theme="${theme}"] .text-gray-600 {
          color: hsl(var(--bc) / 0.7) !important;
        }
        .scheme-container[data-theme="${theme}"] .text-gray-500 {
          color: hsl(var(--bc) / 0.6) !important;
        }
        .scheme-container[data-theme="${theme}"] .text-gray-400 {
          color: hsl(var(--bc) / 0.5) !important;
        }
        .scheme-container[data-theme="${theme}"] .border-gray-300 {
          border-color: hsl(var(--bc) / 0.2) !important;
        }
        .scheme-container[data-theme="${theme}"] .border-gray-200 {
          border-color: hsl(var(--bc) / 0.15) !important;
        }
        .scheme-container[data-theme="${theme}"] .bg-gray-100 {
          background: hsl(var(--n) / 0.1) !important;
        }
        .scheme-container[data-theme="${theme}"] .bg-gray-50 {
          background: hsl(var(--n) / 0.05) !important;
        }
        .scheme-container[data-theme="${theme}"] .shadow-sm {
          box-shadow: 0 1px 2px 0 hsl(var(--bc) / 0.05) !important;
        }
        .scheme-container[data-theme="${theme}"] .shadow-md {
          box-shadow: 0 4px 6px -1px hsl(var(--bc) / 0.1), 0 2px 4px -1px hsl(var(--bc) / 0.06) !important;
        }
        .scheme-container[data-theme="${theme}"] .hover\\:shadow-md:hover {
          box-shadow: 0 4px 6px -1px hsl(var(--bc) / 0.1), 0 2px 4px -1px hsl(var(--bc) / 0.06) !important;
        }
        .scheme-container[data-theme="${theme}"] .hover\\:border-gray-300:hover {
          border-color: hsl(var(--bc) / 0.2) !important;
        }
        .scheme-container[data-theme="${theme}"] .focus\\:ring-blue-500:focus {
          --tw-ring-color: hsl(var(--p)) !important;
        }
        .scheme-container[data-theme="${theme}"] .focus\\:border-blue-500:focus {
          border-color: hsl(var(--p)) !important;
        }
        .scheme-container[data-theme="${theme}"] .bg-blue-100 {
          background: hsl(var(--p) / 0.1) !important;
        }
        .scheme-container[data-theme="${theme}"] .text-blue-800 {
          color: hsl(var(--pc)) !important;
        }
        .scheme-container[data-theme="${theme}"] .border-blue-200 {
          border-color: hsl(var(--p) / 0.2) !important;
        }
        .scheme-container[data-theme="${theme}"] .bg-green-100 {
          background: hsl(var(--su) / 0.1) !important;
        }
        .scheme-container[data-theme="${theme}"] .text-green-800 {
          color: hsl(var(--suc)) !important;
        }
        .scheme-container[data-theme="${theme}"] .border-green-200 {
          border-color: hsl(var(--su) / 0.2) !important;
        }
        .scheme-container[data-theme="${theme}"] .bg-purple-600 {
          background: hsl(var(--s)) !important;
        }
        .scheme-container[data-theme="${theme}"] .hover\\:bg-purple-700:hover {
          background: hsl(var(--s) / 0.8) !important;
        }
        .scheme-container[data-theme="${theme}"] .focus\\:ring-purple-500:focus {
          --tw-ring-color: hsl(var(--s)) !important;
        }
        .scheme-container[data-theme="${theme}"] .bg-blue-500 {
          background: hsl(var(--p)) !important;
        }
        .scheme-container[data-theme="${theme}"] .hover\\:bg-blue-600:hover {
          background: hsl(var(--p) / 0.8) !important;
        }
        .scheme-container[data-theme="${theme}"] .hover\\:bg-gray-100:hover {
          background: hsl(var(--n) / 0.1) !important;
        }
        .scheme-container[data-theme="${theme}"] .hover\\:bg-gray-50:hover {
          background: hsl(var(--n) / 0.05) !important;
        }
        .scheme-container[data-theme="${theme}"] .hover\\:text-gray-900:hover {
          color: hsl(var(--bc)) !important;
        }
      `}</style>
      
      <div className="scheme-container" data-theme={theme}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-4xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder='For an exact match, put the words in quotes. For example: "Scheme Name"'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Navigation Tabs and State Filter */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-center">
              {/* Tab Navigation */}
              <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'all' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All Schemes
                </button>
                <button
                  onClick={() => setActiveTab('state')}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'state' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  State Schemes
                </button>
                <button
                  onClick={() => setActiveTab('central')}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'central' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Central Schemes
                </button>
              </div>

              {/* State Filter Dropdown */}
              {activeTab === 'state' && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Filter by State:
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="min-w-[150px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="all">All States</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Punjab">Punjab</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schemes List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                {/* Scheme Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {scheme.title}
                </h2>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{scheme.ministry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{scheme.location}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    scheme.type === 'Central' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {scheme.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-5 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {scheme.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={scheme.source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  
                  <button 
                    onClick={() => speak(scheme.description)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    Read Aloud
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredSchemes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-3">No schemes found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search terms or filters to find relevant schemes
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}