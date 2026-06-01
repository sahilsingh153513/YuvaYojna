'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { useDaisyTheme } from '@/context/DaisyThemeContext'

const CompactCarousel = () => {
  const { theme } = useDaisyTheme()
  
  // Sample images with href links and content
  const images = [
    {
      id: 1,
      src: 'a.png',
      alt: 'Modern office space',
      href: '#workspace',
      title: 'Find Your Perfect Internship',
      description: 'Discover thousands of internship opportunities across India. Connect with top companies and kickstart your career journey with Yuva Yojana. From tech to finance, healthcare to education - your dream internship awaits.',
      badge: 'Career Growth'
    },
    {
      id: 2,
      src: 'b.png',
      alt: 'Green technology',
      href: '#innovation',
      title: 'Skill Development & Training',
      description: 'Master in-demand skills with our comprehensive training programs. Get certified, build your portfolio, and become industry-ready. Expert mentors guide you through practical projects and real-world challenges.',
      badge: 'Skill Building'
    },
    {
      id: 3,
      src: 'c.png',
      alt: 'Clean solutions',
      href: '#solutions',
      title: 'Government Schemes & Benefits',
      description: 'Access exclusive government schemes designed for youth empowerment. From scholarships to startup funding, employment programs to skill certifications - unlock benefits tailored for your success.',
      badge: 'Gov Schemes'
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index)
  }, [])

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
  }

  const handleImageClick = (href) => {
    window.location.href = href
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || isHovered) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlay, isHovered, nextSlide])

  return (
    <div className="relative w-full h-136 overflow-hidden rounded-2xl shadow-2xl" data-theme={theme}>
      {/* Main Carousel Container */}
      <div 
        className="relative w-full h-full group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images Container */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
                index === currentSlide 
                  ? 'opacity-100 scale-100 translate-x-0' 
                  : index < currentSlide
                  ? 'opacity-0 scale-110 -translate-x-full'
                  : 'opacity-0 scale-110 translate-x-full'
              }`}
              onClick={() => handleImageClick(image.href)}
            >
              {/* Background Image with Enhanced Overlay */}
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat relative group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${image.src})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Content Overlay */}
                <div className={`absolute inset-0 flex items-center p-8 lg:p-16 ${
                  index === 1 ? 'justify-end pr-10 lg:pr-6' : 'justify-start'
                }`}>
                  <div className="max-w-2xl text-white space-y-6 transform transition-all duration-700 delay-300">
                    {/* Badge */}
                    <div className="inline-block">
                      <span className="badge badge-primary badge-lg px-4 py-2 text-sm font-semibold">
                        {image.badge}
                      </span>
                    </div>
                    
                    {/* Title with polygon background */}
                    <div className="relative">
                      <div 
                        className="absolute inset-0 bg-primary/20 backdrop-blur-sm transform -skew-x-12 rounded-lg"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)'
                        }}
                      ></div>
                      <h1 className="relative text-3xl lg:text-5xl font-bold leading-tight py-4 px-6">
                        {image.title}
                      </h1>
                    </div>
                    
                    {/* Description with styled background */}
                    <div className="relative">
                      <div 
                        className="absolute inset-0 bg-base-100/10 backdrop-blur-md border border-white/20 rounded-xl"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% calc(100% - 15px), 15px 100%)'
                        }}
                      ></div>
                      <p className="relative text-base lg:text-lg leading-relaxed p-6 text-white/90">
                        {image.description}
                      </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-4">
                      <button 
                        className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleImageClick(image.href)
                        }}
                      >
                        Explore Now
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            prevSlide()
          }}
          className="btn btn-circle btn-primary/80 backdrop-blur-md absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:btn-primary transition-all duration-300 hover:scale-110 border-primary/30"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
          className="btn btn-circle btn-primary/80 backdrop-blur-md absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:btn-primary transition-all duration-300 hover:scale-110 border-primary/30"
        >
          <ChevronRight size={20} />
        </button>

        {/* Auto-play Control */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleAutoPlay()
          }}
          className="btn btn-circle btn-secondary/80 backdrop-blur-md absolute top-6 right-6 opacity-0 group-hover:opacity-100 hover:btn-secondary transition-all duration-300 hover:scale-110 border-secondary/30"
        >
          {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
        </button>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                goToSlide(index)
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-primary shadow-lg shadow-primary/50' 
                  : 'w-3 h-3 bg-white/40 hover:bg-white/70 hover:scale-125'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter with Enhanced Style */}
        <div className="absolute top-6 left-6 bg-base-100/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
          <span className="text-primary font-bold">{currentSlide + 1}</span>
          <span className="text-white/60 mx-1">/</span>
          <span className="text-white/80 font-medium">{images.length}</span>
        </div>
      </div>

      {/* Floating Animated Elements with theme colors */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
    </div>
  )
}

export default CompactCarousel