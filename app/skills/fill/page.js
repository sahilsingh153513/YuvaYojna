'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Download, Eye, ArrowLeft, FileText, Briefcase, GraduationCap, Award, User, Phone, Mail, MapPin, Calendar, Building2, Plus, Trash2 } from 'lucide-react';

const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'templates', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef();

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    photo: null, // For profile photo
    
    // Professional Summary
    summary: '',
    
    // Skills
    skills: [{ skillName: '', proficiencyLevel: 'Beginner', yearsOfExperience: '' }],
    
    // Work Experience
    workExperience: [{
      jobTitle: '',
      company: '',
      duration: '',
      description: '',
      location: ''
    }],

    // Projects
    projects: [{ title: '', technologies: '', description: '', link: '' }],

    // Achievements
    achievements: [{ title: '', description: '', date: '' }],
    
    // Education
    education: [{
      degree: '',
      institution: '',
      graduationYear: '',
      grade: ''
    }],
    
    // Certifications
    certifications: [{ name: '', issuingOrganization: '', dateObtained: '' }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const importedResume = JSON.parse(localStorage.getItem('yuvaResumeProfile') || '{}');
      const resumeText = importedResume.resumeText || '';
      const hasRawPdfText = /^%PDF-|endobj|xref|\/Type\s*\/Page/i.test(resumeText);

      if (hasRawPdfText) {
        localStorage.removeItem('yuvaResumeProfile');
        return;
      }

      if (params.get('from') === 'imported' && importedResume.skills?.length) {
        setFormData((current) => ({
          ...current,
          fullName: importedResume.fullName || current.fullName,
          email: importedResume.email || current.email,
          phone: importedResume.phone || current.phone,
          address: importedResume.address || current.address,
          photo: importedResume.photo || current.photo,
          summary: importedResume.summary || current.summary,
          skills: importedResume.skills?.length ? importedResume.skills : current.skills,
          workExperience: importedResume.workExperience?.length ? importedResume.workExperience : current.workExperience,
          projects: importedResume.projects?.length ? importedResume.projects : current.projects,
          achievements: importedResume.achievements?.length ? importedResume.achievements : current.achievements,
          education: importedResume.education?.length ? importedResume.education : current.education,
          certifications: importedResume.certifications?.length ? importedResume.certifications : current.certifications,
        }));

        if (params.get('step') === 'templates') {
          setCurrentStep('templates');
        }
      }
    } catch (error) {
      console.error('Unable to load imported resume draft:', error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      // Handle file upload for photo
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            photo: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayField = (section, defaultObject) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultObject]
    }));
  };

  const removeArrayField = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    const hasValidSkill = formData.skills.some(skill => skill.skillName.trim());
    if (!hasValidSkill) {
      newErrors.skills = 'At least one skill is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsGenerating(true);
      
      try {
        // Post form data to your API
        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalInfo: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              photo: formData.photo
            },
            summary: formData.summary,
            skills: formData.skills.filter(skill => skill.skillName.trim()),
            workExperience: formData.workExperience.filter(exp => exp.jobTitle.trim() && exp.company.trim()),
            projects: formData.projects.filter(project => project.title.trim() || project.description.trim()),
            achievements: formData.achievements.filter(achievement => achievement.title.trim()),
            education: formData.education.filter(edu => edu.degree.trim() && edu.institution.trim()),
            certifications: formData.certifications.filter(cert => cert.name.trim())
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Resume data saved successfully:', result);

        localStorage.setItem('yuvaResumeProfile', JSON.stringify({
          ...formData,
          skills: formData.skills.filter(skill => skill.skillName.trim()),
          workExperience: formData.workExperience.filter(exp => exp.jobTitle.trim() && exp.company.trim()),
          projects: formData.projects.filter(project => project.title.trim() || project.description.trim()),
          achievements: formData.achievements.filter(achievement => achievement.title.trim()),
          education: formData.education.filter(edu => edu.degree.trim() && edu.institution.trim()),
          certifications: formData.certifications.filter(cert => cert.name.trim()),
          savedAt: new Date().toISOString()
        }));
        
        // Move to templates step after successful API call
        setCurrentStep('templates');
        
      } catch (error) {
        console.error('Error saving resume data:', error);
        // You can add user-friendly error handling here
        alert('Failed to save resume data. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, minimalist design perfect for tech roles',
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'creative',
      name: 'Creative Designer', 
      description: 'Vibrant and eye-catching for creative positions',
      color: 'from-pink-500 to-orange-500'
    },
    {
      id: 'classic',
      name: 'Classic Business',
      description: 'Traditional format ideal for corporate roles',
      color: 'from-gray-700 to-gray-900'
    },
    {
      id: 'minimal',
      name: 'Minimal Elegance',
      description: 'Simple and elegant, focuses on content',
      color: 'from-green-600 to-teal-600'
    }
  ];

  const generatePDF = async () => {
    setIsGenerating(true);
    document.body.classList.add('resume-print-mode');

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('resume-print-mode');
        setIsGenerating(false);
      }, 500);
    }, 100);
  };

  const generateDocx = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      const blob = generateDocxBlob(generateResumeContent());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(formData.fullName || 'Resume').replace(/\s+/g, '_')}_Resume_${selectedTemplate}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    }, 2000);
  };

  const escapeXml = (value) => String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  const createZip = (files) => {
    const encoder = new TextEncoder();
    const chunks = [];
    const centralDirectory = [];
    let offset = 0;
    const crcTable = Array.from({ length: 256 }, (_, index) => {
      let crc = index;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
      return crc >>> 0;
    });
    const crc32 = (bytes) => {
      let crc = 0xffffffff;
      bytes.forEach((byte) => {
        crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
      });
      return (crc ^ 0xffffffff) >>> 0;
    };
    const pushUint16 = (array, value) => {
      array.push(value & 0xff, (value >>> 8) & 0xff);
    };
    const pushUint32 = (array, value) => {
      array.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
    };

    files.forEach(({ name, content }) => {
      const nameBytes = encoder.encode(name);
      const dataBytes = encoder.encode(content);
      const crc = crc32(dataBytes);
      const local = [];
      pushUint32(local, 0x04034b50);
      pushUint16(local, 20);
      pushUint16(local, 0);
      pushUint16(local, 0);
      pushUint16(local, 0);
      pushUint16(local, 0);
      pushUint32(local, crc);
      pushUint32(local, dataBytes.length);
      pushUint32(local, dataBytes.length);
      pushUint16(local, nameBytes.length);
      pushUint16(local, 0);
      chunks.push(new Uint8Array(local), nameBytes, dataBytes);

      const central = [];
      pushUint32(central, 0x02014b50);
      pushUint16(central, 20);
      pushUint16(central, 20);
      pushUint16(central, 0);
      pushUint16(central, 0);
      pushUint16(central, 0);
      pushUint16(central, 0);
      pushUint32(central, crc);
      pushUint32(central, dataBytes.length);
      pushUint32(central, dataBytes.length);
      pushUint16(central, nameBytes.length);
      pushUint16(central, 0);
      pushUint16(central, 0);
      pushUint16(central, 0);
      pushUint16(central, 0);
      pushUint32(central, 0);
      pushUint32(central, offset);
      centralDirectory.push(new Uint8Array(central), nameBytes);
      offset += local.length + nameBytes.length + dataBytes.length;
    });

    const centralSize = centralDirectory.reduce((sum, chunk) => sum + chunk.length, 0);
    const end = [];
    pushUint32(end, 0x06054b50);
    pushUint16(end, 0);
    pushUint16(end, 0);
    pushUint16(end, files.length);
    pushUint16(end, files.length);
    pushUint32(end, centralSize);
    pushUint32(end, offset);
    pushUint16(end, 0);

    return new Blob([...chunks, ...centralDirectory, new Uint8Array(end)], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  };

  const generateDocxBlob = (content) => {
    const paragraphs = content
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const isHeading = /^[A-Z][A-Z\s&]+$/.test(line) || /^[-=]{8,}$/.test(line);
        if (/^[-=]{8,}$/.test(line)) return "";
        return `<w:p><w:pPr>${isHeading ? '<w:pStyle w:val="Heading2"/>' : ""}</w:pPr><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`;
      })
      .filter(Boolean)
      .join("");
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr></w:body></w:document>`;

    return createZip([
      { name: "[Content_Types].xml", content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>` },
      { name: "_rels/.rels", content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>` },
      { name: "word/document.xml", content: documentXml },
    ]);
  };

  const generateResumeContent = () => {
    const cleanData = {
      ...formData,
      skills: formData.skills.filter(skill => skill.skillName.trim()),
      workExperience: formData.workExperience.filter(exp => exp.jobTitle.trim() && exp.company.trim()),
      projects: formData.projects.filter(project => project.title.trim() || project.description.trim()),
      achievements: formData.achievements.filter(achievement => achievement.title.trim()),
      education: formData.education.filter(edu => edu.degree.trim() && edu.institution.trim()),
      certifications: formData.certifications.filter(cert => cert.name.trim())
    };

    let content = '';

    // Header based on template
    if (selectedTemplate === 'modern') {
      content += `
======================================
        ${cleanData.fullName.toUpperCase()}
======================================
${cleanData.email} | ${cleanData.phone}
${cleanData.address}

`;
    } else if (selectedTemplate === 'creative') {
      content += `
🌟 ${cleanData.fullName} 🌟
📧 ${cleanData.email} | 📱 ${cleanData.phone}
📍 ${cleanData.address}

`;
    } else if (selectedTemplate === 'classic') {
      content += `
${cleanData.fullName}
${cleanData.email} | ${cleanData.phone}
${cleanData.address}

`;
    } else { // minimal
      content += `
${cleanData.fullName}
${cleanData.email} | ${cleanData.phone}
${cleanData.address}

`;
    }

    // Skills Section
    if (cleanData.skills.length > 0) {
      content += `TECHNICAL SKILLS
${'-'.repeat(50)}
`;
      cleanData.skills.forEach(skill => {
        content += `• ${skill.skillName} - ${skill.proficiencyLevel}`;
        if (skill.yearsOfExperience) {
          content += ` (${skill.yearsOfExperience} years)`;
        }
        content += '\n';
      });
      content += '\n';
    }

    // Work Experience
    if (cleanData.workExperience.length > 0) {
      content += `PROFESSIONAL EXPERIENCE
${'-'.repeat(50)}
`;
      cleanData.workExperience.forEach(exp => {
        content += `${exp.jobTitle}
${exp.company}${exp.location ? ` | ${exp.location}` : ''}
${exp.duration}

${exp.description || 'No description provided.'}

`;
      });
    }

    if (cleanData.projects.length > 0) {
      content += `PROJECTS
${'-'.repeat(50)}
`;
      cleanData.projects.forEach(project => {
        content += `${project.title}
${project.technologies ? `Tech: ${project.technologies}\n` : ''}${project.link ? `Link: ${project.link}\n` : ''}
${project.description || 'No description provided.'}

`;
      });
    }

    if (cleanData.achievements.length > 0) {
      content += `ACHIEVEMENTS
${'-'.repeat(50)}
`;
      cleanData.achievements.forEach(achievement => {
        content += `${achievement.title}${achievement.date ? ` | ${achievement.date}` : ''}
${achievement.description || ''}

`;
      });
    }

    // Education
    if (cleanData.education.length > 0) {
      content += `EDUCATION
${'-'.repeat(50)}
`;
      cleanData.education.forEach(edu => {
        content += `${edu.degree}
${edu.institution}${edu.graduationYear ? ` | ${edu.graduationYear}` : ''}${edu.grade ? ` | ${edu.grade}` : ''}

`;
      });
    }

    // Certifications
    if (cleanData.certifications.length > 0) {
      content += `CERTIFICATIONS
${'-'.repeat(50)}
`;
      cleanData.certifications.forEach(cert => {
        content += `${cert.name}
${cert.issuingOrganization}${cert.dateObtained ? ` | ${new Date(cert.dateObtained).toLocaleDateString()}` : ''}

`;
      });
    }

    // Professional Summary
    if (cleanData.summary) {
      content = content.replace('TECHNICAL SKILLS', `PROFESSIONAL SUMMARY
${'-'.repeat(50)}
${cleanData.summary}

TECHNICAL SKILLS`);
    }

    return content;
  };

  const ModernTemplate = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -mx-8 -mt-8 mb-6">
        <div className="flex items-center space-x-6">
          {formData.photo && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0">
              <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{formData.fullName}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{formData.email}</span>
              <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{formData.phone}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{formData.address}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Professional Summary */}
      {formData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
        </div>
      )}
      
      {/* Skills */}
      {formData.skills.some(s => s.skillName.trim()) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />Skills
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {formData.skills.filter(s => s.skillName.trim()).map((skill, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="font-medium">{skill.skillName}</span>
                <span className="text-sm text-blue-600">{skill.proficiencyLevel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {formData.workExperience.some(w => w.jobTitle.trim()) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-600" />Experience
          </h2>
          {formData.workExperience.filter(w => w.jobTitle.trim()).map((exp, idx) => (
            <div key={idx} className="mb-4 border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
              <p className="text-blue-600 font-medium">{exp.company} | {exp.location}</p>
              <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education.some(e => e.degree.trim()) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />Education
          </h2>
          {formData.education.filter(e => e.degree.trim()).map((edu, idx) => (
            <div key={idx} className="mb-3 bg-gray-50 p-3 rounded">
              <h3 className="font-bold text-lg">{edu.degree}</h3>
              <p className="text-blue-600 font-medium">{edu.institution}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{edu.graduationYear}</span>
                {edu.grade && <span>Grade: {edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {formData.certifications.some(c => c.name.trim()) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />Certifications
          </h2>
          {formData.certifications.filter(c => c.name.trim()).map((cert, idx) => (
            <div key={idx} className="mb-2 bg-gray-50 p-2 rounded">
              <h3 className="font-semibold">{cert.name}</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{cert.issuingOrganization}</span>
                {cert.dateObtained && <span>{new Date(cert.dateObtained).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CreativeTemplate = () => (
    <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-8 shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center space-x-6 mb-4">
          {formData.photo && (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-orange-500 flex-shrink-0 shadow-lg">
              <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              {formData.fullName}
            </h1>
          </div>
        </div>
        <div className="flex justify-center space-x-6 text-gray-600">
          <span>{formData.email}</span>
          <span>{formData.phone}</span>
          <span>{formData.address}</span>
        </div>
      </div>

      {/* Professional Summary */}
      {formData.summary && (
        <div className="mb-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {/* Skills */}
          {formData.skills.some(s => s.skillName.trim()) && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Skills</h2>
              <div className="space-y-2">
                {formData.skills.filter(s => s.skillName.trim()).map((skill, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.skillName}</span>
                      <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2 py-1 rounded text-xs">
                        {skill.proficiencyLevel}
                      </span>
                    </div>
                    {skill.yearsOfExperience && (
                      <p className="text-xs text-gray-500 mt-1">{skill.yearsOfExperience} years experience</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {formData.education.some(e => e.degree.trim()) && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Education</h2>
              {formData.education.filter(e => e.degree.trim()).map((edu, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm mb-3">
                  <h3 className="font-bold text-lg text-gray-800">{edu.degree}</h3>
                  <p className="text-pink-600 font-medium">{edu.institution}</p>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{edu.graduationYear}</span>
                    {edu.grade && <span>Grade: {edu.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Experience */}
          {formData.workExperience.some(w => w.jobTitle.trim()) && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Experience</h2>
              {formData.workExperience.filter(w => w.jobTitle.trim()).map((exp, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm mb-4">
                  <h3 className="font-bold text-lg text-gray-800">{exp.jobTitle}</h3>
                  <p className="text-pink-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-2">{exp.duration} | {exp.location}</p>
                  <p className="text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {formData.certifications.some(c => c.name.trim()) && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Certifications</h2>
              {formData.certifications.filter(c => c.name.trim()).map((cert, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 shadow-sm mb-3">
                  <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                  <p className="text-orange-600 text-sm">{cert.issuingOrganization}</p>
                  {cert.dateObtained && (
                    <p className="text-gray-500 text-xs">{new Date(cert.dateObtained).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ClassicTemplate = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto border">
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">{formData.fullName}</h1>
        <div className="mt-2 text-gray-600">
          {formData.email} | {formData.phone} | {formData.address}
        </div>
      </div>

      {/* Professional Summary */}
      {formData.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-400 mb-3">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed italic">{formData.summary}</p>
        </div>
      )}

      {/* Skills */}
      {formData.skills.some(s => s.skillName.trim()) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-400 mb-3">
            Technical Skills
          </h2>
          <div className="text-gray-700">
            {formData.skills.filter(s => s.skillName.trim()).map((skill, idx) => (
              <span key={idx}>
                {skill.skillName} ({skill.proficiencyLevel})
                {skill.yearsOfExperience && ` - ${skill.yearsOfExperience} years`}
                {idx < formData.skills.filter(s => s.skillName.trim()).length - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {formData.workExperience.some(w => w.jobTitle.trim()) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-400 mb-3">
            Professional Experience
          </h2>
          {formData.workExperience.filter(w => w.jobTitle.trim()).map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{exp.jobTitle}</h3>
                  <p className="text-gray-600 italic">{exp.company}, {exp.location}</p>
                </div>
                <span className="text-gray-600 text-sm">{exp.duration}</span>
              </div>
              <p className="text-gray-700 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education.some(e => e.degree.trim()) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-400 mb-3">
            Education
          </h2>
          {formData.education.filter(e => e.degree.trim()).map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-600 italic">{edu.institution}</p>
                </div>
                <div className="text-right text-gray-600 text-sm">
                  <div>{edu.graduationYear}</div>
                  {edu.grade && <div>Grade: {edu.grade}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {formData.certifications.some(c => c.name.trim()) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-400 mb-3">
            Certifications
          </h2>
          {formData.certifications.filter(c => c.name.trim()).map((cert, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                  <p className="text-gray-600 italic">{cert.issuingOrganization}</p>
                </div>
                {cert.dateObtained && (
                  <span className="text-gray-600 text-sm">{new Date(cert.dateObtained).toLocaleDateString()}</span>
                )}
          
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );      



  const MinimalTemplate = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-800 mb-2">{formData.fullName}</h1>
        <div className="text-gray-600 space-x-2">
          <span>{formData.email}</span>
          <span>•</span>
          <span>{formData.phone}</span>
          <span>•</span>
          <span>{formData.address}</span>
        </div>
      </div>

      {/* Professional Summary */}
      {formData.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
        </div>
      )}

      {/* Skills */}
      {formData.skills.some(s => s.skillName.trim()) && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.filter(s => s.skillName.trim()).map((skill, idx) => (
              <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                {skill.skillName} ({skill.proficiencyLevel})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {formData.workExperience.some(w => w.jobTitle.trim()) && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Experience</h2>
          {formData.workExperience.filter(w => w.jobTitle.trim()).map((exp, idx) => (
            <div key={idx} className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-gray-800">{exp.jobTitle}</h3>
                <span className="text-sm text-gray-500">{exp.duration}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{exp.company}, {exp.location}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education.some(e => e.degree.trim()) && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Education</h2>
          {formData.education.filter(e => e.degree.trim()).map((edu, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                <span className="text-sm text-gray-500">{edu.graduationYear}</span>
              </div>
              <p className="text-gray-600 text-sm">{edu.institution}</p>
              {edu.grade && <p className="text-gray-500 text-sm">Grade: {edu.grade}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {formData.certifications.some(c => c.name.trim()) && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Certifications</h2>
          {formData.certifications.filter(c => c.name.trim()).map((cert, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-gray-800">{cert.name}</h3>
                {cert.dateObtained && (
                  <span className="text-sm text-gray-500">{new Date(cert.dateObtained).toLocaleDateString()}</span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{cert.issuingOrganization}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PolishedResumeTemplate = ({ variant }) => {
    const validSkills = formData.skills.filter((skill) => skill.skillName?.trim());
    const validExperience = formData.workExperience.filter((exp) => exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim());
    const validProjects = (formData.projects || []).filter((project) => project.title?.trim() || project.description?.trim());
    const validAchievements = (formData.achievements || []).filter((achievement) => achievement.title?.trim() || achievement.description?.trim());
    const validEducation = formData.education.filter((edu) => edu.degree?.trim() || edu.institution?.trim());
    const validCertifications = formData.certifications.filter((cert) => cert.name?.trim());
    const displayName = formData.fullName?.trim() || 'Your Name';
    const contactItems = [formData.email, formData.phone, formData.address].filter(Boolean);
    const summary = formData.summary?.trim() || 'Add a short professional summary to make this resume stronger.';
    const initials = displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    const onePage = "h-[1123px] w-full max-w-[794px] overflow-hidden";
    const clamp = (lines) => ({
      display: "-webkit-box",
      WebkitLineClamp: lines,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    });

    const skillsList = (
      <div className="flex flex-wrap gap-2">
        {validSkills.length ? validSkills.map((skill, index) => (
          <span key={`${skill.skillName}-${index}`} className="rounded-full border border-current/15 px-3 py-1 text-xs font-semibold">
            {skill.skillName}
          </span>
        )) : <p className="text-sm opacity-70">Add skills to complete this section.</p>}
      </div>
    );

    const ExperienceList = ({ compact = false }) => (
      <div className="space-y-4">
        {validExperience.length ? validExperience.map((exp, index) => (
          <div key={index} className={compact ? 'border-b border-gray-200 pb-3 last:border-0' : 'border-l-4 border-current/20 pl-4'}>
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-bold text-gray-950">{exp.jobTitle || 'Role'}</h3>
              {exp.duration && <span className="text-xs font-semibold text-gray-500">{exp.duration}</span>}
            </div>
            <p className="text-sm font-semibold opacity-80">{[exp.company, exp.location].filter(Boolean).join(' | ')}</p>
            {exp.description && <p className="mt-2 text-sm leading-5 text-gray-700" style={clamp(compact ? 3 : 4)}>{exp.description}</p>}
          </div>
        )) : <p className="text-sm text-gray-500">Add work experience or internships to complete this section.</p>}
      </div>
    );

    const ProjectList = ({ boxed = false }) => (
      <div className="space-y-4">
        {validProjects.length ? validProjects.map((project, index) => (
          <div key={index} className={boxed ? 'rounded-lg border border-gray-200 bg-white p-4' : 'border-b border-gray-200 pb-3 last:border-0'}>
            <h3 className="font-bold text-gray-950">{project.title || 'Project'}</h3>
            {project.technologies && <p className="text-xs font-semibold uppercase text-gray-500">{project.technologies}</p>}
            {project.description && <p className="mt-2 text-sm leading-5 text-gray-700" style={clamp(5)}>{project.description}</p>}
            {project.link && <p className="mt-1 text-xs text-gray-500">{project.link}</p>}
          </div>
        )) : <p className="text-sm text-gray-500">Add projects to make this section complete.</p>}
      </div>
    );

    const AchievementList = () => (
      <div className="space-y-2">
        {validAchievements.map((achievement, index) => (
          <div key={index} className="flex gap-2 text-sm leading-6">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-current" />
            <p style={clamp(2)}><span className="font-semibold text-gray-950">{achievement.title}</span>{achievement.date ? ` (${achievement.date})` : ''}{achievement.description ? ` - ${achievement.description}` : ''}</p>
          </div>
        ))}
      </div>
    );

    const EducationList = () => (
      <div className="space-y-3">
        {validEducation.map((edu, index) => (
          <div key={index}>
            <h3 className="font-bold text-gray-950">{edu.degree || 'Degree'}</h3>
            <p className="text-sm text-gray-600">{edu.institution || 'Institution'}</p>
            <p className="text-xs text-gray-500">{[edu.graduationYear, edu.grade].filter(Boolean).join(' | ')}</p>
          </div>
        ))}
      </div>
    );

    const CertificationList = () => (
      <div className="space-y-3">
        {validCertifications.map((cert, index) => (
          <div key={index}>
            <h3 className="font-semibold text-gray-950">{cert.name}</h3>
            <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
          </div>
        ))}
      </div>
    );

    const Section = ({ title, icon: Icon, children, className = '' }) => (
      <section className={className}>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide">
          {Icon && <Icon className="h-4 w-4" />}
          {title}
        </h2>
        {children}
      </section>
    );

    if (variant === 'creative') {
      return (
        <article className={`mx-auto rounded-sm bg-[#fff7ed] text-gray-900 shadow-2xl ${onePage}`}>
          <header className="relative bg-[#7c2d12] px-8 py-7 text-white">
            <div className="absolute bottom-0 right-0 h-24 w-56 bg-[#f97316]" />
            <div className="relative flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-3xl font-black text-[#7c2d12]">{initials}</div>
              <div>
                <h1 className="text-4xl font-black">{displayName}</h1>
                <p className="mt-3 max-w-xl text-sm leading-5 text-orange-50" style={clamp(3)}>{summary}</p>
              </div>
            </div>
          </header>
          <div className="grid gap-4 px-8 py-6">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-700">{contactItems.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_270px]">
              <main className="space-y-5">
                <Section title="Experience" icon={Briefcase}><ExperienceList /></Section>
                <Section title="Projects" icon={FileText}><ProjectList boxed /></Section>
                {validAchievements.length > 0 && <Section title="Achievements" icon={Award}><AchievementList /></Section>}
              </main>
              <aside className="space-y-5 rounded-xl bg-white p-4 shadow-sm">
                <Section title="Skills" icon={Award}>{skillsList}</Section>
                {validEducation.length > 0 && <Section title="Education" icon={GraduationCap}><EducationList /></Section>}
                {validCertifications.length > 0 && <Section title="Certifications" icon={FileText}><CertificationList /></Section>}
              </aside>
            </div>
          </div>
        </article>
      );
    }

    if (variant === 'classic') {
      return (
        <article className={`mx-auto bg-white px-10 py-8 text-gray-950 shadow-2xl ${onePage}`}>
          <header className="border-b-4 border-gray-950 pb-5 text-center">
            <h1 className="text-4xl font-black uppercase">{displayName}</h1>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700">{contactItems.map((item) => <span key={item}>{item}</span>)}</div>
          </header>
          <main className="mt-7 space-y-6">
            <Section title="Professional Summary" icon={User}><p className="text-sm leading-5 text-gray-700" style={clamp(4)}>{summary}</p></Section>
            <Section title="Core Skills" icon={Award}>{skillsList}</Section>
            <Section title="Professional Experience" icon={Briefcase}><ExperienceList compact /></Section>
            <Section title="Projects" icon={FileText}><ProjectList /></Section>
            {validAchievements.length > 0 && <Section title="Achievements" icon={Award}><AchievementList /></Section>}
            <div className="grid gap-6 sm:grid-cols-2">
              {validEducation.length > 0 && <Section title="Education" icon={GraduationCap}><EducationList /></Section>}
              {validCertifications.length > 0 && <Section title="Certifications" icon={FileText}><CertificationList /></Section>}
            </div>
          </main>
        </article>
      );
    }

    if (variant === 'minimal') {
      return (
        <article className={`mx-auto bg-white px-12 py-9 text-gray-900 shadow-2xl ${onePage}`}>
          <header className="mb-9">
            <h1 className="text-5xl font-light">{displayName}</h1>
            <div className="mt-4 h-px bg-gray-300" />
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">{contactItems.map((item) => <span key={item}>{item}</span>)}</div>
          </header>
          <main className="space-y-8">
            <Section title="Summary" icon={User}><p className="text-sm leading-5 text-gray-700" style={clamp(4)}>{summary}</p></Section>
            <Section title="Experience" icon={Briefcase}><ExperienceList compact /></Section>
            <Section title="Selected Projects" icon={FileText}><ProjectList /></Section>
            <div className="grid gap-8 sm:grid-cols-2">
              <Section title="Skills" icon={Award}>{skillsList}</Section>
              {validAchievements.length > 0 && <Section title="Achievements" icon={Award}><AchievementList /></Section>}
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {validEducation.length > 0 && <Section title="Education" icon={GraduationCap}><EducationList /></Section>}
              {validCertifications.length > 0 && <Section title="Certifications" icon={FileText}><CertificationList /></Section>}
            </div>
          </main>
        </article>
      );
    }

    return (
      <article className={`mx-auto grid grid-cols-[245px_1fr] rounded-sm bg-white text-gray-900 shadow-2xl ${onePage}`}>
        <aside className="bg-[#0f172a] px-7 py-9 text-white">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400 text-3xl font-black text-slate-950">{initials}</div>
          <Section title="Contact" icon={Mail}><div className="space-y-2 text-sm text-slate-200">{contactItems.map((item) => <p key={item}>{item}</p>)}</div></Section>
          <Section title="Skills" icon={Award} className="mt-7">{skillsList}</Section>
          {validEducation.length > 0 && (
            <Section title="Education" icon={GraduationCap} className="mt-7">
              <div className="space-y-3">
                {validEducation.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-white">{edu.degree || 'Degree'}</h3>
                    <p className="text-sm text-slate-200">{edu.institution || 'Institution'}</p>
                    <p className="text-xs text-slate-300">{[edu.graduationYear, edu.grade].filter(Boolean).join(' | ')}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {validCertifications.length > 0 && (
            <Section title="Certifications" icon={FileText} className="mt-7">
              <div className="space-y-3">
                {validCertifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-white">{cert.name}</h3>
                    <p className="text-sm text-slate-200">{cert.issuingOrganization}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </aside>
        <main className="px-9 py-9">
          <header className="mb-8">
            <p className="text-sm font-black uppercase tracking-wide text-emerald-600">Resume Portfolio</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">{displayName}</h1>
            <p className="mt-4 text-sm leading-5 text-gray-700" style={clamp(4)}>{summary}</p>
          </header>
          <div className="space-y-7 text-slate-950">
            <Section title="Experience" icon={Briefcase}><ExperienceList /></Section>
            <Section title="Projects" icon={FileText}><ProjectList boxed /></Section>
            {validAchievements.length > 0 && <Section title="Achievements" icon={Award}><AchievementList /></Section>}
          </div>
        </main>
      </article>
    );
  };

  const renderTemplate = () => {
    return <PolishedResumeTemplate variant={selectedTemplate} />;
  };

  if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">Create Your Resume</h1>
            <p className="text-base-content/70 text-lg">Fill out your information to generate a professional resume</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="card-title text-xl">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Full Name *</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`}
                        required
                      />
                      {errors.fullName && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.fullName}</span>
                        </label>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Email Address *</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`input input-bordered w-full pl-12 ${errors.email ? 'input-error' : ''}`}
                          required
                        />
                      </div>
                      {errors.email && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.email}</span>
                        </label>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Phone Number *</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`input input-bordered w-full pl-12 ${errors.phone ? 'input-error' : ''}`}
                          required
                        />
                      </div>
                      {errors.phone && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.phone}</span>
                        </label>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Address</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="input input-bordered w-full pl-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-xl">Skills</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayField('skills', { skillName: '', proficiencyLevel: 'Beginner', yearsOfExperience: '' })}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>

                  {errors.skills && (
                    <div className="alert alert-error mb-4">
                      <span>{errors.skills}</span>
                    </div>
                  )}

                  {formData.skills.map((skill, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-base-200 rounded-lg">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Skill Name</span>
                        </label>
                        <input
                          type="text"
                          value={skill.skillName}
                          onChange={(e) => handleArrayFieldChange('skills', index, 'skillName', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="e.g., JavaScript, Data Analysis"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Proficiency Level</span>
                        </label>
                        <select
                          value={skill.proficiencyLevel}
                          onChange={(e) => handleArrayFieldChange('skills', index, 'proficiencyLevel', e.target.value)}
                          className="select select-bordered select-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Years of Experience</span>
                        </label>
                        <input
                          type="number"
                          value={skill.yearsOfExperience}
                          onChange={(e) => handleArrayFieldChange('skills', index, 'yearsOfExperience', e.target.value)}
                          className="input input-bordered input-sm"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeArrayField('skills', index)}
                          className="btn btn-error btn-outline btn-sm w-full"
                          disabled={formData.skills.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-xl">Work Experience</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayField('workExperience', { jobTitle: '', company: '', duration: '', description: '', location: '' })}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </button>
                  </div>

                  {formData.workExperience.map((exp, index) => (
                    <div key={index} className="mb-6 p-4 bg-base-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Job Title</span>
                          </label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => handleArrayFieldChange('workExperience', index, 'jobTitle', e.target.value)}
                            className="input input-bordered input-sm"
                          />
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Company</span>
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleArrayFieldChange('workExperience', index, 'company', e.target.value)}
                            className="input input-bordered input-sm"
                          />
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Duration</span>
                          </label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => handleArrayFieldChange('workExperience', index, 'duration', e.target.value)}
                            className="input input-bordered input-sm"
                            placeholder="e.g., Jan 2020 - Dec 2022"
                          />
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Location</span>
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => handleArrayFieldChange('workExperience', index, 'location', e.target.value)}
                            className="input input-bordered input-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Job Description</span>
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleArrayFieldChange('workExperience', index, 'description', e.target.value)}
                          rows="3"
                          className="textarea textarea-bordered"
                          placeholder="Describe your key responsibilities and achievements..."
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeArrayField('workExperience', index)}
                        className="btn btn-error btn-outline btn-sm"
                        disabled={formData.workExperience.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-xl">Projects</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayField('projects', { title: '', technologies: '', description: '', link: '' })}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  </div>

                  {formData.projects.map((project, index) => (
                    <div key={index} className="mb-6 rounded-lg bg-base-200 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Project Title</span>
                          </label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleArrayFieldChange('projects', index, 'title', e.target.value)}
                            className="input input-bordered input-sm"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Technologies</span>
                          </label>
                          <input
                            type="text"
                            value={project.technologies}
                            onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                            className="input input-bordered input-sm"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        <div className="form-control md:col-span-2">
                          <label className="label">
                            <span className="label-text">Project Link</span>
                          </label>
                          <input
                            type="text"
                            value={project.link}
                            onChange={(e) => handleArrayFieldChange('projects', index, 'link', e.target.value)}
                            className="input input-bordered input-sm"
                            placeholder="GitHub, live demo, or portfolio link"
                          />
                        </div>
                      </div>
                      <div className="form-control my-4">
                        <label className="label">
                          <span className="label-text">Project Description</span>
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                          rows="3"
                          className="textarea textarea-bordered"
                          placeholder="What you built, your role, and the impact."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayField('projects', index)}
                        className="btn btn-error btn-outline btn-sm"
                        disabled={formData.projects.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-xl">Achievements</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayField('achievements', { title: '', description: '', date: '' })}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Achievement
                    </button>
                  </div>

                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="mb-4 rounded-lg bg-base-200 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_160px]">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Achievement</span>
                          </label>
                          <input
                            type="text"
                            value={achievement.title}
                            onChange={(e) => handleArrayFieldChange('achievements', index, 'title', e.target.value)}
                            className="input input-bordered input-sm"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Year</span>
                          </label>
                          <input
                            type="text"
                            value={achievement.date}
                            onChange={(e) => handleArrayFieldChange('achievements', index, 'date', e.target.value)}
                            className="input input-bordered input-sm"
                            placeholder="2025"
                          />
                        </div>
                      </div>
                      <div className="form-control my-4">
                        <label className="label">
                          <span className="label-text">Details</span>
                        </label>
                        <textarea
                          value={achievement.description}
                          onChange={(e) => handleArrayFieldChange('achievements', index, 'description', e.target.value)}
                          rows="2"
                          className="textarea textarea-bordered"
                          placeholder="Rank, award, certification result, competition, or measurable impact."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayField('achievements', index)}
                        className="btn btn-error btn-outline btn-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-xl">Education</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayField('education', { degree: '', institution: '', graduationYear: '', grade: '' })}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>

                  {formData.education.map((edu, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-base-200 rounded-lg">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Degree</span>
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="e.g., Bachelor of Science"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Institution</span>
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="e.g., University of Technology"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Graduation Year</span>
                        </label>
                        <input
                          type="number"
                          value={edu.graduationYear}
                          onChange={(e) => handleArrayFieldChange('education', index, 'graduationYear', e.target.value)}
                          className="input input-bordered input-sm"
                          min="1950"
                          max={new Date().getFullYear() + 10}
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Grade/GPA</span>
                        </label>
                        <input
                          type="text"
                          value={edu.grade}
                          onChange={(e) => handleArrayFieldChange('education', index, 'grade', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="e.g., 3.8/4.0 or First Class"
                        />
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeArrayField('education', index)}
                          className="btn btn-error btn-outline btn-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-xl">Certifications</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayField('certifications', { name: '', issuingOrganization: '', dateObtained: '' })}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </button>
                  </div>

                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-base-200 rounded-lg">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Certification Name</span>
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleArrayFieldChange('certifications', index, 'name', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="e.g., AWS Certified Solutions Architect"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Issuing Organization</span>
                        </label>
                        <input
                          type="text"
                          value={cert.issuingOrganization}
                          onChange={(e) => handleArrayFieldChange('certifications', index, 'issuingOrganization', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="e.g., Amazon Web Services"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Date Obtained</span>
                        </label>
                        <input
                          type="date"
                          value={cert.dateObtained}
                          onChange={(e) => handleArrayFieldChange('certifications', index, 'dateObtained', e.target.value)}
                          className="input input-bordered input-sm"
                        />
                      </div>
                      
                      <div className="md:col-span-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeArrayField('certifications', index)}
                          className="btn btn-error btn-outline btn-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                >
                  <FileText className="w-5 h-5" />
                  Continue to Templates
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (currentStep === 'templates') {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setCurrentStep('form')}
              className="btn btn-outline"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Form
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-base-content mb-2">Choose Your Template</h1>
              <p className="text-base-content/70">Select a design that matches your style</p>
            </div>
            <div className="w-24"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all ${
                  selectedTemplate === template.id ? 'ring-4 ring-primary' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className={`h-32 bg-gradient-to-br ${template.color} rounded-t-2xl flex items-center justify-center`}>
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <div className="card-body">
                  <h3 className="card-title text-lg">{template.name}</h3>
                  <p className="text-base-content/70 text-sm">{template.description}</p>
                  <div className="card-actions mt-4 grid grid-cols-1 gap-2">
                    <div className={`badge justify-self-start ${selectedTemplate === template.id ? 'badge-primary' : 'badge-outline'}`}>
                      {selectedTemplate === template.id ? 'Selected' : 'Not selected'}
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedTemplate(template.id);
                        setCurrentStep('preview');
                      }}
                      className={`btn btn-sm ${selectedTemplate === template.id ? 'btn-primary' : 'btn-outline btn-primary'}`}
                    >
                      Use this template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setCurrentStep('preview')}
              className="btn btn-primary"
            >
              <Eye className="w-5 h-5" />
              Preview selected template
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'preview') {
    return (
      <div className="min-h-screen bg-base-200">
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            body.resume-print-mode * {
              visibility: hidden !important;
            }

            body.resume-print-mode #printable-resume,
            body.resume-print-mode #printable-resume * {
              visibility: visible !important;
            }

            body.resume-print-mode #printable-resume {
              position: fixed !important;
              inset: 0 auto auto 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-width: none !important;
              overflow: hidden !important;
              background: white !important;
            }

            body.resume-print-mode #printable-resume article {
              width: 210mm !important;
              height: 297mm !important;
              max-width: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setCurrentStep('templates')}
              className="btn btn-outline"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Templates
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-base-content mb-2">Resume Preview</h1>
              <p className="text-base-content/70">
                Template: {templates.find(t => t.id === selectedTemplate)?.name}
              </p>
            </div>
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="btn btn-success"
            >
              {isGenerating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Opening PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-[360px_1fr]">
            <aside className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="text-lg font-bold">Quick edit</h2>
              <p className="mt-1 text-sm text-base-content/60">Change project and achievement content here; preview updates instantly.</p>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Summary</span>
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(event) => setFormData((current) => ({ ...current, summary: event.target.value }))}
                    className="textarea textarea-bordered min-h-24 w-full"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Projects</h3>
                    <button
                      type="button"
                      onClick={() => addArrayField('projects', { title: '', technologies: '', description: '', link: '' })}
                      className="btn btn-primary btn-xs"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                  {(formData.projects || []).map((project, index) => (
                    <div key={index} className="rounded-lg bg-base-200 p-3">
                      <input
                        value={project.title}
                        onChange={(event) => handleArrayFieldChange('projects', index, 'title', event.target.value)}
                        className="input input-bordered input-sm w-full"
                        placeholder="Project title"
                      />
                      <input
                        value={project.technologies}
                        onChange={(event) => handleArrayFieldChange('projects', index, 'technologies', event.target.value)}
                        className="input input-bordered input-sm mt-2 w-full"
                        placeholder="Technologies"
                      />
                      <textarea
                        value={project.description}
                        onChange={(event) => handleArrayFieldChange('projects', index, 'description', event.target.value)}
                        className="textarea textarea-bordered mt-2 min-h-28 w-full"
                        placeholder="Project description"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField('projects', index)}
                        className="btn btn-error btn-outline btn-xs mt-2"
                        disabled={(formData.projects || []).length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Achievements</h3>
                    <button
                      type="button"
                      onClick={() => addArrayField('achievements', { title: '', description: '', date: '' })}
                      className="btn btn-primary btn-xs"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                  {(formData.achievements || []).map((achievement, index) => (
                    <div key={index} className="rounded-lg bg-base-200 p-3">
                      <input
                        value={achievement.title}
                        onChange={(event) => handleArrayFieldChange('achievements', index, 'title', event.target.value)}
                        className="input input-bordered input-sm w-full"
                        placeholder="Achievement"
                      />
                      <textarea
                        value={achievement.description}
                        onChange={(event) => handleArrayFieldChange('achievements', index, 'description', event.target.value)}
                        className="textarea textarea-bordered mt-2 min-h-20 w-full"
                        placeholder="Details"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField('achievements', index)}
                        className="btn btn-error btn-outline btn-xs mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex justify-center overflow-auto">
              <div id="printable-resume" ref={resumeRef} className="w-full max-w-[794px]">
                {renderTemplate()}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-base-content/70 mb-4">
              Happy with your resume? Download it now or go back to make changes.
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => setCurrentStep('templates')}
                className="btn btn-outline"
              >
                Use different template
              </button>
              <button 
                onClick={() => setCurrentStep('form')}
                className="btn btn-outline"
              >
                Edit Information
              </button>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="btn btn-success btn-lg"
              >
                {isGenerating ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Opening PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={generateDocx}
                disabled={isGenerating}
                className="btn btn-outline btn-success btn-lg"
              >
                <Download className="w-5 h-5" />
                Download DOCX
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; 
};

export default ResumeBuilder;
