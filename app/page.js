'use client'

import { useState, useEffect } from 'react';
import AccessibilityPanel from '@/components/Access';
import { Users, Target, Smartphone, MapPin, GraduationCap, Lightbulb, CheckCircle, ArrowRight, Star, TrendingUp, Globe, Heart, Zap, Award, BookOpen, Briefcase, Map, UserCheck, Brain, Clock, Shield } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useVoiceControl } from '@/context/VoiceControlContext';
import ModernCarousel from '@/components/Corosel';
import FormPage from './form/page';
import Demo3 from '@/components/Faq';
import AboutUs from './about/page';
import { useDaisyTheme } from '@/context/DaisyThemeContext';
import SchemesPage from '@/components/page';
import FindSchemesButton from '@/components/FindSchemesButton';

export default function PMInternshipLanding() {
  const { theme } = useDaisyTheme();
  const { speak, processVoiceCommand } = useVoiceControl();
  const [activeFeature, setActiveFeature] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { t } = useTranslation()

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart AI Matching",
      description: "Our intelligent system analyzes your profile, skills, and aspirations to find the perfect internship matches from hundreds of opportunities.",
      color: "primary"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Recommendations", 
      description: "Get 3-5 carefully curated internship suggestions instead of overwhelming lists, tailored specifically to your background and interests.",
      color: "secondary"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Access recommendations anywhere, anytime. Our mobile-optimized interface works seamlessly even with limited internet connectivity.",
      color: "accent"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Regional Language Support",
      description: "Navigate in your preferred language with intuitive visual cues, making it accessible for users with varying digital literacy levels.",
      color: "info"
    }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Rural Uttar Pradesh",
      text: "As a first-generation learner, I was overwhelmed by all the internship options. This AI tool helped me find the perfect match in just minutes!",
      rating: 5
    },
    {
      name: "Rahul Kumar",
      location: "Tribal District, Jharkhand", 
      text: "I never thought an AI could understand my village background so well. Got an amazing internship opportunity that fits my skills perfectly.",
      rating: 5
    },
    {
      name: "Anita Patel",
      location: "Urban Slum, Mumbai",
      text: "The simple interface made it so easy to use. Even my grandmother could navigate this! Found my dream internship in social work.",
      rating: 5
    }
  ]

  const stats = [
    { number: "50,000+", label: "Students Helped", icon: <Users className="w-6 h-6" />, color: "primary" },
    { number: "95%", label: "Match Accuracy", icon: <Target className="w-6 h-6" />, color: "secondary" },
    { number: "500+", label: "Partner Organizations", icon: <Briefcase className="w-6 h-6" />, color: "accent" },
    { number: "28", label: "Indian States Covered", icon: <Map className="w-6 h-6" />, color: "info" }
  ]

  const benefits = [
    { icon: <Clock className="w-6 h-6" />, title: "Save Time", desc: "Find relevant internships in minutes, not hours", color: "primary" },
    { icon: <UserCheck className="w-6 h-6" />, title: "Better Matches", desc: "AI ensures you apply to internships that fit your profile", color: "secondary" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Higher Success Rate", desc: "Increase your chances of getting selected", color: "accent" },
    { icon: <Shield className="w-6 h-6" />, title: "Verified Opportunities", desc: "All internships are pre-vetted and legitimate", color: "success" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
     

     

      {/* Other Components */}
      <ModernCarousel />
        <FindSchemesButton></FindSchemesButton>
      <SchemesPage></SchemesPage>
    
      {/* <FormPage /> */}
      <Demo3 />
      <AboutUs />

      {/* Current Theme Display */}
      
    </div>
  )
}