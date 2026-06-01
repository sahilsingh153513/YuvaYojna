"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Search,
  Upload,
} from "lucide-react";

const SKILL_ALIASES = {
  "HTML": ["html", "html5"],
  "CSS": ["css", "css3"],
  "JavaScript": ["javascript", "java script", "js", "es6", "ecmascript"],
  "TypeScript": ["typescript", "type script", "ts"],
  "React": ["react", "react.js", "reactjs"],
  "Next.js": ["next.js", "nextjs", "next js"],
  "Node.js": ["node.js", "nodejs", "node js", "node"],
  "Express.js": ["express", "express.js", "expressjs"],
  "MongoDB": ["mongodb", "mongo db", "mongoose"],
  "SQL": ["sql", "mysql", "postgresql", "postgres", "sqlite"],
  "Python": ["python", "py"],
  "Java": ["java"],
  "C++": ["c++", "cpp"],
  "C": [" c ", "c language"],
  "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
  "Bootstrap": ["bootstrap"],
  "Git": ["git", "github", "gitlab"],
  "REST API": ["rest api", "restful", "api development"],
  "Data Analysis": ["data analysis", "data analytics", "excel", "power bi", "tableau"],
  "Machine Learning": ["machine learning", "ml", "tensorflow", "pytorch", "scikit-learn", "sklearn"],
  "AI": ["artificial intelligence", "ai", "generative ai"],
  "Cloud": ["aws", "azure", "gcp", "cloud computing"],
  "Docker": ["docker"],
  "Kubernetes": ["kubernetes", "k8s"],
  "Engineering": ["engineering", "engineer"],
  "Science": ["science"],
  "Research": ["research"],
  "GIS": ["gis", "geographic information system"],
  "Remote Sensing": ["remote sensing"],
  "Chemistry": ["chemistry"],
  "Physics": ["physics"],
  "Food Science": ["food science"],
  "Technology": ["technology", "technical"],
  "IT": ["information technology", " it ", "it support"],
  "Electronics": ["electronics", "embedded", "iot"],
  "Digital Technologies": ["digital technologies", "digital technology"],
  "Nuclear Science": ["nuclear science"],
  "Earth Sciences": ["earth sciences", "earth science"],
  "Communication": ["communication", "presentation", "public speaking"],
  "Project Management": ["project management", "agile", "scrum"],
  "Design": ["design", "ui", "ux", "figma"],
  "Marketing": ["marketing", "seo", "social media"],
  "Finance": ["finance", "accounting"],
  "Chemical Engineering": ["chemical engineering"],
  "Tracking Systems": ["tracking systems", "telemetry", "tracking"],
};

const SKILL_KEYWORDS = Object.keys(SKILL_ALIASES);
const RESUME_SECTION_HEADERS = [
  "skills",
  "technical skills",
  "technologies",
  "tools",
  "programming languages",
  "core competencies",
  "expertise",
];
const STOP_SECTION_HEADERS = [
  "experience",
  "internship",
  "work experience",
  "professional experience",
  "projects",
  "project",
  "education",
  "certifications",
  "certification",
  "achievements",
  "achievement",
  "awards",
  "award",
  "honors",
  "accomplishments",
  "summary",
  "profile",
  "objective",
  "contact",
];

const OPPORTUNITIES = [
  {
    id: 1,
    title: "Digital India Internship Scheme",
    company: "MeitY",
    location: "New Delhi / Remote",
    duration: "Varies",
    stipend: "As per guidelines",
    deadline: "2026-12-31",
    requiredSkills: ["IT", "Electronics", "Digital Technologies", "Technology"],
    description: "Internship opportunities under the Digital India programme for students in IT and technology domains.",
    link: "https://www.meity.gov.in/meity-digital-india-internship-scheme-2023/",
  },
  {
    id: 2,
    title: "Internship & Student Project Trainee Schemes",
    company: "ISRO",
    location: "India, ISRO Centres",
    duration: "Up to 45 days",
    stipend: "Unpaid",
    deadline: "2026-11-30",
    requiredSkills: ["Engineering", "Science", "Research", "Technology"],
    description: "Internship and project trainee schemes for eligible UG, PG, and PhD students.",
    link: "https://www.isro.gov.in/InternshipAndProjects.html",
  },
  {
    id: 3,
    title: "External Student Internship",
    company: "ISRO IIRS",
    location: "Dehradun, India",
    duration: "Project based",
    stipend: "Unpaid",
    deadline: "2026-10-20",
    requiredSkills: ["Remote Sensing", "GIS", "Science", "Engineering"],
    description: "Project-based internships for students interested in remote sensing and geospatial work.",
    link: "https://www.iirs.gov.in/content/external-student-internship",
  },
  {
    id: 4,
    title: "Scheme of Internship of Students to DRDO Labs",
    company: "DRDO",
    location: "India, DRDO Labs",
    duration: "4 weeks to 6 months",
    stipend: "Unpaid",
    deadline: "2026-12-31",
    requiredSkills: ["Engineering", "Science", "Research", "Electronics"],
    description: "Internship programme for students in engineering and sciences, subject to lab approvals.",
    link: "https://www.drdo.gov.in/drdo/index.php/scheme-internship-students",
  },
  {
    id: 5,
    title: "Internship Programme",
    company: "CSIR CFTRI",
    location: "Mysuru, India",
    duration: "1-2 months",
    stipend: "Unpaid",
    deadline: "2026-12-10",
    requiredSkills: ["Food Science", "Technology", "Chemistry"],
    description: "Short-term internships for students in food science, chemistry, and technology.",
    link: "https://www.cftri.res.in/internship",
  },
  {
    id: 6,
    title: "Student Internship / Project Training",
    company: "CSIR NCL",
    location: "Pune, India",
    duration: "2-12 months",
    stipend: "Unpaid",
    deadline: "2026-09-30",
    requiredSkills: ["Chemistry", "Physics", "Chemical Engineering", "Research"],
    description: "Project training in chemistry, physics, and chemical engineering.",
    link: "https://ncl-intern.ncl.res.in/",
  },
  {
    id: 7,
    title: "Student Internship / Project Trainee",
    company: "ISRO ISTRAC",
    location: "Bengaluru, India",
    duration: "Varies",
    stipend: "Unpaid",
    deadline: "2026-11-01",
    requiredSkills: ["Engineering", "Tracking Systems", "Electronics", "Technology"],
    description: "Student project trainee scheme at ISRO telemetry, tracking, and command centre.",
    link: "https://www.isro.gov.in/InternshipAndProjects.html",
  },
  {
    id: 8,
    title: "Research Internship",
    company: "CSIR Labs",
    location: "India",
    duration: "Varies",
    stipend: "As per scheme",
    deadline: "2026-12-01",
    requiredSkills: ["Research", "Science", "Technology", "Data Analysis"],
    description: "Research exposure for students across CSIR laboratories.",
    link: "https://www.csirhrdg.res.in/",
  },
];

function normalizeSkill(skill) {
  return String(skill || "").trim().toLowerCase();
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("yuvaUser") || "{}");
  } catch {
    return {};
  }
}

function getStoredResume() {
  try {
    return JSON.parse(localStorage.getItem("yuvaResumeProfile") || "{}");
  } catch {
    return {};
  }
}

function getResumeLines(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function isBinaryPdfText(text) {
  const value = String(text || "").slice(0, 2000);
  return value.includes("%PDF-") || /(?:\d+\s+\d+\s+obj|endobj|xref|trailer|\/FlateDecode|\/Type\s*\/Page)/i.test(value);
}

function cleanImportedText(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[^\x20-\x7E\t]/g, " ").replace(/\s+/g, " ").trim())
    .filter((line) => {
      if (!line) return false;
      if (/^%PDF/i.test(line)) return false;
      if (/^\d+\s+\d+\s+obj\b/i.test(line)) return false;
      if (/^(endobj|stream|endstream|xref|trailer|startxref|%%EOF)$/i.test(line)) return false;
      if (/^\/(Type|Filter|Length|Root|Info|Size|Prev|ID)\b/i.test(line)) return false;
      if (/^[<>{}[\]()/\\0-9\s]+$/.test(line) && line.length > 12) return false;
      return true;
    })
    .join("\n");
}

function binaryStringToBytes(value) {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 255;
  }
  return bytes;
}

function decodePdfLiteralString(value) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_, escaped) => {
      const map = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" };
      return map[escaped] || escaped;
    })
    .replace(/\\([0-7]{1,3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
    .replace(/\\\r?\n/g, "");
}

function decodePdfHexString(value) {
  const clean = value.replace(/\s+/g, "");
  const bytes = [];
  for (let index = 0; index < clean.length; index += 2) {
    bytes.push(parseInt(clean.slice(index, index + 2).padEnd(2, "0"), 16));
  }

  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    let output = "";
    for (let index = 2; index < bytes.length; index += 2) {
      output += String.fromCharCode((bytes[index] << 8) + (bytes[index + 1] || 0));
    }
    return output;
  }

  return String.fromCharCode(...bytes);
}

function extractPdfTextOperators(streamText) {
  const textParts = [];
  const literalPattern = /\((?:\\.|[^\\)])*\)\s*Tj/g;
  const arrayPattern = /\[([\s\S]*?)\]\s*TJ/g;
  const tokenPattern = /\((?:\\.|[^\\)])*\)|<([0-9a-fA-F\s]+)>/g;
  let match;

  while ((match = literalPattern.exec(streamText))) {
    textParts.push(decodePdfLiteralString(match[0].replace(/\s*Tj$/, "").slice(1, -1)));
  }

  while ((match = arrayPattern.exec(streamText))) {
    let tokenMatch;
    while ((tokenMatch = tokenPattern.exec(match[1]))) {
      const token = tokenMatch[0];
      if (token.startsWith("(")) {
        textParts.push(decodePdfLiteralString(token.slice(1, -1)));
      } else if (token.startsWith("<")) {
        textParts.push(decodePdfHexString(token.slice(1, -1)));
      }
    }
    textParts.push("\n");
  }

  return textParts.join(" ");
}

async function inflatePdfStream(bytes) {
  if (typeof DecompressionStream === "undefined") return "";

  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
    return await new Response(stream).text();
  } catch {
    return "";
  }
}

async function extractPdfTextFromFile(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const binaryText = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  const streamPattern = /([\s\S]{0,500})stream\r?\n([\s\S]*?)\r?\nendstream/g;
  const extracted = [];
  let match;

  while ((match = streamPattern.exec(binaryText))) {
    const dictionary = match[1] || "";
    const rawStream = match[2] || "";
    const streamBytes = binaryStringToBytes(rawStream);
    const isFlate = /\/FlateDecode|\/Fl\b/.test(dictionary);
    const streamText = isFlate ? await inflatePdfStream(streamBytes) : rawStream;
    const text = extractPdfTextOperators(streamText);
    if (text.trim()) extracted.push(text);
  }

  const fallbackText = extractPdfTextOperators(binaryText);
  if (fallbackText.trim()) extracted.push(fallbackText);

  return cleanImportedText(
    extracted
      .join("\n")
      .replace(/\s{2,}/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
  );
}

function hasReadableResumeContent(text) {
  const lines = getResumeLines(cleanImportedText(text));
  const sectionHits = lines.filter((line) =>
    isHeaderLine(line, [...RESUME_SECTION_HEADERS, ...STOP_SECTION_HEADERS, "education", "experience", "projects"])
  ).length;
  const hasContact = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
  return lines.length >= 8 && (sectionHits >= 2 || (hasContact && lines.join(" ").length > 250));
}

function normalizeHeader(line) {
  return line.toLowerCase().replace(/[:\-]/g, "").trim();
}

function isHeaderLine(line, headers) {
  const normalized = normalizeHeader(line);
  return headers.some((header) => normalized === header || normalized.endsWith(` ${header}`));
}

function getSectionLines(text, headers, maxLines = 16) {
  const lines = getResumeLines(text);
  const sectionLines = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!isHeaderLine(lines[index], headers)) continue;

    for (let cursor = index + 1; cursor < Math.min(lines.length, index + maxLines + 1); cursor += 1) {
      if (isHeaderLine(lines[cursor], STOP_SECTION_HEADERS)) break;
      sectionLines.push(lines[cursor]);
    }
  }

  return sectionLines;
}

function getSummaryFromResume(text) {
  if (isBinaryPdfText(text)) return "";

  const summaryLines = getSectionLines(text, ["summary", "professional summary", "profile", "objective"], 6);
  if (summaryLines.length) return summaryLines.join(" ").slice(0, 500);

  return getResumeLines(text)
    .filter((line) => !line.includes("@") && !/\d{7,}/.test(line))
    .slice(1, 4)
    .join(" ")
    .slice(0, 420);
}

function getEducationFromResume(text) {
  const lines = getSectionLines(text, ["education", "academic background", "qualification", "qualifications"], 12);
  const education = [];
  const degreePattern = /(b\.?tech|bachelor|master|m\.?tech|bca|mca|b\.?sc|m\.?sc|diploma|intermediate|class\s?12|class\s?10|high school|secondary)/i;

  lines.forEach((line, index) => {
    if (!degreePattern.test(line) && education.length >= 2) return;

    const year = line.match(/\b(20\d{2}|19\d{2})\b/)?.[0] || "";
    const nextLine = lines[index + 1] || "";
    const looksLikeInstitution = /(university|college|school|institute|academy|vidyalaya)/i.test(nextLine);

    if (degreePattern.test(line) || looksLikeInstitution) {
      education.push({
        degree: degreePattern.test(line) ? line.replace(/\b(20\d{2}|19\d{2})\b/g, "").trim() : "Education",
        institution: looksLikeInstitution ? nextLine : "",
        graduationYear: year || nextLine.match(/\b(20\d{2}|19\d{2})\b/)?.[0] || "",
        grade: line.match(/\b(?:cgpa|gpa|percentage|grade)[:\s-]*([0-9.]+%?)\b/i)?.[0] || "",
      });
    }
  });

  return education.length ? education.slice(0, 3) : [{ degree: "", institution: "", graduationYear: "", grade: "" }];
}

function getExperienceFromResume(text) {
  const entries = getExperienceLikeEntries(text);
  return entries.length ? entries.slice(0, 1) : [{ jobTitle: "", company: "", duration: "", description: "", location: "" }];
}

function getExperienceLikeEntries(text) {
  const lines = getSectionLines(text, ["experience", "work experience", "professional experience", "internship", "internships"], 40);
  const entries = [];
  const consumedIndexes = new Set();
  const datePattern = /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b|\b20\d{2}\b|\bpresent\b)/i;
  const titlePattern = /(developer|engineer|intern|trainee|designer|analyst|manager|project|website|app|system|platform|dashboard|portal|portfolio|clone|achievement|award|rank|winner|certified)/i;

  for (let index = 0; index < lines.length && entries.length < 7; index += 1) {
    if (consumedIndexes.has(index)) continue;

    const line = lines[index];
    const nextLine = lines[index + 1] || "";
    const hasTitleSignal = titlePattern.test(line) || datePattern.test(line);
    if (!hasTitleSignal) continue;

    const duration = [line, nextLine].join(" ").match(/((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\b20\d{2}\b).{0,24}(present|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\b20\d{2}\b)?/i)?.[0] || "";
    const descriptionLines = [];

    for (let cursor = index + 1; cursor < Math.min(lines.length, index + 5); cursor += 1) {
      const item = lines[cursor];
      if (titlePattern.test(item) && descriptionLines.length > 0) break;
      if (!datePattern.test(item)) descriptionLines.push(item);
      consumedIndexes.add(cursor);
    }

    entries.push({
      jobTitle: line.replace(duration, "").trim() || "Experience",
      company: nextLine && !datePattern.test(nextLine) && !titlePattern.test(nextLine) ? nextLine.slice(0, 80) : "",
      duration,
      description: descriptionLines.join(" ").slice(0, 420),
      location: "",
    });
  }

  return entries;
}

function getProjectsFromResume(text) {
  const lines = getSectionLines(text, ["projects", "project", "academic projects", "personal projects", "major projects"], 30)
    .filter((line) => line.length > 2);
  const projects = [];
  const titleSignal = /(project|app|website|system|platform|dashboard|portal|clone|management|prediction|detection|tracker|portfolio|application)/i;
  const projectTitlePattern = /^[A-Z0-9][A-Z0-9\s&/-]{8,},?\s*(?:\([^)]{2,}\))?/;
  const bulletPattern = /^[•\-*]\s*/;
  const looksLikeProjectTitle = (line) => {
    const cleanLine = line.replace(bulletPattern, "").trim();
    const upperRatio = cleanLine.replace(/[^A-Za-z]/g, "").split("").filter((char) => char === char.toUpperCase()).length / Math.max(cleanLine.replace(/[^A-Za-z]/g, "").length, 1);
    return projectTitlePattern.test(cleanLine) || (titleSignal.test(cleanLine) && upperRatio > 0.55 && cleanLine.length <= 140);
  };

  const parseProjectBlock = (block) => {
    if (!block.length) return null;

    const titleLine = block[0].replace(bulletPattern, "").trim();
    const techMatch = titleLine.match(/\(([^)]{2,})\)/);
    const title = titleLine
      .replace(/\([^)]{2,}\)/, "")
      .replace(/,\s*$/, "")
      .trim();
    const description = block
      .slice(1)
      .map((line) => line.replace(bulletPattern, "").trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      title: title || titleLine,
      technologies: techMatch?.[1]?.trim() || extractSkillsFromText([titleLine, description].join(" ")).slice(0, 6).map((skill) => skill.skillName).join(", "),
      description: description.slice(0, 900),
      link: "",
    };
  };

  if (lines.length) {
    const blocks = [];
    let currentBlock = [];

    lines.forEach((line) => {
      if (looksLikeProjectTitle(line) && currentBlock.length) {
        blocks.push(currentBlock);
        currentBlock = [line];
        return;
      }

      currentBlock.push(line);
    });

    if (currentBlock.length) blocks.push(currentBlock);

    blocks
      .map(parseProjectBlock)
      .filter(Boolean)
      .slice(0, 5)
      .forEach((project) => projects.push(project));
  }

  if (!projects.length) {
    const mixedEntries = getExperienceLikeEntries(text);
    const projectEntries = mixedEntries.length > 2 ? mixedEntries.slice(1, -1) : mixedEntries.slice(1);
    projectEntries.forEach((entry) => {
      projects.push({
        title: entry.jobTitle.replace(/^[-•\s]+/, "").trim(),
        technologies: extractSkillsFromText([entry.jobTitle, entry.description].join(" ")).slice(0, 6).map((skill) => skill.skillName).join(", "),
        description: entry.description,
        link: "",
      });
    });
  }

  return projects.length ? projects : [{ title: "", technologies: "", description: "", link: "" }];
}

function getAchievementsFromResume(text) {
  const lines = getSectionLines(text, ["achievements", "achievement", "awards", "award", "honors", "accomplishments"], 18);
  const achievementSignal = /(award|winner|won|rank|selected|certified|certification|recognized|recognised|hackathon|competition|scholarship|achievement|achieved|top\s?\d|finalist|merit|honou?r)/i;
  const genericWorkSignal = /(managed|version control|github|deployed|vercel|collaborating|clients?|requirements?|feedback|implemented|developed|application|platform|remote)/i;
  let achievements = lines
    .filter((line) => line.length > 2)
    .filter((line) => achievementSignal.test(line) && !genericWorkSignal.test(line))
    .slice(0, 6)
    .map((line) => ({
      title: line.replace(/^[-•\s]+/, "").trim(),
      description: "",
      date: line.match(/\b(20\d{2}|19\d{2})\b/)?.[0] || "",
    }));

  if (!achievements.length) {
    const mixedEntries = getExperienceLikeEntries(text);
    if (mixedEntries.length > 2) {
      const lastEntry = mixedEntries[mixedEntries.length - 1];
      const combinedText = [lastEntry.jobTitle, lastEntry.description].join(" ");

      if (achievementSignal.test(combinedText) && !genericWorkSignal.test(combinedText)) {
        achievements = [{
          title: lastEntry.jobTitle.replace(/^[-•\s]+/, "").trim(),
          description: lastEntry.description,
          date: lastEntry.duration.match(/\b(20\d{2}|19\d{2})\b/)?.[0] || "",
        }];
      }
    }
  }

  return achievements.length ? achievements : [{ title: "", description: "", date: "" }];
}

function getCertificationsFromResume(text) {
  const lines = getSectionLines(text, ["certifications", "certification", "courses", "training"], 12);
  const certifications = lines
    .filter((line) => line.length > 2)
    .slice(0, 5)
    .map((line) => ({
      name: line,
      issuingOrganization: "",
      dateObtained: "",
    }));

  return certifications.length ? certifications : [{ name: "", issuingOrganization: "", dateObtained: "" }];
}

function getImportedResumeDraft(text, skills) {
  const cleanedText = cleanImportedText(text);
  const user = getStoredUser();
  const firstEmailMatch = cleanedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phoneMatch = cleanedText.match(/(?:\+?91[-\s]?)?[6-9]\d{9}|\+?\d[\d\s().-]{8,}\d/)?.[0] || "";
  const firstTextLine = cleanedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.includes("@") && !/\d{5,}/.test(line) && !isHeaderLine(line, [...RESUME_SECTION_HEADERS, ...STOP_SECTION_HEADERS]));

  return {
    fullName: user.name || firstTextLine || "",
    email: user.email || firstEmailMatch,
    phone: phoneMatch,
    address: "",
    photo: null,
    summary: getSummaryFromResume(cleanedText),
    skills,
    workExperience: getExperienceFromResume(cleanedText),
    projects: getProjectsFromResume(cleanedText),
    achievements: getAchievementsFromResume(cleanedText),
    education: getEducationFromResume(cleanedText),
    certifications: getCertificationsFromResume(cleanedText),
    resumeText: cleanedText,
    importedFromResume: true,
    savedAt: new Date().toISOString(),
  };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeResumeText(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/[•●▪–—]/g, "\n")
    .replace(/[|]/g, ",")
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ");
}

function aliasMatches(text, alias) {
  const normalizedAlias = alias.trim().toLowerCase();
  if (!normalizedAlias) return false;
  const pattern = new RegExp(`(^|[^a-z0-9+#.])${escapeRegExp(normalizedAlias)}($|[^a-z0-9+#.])`, "i");
  return pattern.test(` ${text} `);
}

function getSkillSectionText(text) {
  const lines = String(text || "")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const chunks = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].toLowerCase().replace(/[:\-]/g, "").trim();
    const isSkillHeader = RESUME_SECTION_HEADERS.some((header) => line === header || line.endsWith(` ${header}`));
    if (!isSkillHeader) continue;

    for (let cursor = index + 1; cursor < Math.min(lines.length, index + 10); cursor += 1) {
      const nextLine = lines[cursor].toLowerCase().replace(/[:\-]/g, "").trim();
      const isStop = STOP_SECTION_HEADERS.some((header) => nextLine === header || nextLine.endsWith(` ${header}`));
      if (isStop) break;
      chunks.push(lines[cursor]);
    }
  }

  return chunks.join(", ");
}

function extractExplicitSkillTokens(text) {
  const skillSection = getSkillSectionText(text);
  if (!skillSection) return [];

  return skillSection
    .split(/[,;/\n]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && token.length <= 32)
    .map((token) => token.replace(/^(and|or)\s+/i, "").trim())
    .filter(Boolean);
}

function canonicalizeSkillName(token) {
  const cleanToken = token.replace(/\s+/g, " ").trim();
  const lowerToken = cleanToken.toLowerCase();
  const matched = Object.entries(SKILL_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => lowerToken === alias.trim().toLowerCase())
  );
  return matched?.[0] || cleanToken;
}

function extractSkillsFromText(text) {
  const searchableText = normalizeResumeText(text).toLowerCase();
  const found = new Set();
  const explicitTokens = extractExplicitSkillTokens(text);

  explicitTokens.forEach((token) => {
    const canonical = canonicalizeSkillName(token);
    if (canonical.length >= 2) found.add(canonical);
  });

  if (!found.size) {
    Object.entries(SKILL_ALIASES).forEach(([skill, aliases]) => {
      if (aliases.some((alias) => aliasMatches(searchableText, alias))) {
        found.add(skill);
      }
    });
  }

  return [...found].sort((a, b) => a.localeCompare(b)).map((skill) => ({
    skillName: skill,
    proficiencyLevel: "",
    yearsOfExperience: "",
  }));
}

function expandSkillsForMatching(skills) {
  const expanded = new Set();
  const add = (value) => {
    const normalized = normalizeSkill(value);
    if (normalized) expanded.add(normalized);
  };

  skills.forEach((skill) => {
    const name = skill.skillName || skill;
    const normalized = normalizeSkill(name);
    add(name);

    if (/(html|css|javascript|typescript|react|next|node|express|mongodb|sql|python|java|c\+\+|git|api|docker|kubernetes|bootstrap|tailwind)/i.test(normalized)) {
      add("IT");
      add("Technology");
      add("Digital Technologies");
      add("Engineering");
    }

    if (/(machinelearning|artificialintelligence|ai|tensorflow|pytorch|scikitlearn|dataanalysis|dataanalytics)/i.test(normalized)) {
      add("AI");
      add("Machine Learning");
      add("Data Analysis");
      add("Research");
      add("Technology");
    }

    if (/(ui|ux|figma|design|frontend|webdesign)/i.test(normalized)) {
      add("Design");
      add("Technology");
      add("Digital Technologies");
    }

    if (/(gis|remotesensing|geospatial|earthscience)/i.test(normalized)) {
      add("GIS");
      add("Remote Sensing");
      add("Earth Sciences");
      add("Science");
    }
  });

  return expanded;
}

function matchOpportunities(skills) {
  const skillSet = expandSkillsForMatching(skills);
  const actualSkillSet = new Set(skills.map((skill) => normalizeSkill(skill.skillName)));

  return OPPORTUNITIES.map((opportunity) => {
    const matchedSkills = opportunity.requiredSkills.filter((skill) =>
      skillSet.has(normalizeSkill(skill))
    );
    const directMatches = opportunity.requiredSkills.filter((skill) =>
      actualSkillSet.has(normalizeSkill(skill))
    );
    const skillMatch = Math.round((matchedSkills.length / opportunity.requiredSkills.length) * 100);

    return { ...opportunity, matchedSkills, directMatches, skillMatch };
  })
    .filter((opportunity) => opportunity.matchedSkills.length > 0)
    .sort((a, b) => b.skillMatch - a.skillMatch);
}

export default function SkillsDashboard() {
  const fileInputRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const matchingOpportunities = useMemo(() => matchOpportunities(skills), [skills]);

  useEffect(() => {
    const loadSkills = async () => {
      setLoading(true);
      const storedResume = getStoredResume();
      const storedSkills = (storedResume.skills || []).filter((skill) => skill.skillName?.trim());

      if (storedSkills.length > 0) {
        setSkills(storedSkills);
        setSource("Saved resume");
        setLoading(false);
        return;
      }

      const user = getStoredUser();
      if (user.email) {
        try {
          const response = await fetch(`/api/skills?email=${encodeURIComponent(user.email)}&limit=1`);
          const data = await response.json();
          const profile = data.profiles?.[0];

          if (profile?.skills?.length) {
            setSkills(profile.skills);
            setSource("Saved profile");
          }
        } catch {
          setMessage("Could not load saved skills. You can import a resume below.");
        }
      }

      setLoading(false);
    };

    loadSkills();
  }, []);

  const importResumeText = (text, label = "Imported resume") => {
    const cleanedText = cleanImportedText(text);

    if (!cleanedText || cleanedText.trim().length < 20) {
      setMessage("Resume text is too short to detect skills. Paste the resume text or upload a text-based resume.");
      return;
    }

    const extractedSkills = extractSkillsFromText(cleanedText);

    if (extractedSkills.length === 0) {
      setMessage("No skills were found in this resume. Paste the Technical Skills section or create a resume manually.");
      return;
    }

    const importedProfile = getImportedResumeDraft(cleanedText, extractedSkills);

    localStorage.setItem("yuvaResumeProfile", JSON.stringify(importedProfile));
    setSkills(extractedSkills);
    setResumeText(cleanedText);
    setSource(label);
    setVisibleCount(4);
    setMessage(`${extractedSkills.length} skills imported from resume. Click "Use Template" to convert it into a template resume.`);
  };

  const useTemplate = () => {
    const importedProfile = getStoredResume();
    if (!importedProfile.skills?.length) {
      setMessage("Import a resume first, then choose a template.");
      return;
    }
    window.location.href = "/skills/fill?from=imported&step=templates";
  };

  const handleFileImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    let readableText = "";

    if (/\.(pdf|docx)$/i.test(file.name) || file.type === "application/pdf") {
      setMessage("Reading resume file...");
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/resume/extract", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not extract this resume. Paste the resume text below and click Extract Skills.");
        event.target.value = "";
        return;
      }

      readableText = result.text;
    } else if (/\.doc$/i.test(file.name)) {
      setMessage("Old .doc files are not supported. Save it as .docx or paste the resume text below.");
      event.target.value = "";
      return;
    } else {
      const text = await file.text();
      readableText = text
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n");
    }

    if (/\.(pdf|doc|docx)$/i.test(file.name) && isBinaryPdfText(readableText) && !hasReadableResumeContent(readableText)) {
      setMessage("This PDF/DOCX did not expose real resume text in the browser, so I stopped the bad import. Copy text from the resume, paste it below, then click Extract Skills to fill the template properly.");
      setResumeText("");
      event.target.value = "";
      return;
    }

    if (/\.pdf$/i.test(file.name) && !hasReadableResumeContent(readableText)) {
      setMessage("I could not extract enough readable text from this PDF. Copy the resume text, paste it below, then click Extract Skills.");
      setResumeText(readableText);
      event.target.value = "";
      return;
    }

    importResumeText(readableText, file.name);
    event.target.value = "";
  };

  const clearResume = () => {
    localStorage.removeItem("yuvaResumeProfile");
    setSkills([]);
    setResumeText("");
    setSource("");
    setMessage("Resume and skills cleared. Add skills before viewing matching jobs.");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 font-medium text-base-content">Loading skills dashboard...</p>
        </div>
      </div>
    );
  }

  const hasSkills = skills.length > 0;

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Skills portfolio</p>
              <h1 className="mt-2 text-4xl font-bold">Match jobs from your real skills</h1>
              <p className="mt-3 max-w-3xl text-base-content/70">
                Opportunities appear only after you create a resume, import a resume, or save skills to your profile.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button onClick={() => window.location.href = "/skills/fill"} className="btn btn-primary">
                <FileText className="h-5 w-5" />
                Create Resume
              </button>
              {hasSkills && (
                <button onClick={useTemplate} className="btn btn-success">
                  <FileText className="h-5 w-5" />
                  Use Template
                </button>
              )}
              <button onClick={() => fileInputRef.current?.click()} className="btn btn-outline">
                <Upload className="h-5 w-5" />
                Import Resume
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {message && (
          <div className="mb-6 rounded-lg border border-info/30 bg-info/10 p-4 text-sm">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Detected skills</h2>
                {source && <span className="badge badge-outline">{source}</span>}
              </div>

              {hasSkills ? (
                <>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill.skillName} className="badge badge-primary badge-outline">
                        {skill.skillName}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-2">
                    <button onClick={useTemplate} className="btn btn-success w-full">
                      <FileText className="h-4 w-4" />
                      Use Template
                    </button>
                    <button onClick={clearResume} className="btn btn-ghost btn-sm">
                      Clear imported skills
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-4 rounded-lg bg-warning/10 p-4 text-sm text-base-content/80">
                  <AlertCircle className="mb-2 h-5 w-5 text-warning" />
                  No skills found yet. Matching jobs are hidden until you add skills or import resume content.
                </div>
              )}
            </div>

            <div className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Paste resume text</h2>
              <p className="mt-1 text-sm text-base-content/60">
                For PDF/DOCX files, paste resume text here if the upload does not extract cleanly.
              </p>
              <textarea
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                className="textarea textarea-bordered mt-4 min-h-40 w-full"
                placeholder="Paste your resume text here..."
              />
              <button
                onClick={() => importResumeText(resumeText, "Pasted resume")}
                disabled={!resumeText.trim()}
                className="btn btn-primary mt-3 w-full"
              >
                <Search className="h-4 w-4" />
                Extract Skills
              </button>
            </div>
          </aside>

          <section>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold">Matching opportunities</h2>
                <p className="text-base-content/60">
                  {hasSkills
                    ? `${matchingOpportunities.length} opportunities matched from your skills`
                    : "No matches shown until skills are available"}
                </p>
              </div>
            </div>

            {!hasSkills ? (
              <EmptyState
                title="Add skills before matching jobs"
                body="Create your resume or import one. After skills are detected, this page will calculate actual matches instead of showing random jobs."
              />
            ) : matchingOpportunities.length === 0 ? (
              <EmptyState
                title="No matching jobs found"
                body="Your skills were detected, but they do not overlap with the current opportunity list. Try adding more specific technical or domain skills."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {matchingOpportunities.slice(0, visibleCount).map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>

                {visibleCount < matchingOpportunities.length && (
                  <div className="mt-8 text-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => setVisibleCount((count) => count + 4)}
                    >
                      View more matches
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function OpportunityCard({ opportunity }) {
  return (
    <article className="rounded-lg border border-base-300 bg-base-100 shadow-sm">
      <div className="border-b border-base-300 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">{opportunity.title}</h3>
            <p className="mt-1 text-base-content/70">{opportunity.company}</p>
          </div>
          <div className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-content">
            {opportunity.skillMatch}%
          </div>
        </div>
        <p className="mt-4 leading-6 text-base-content/70">{opportunity.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {opportunity.matchedSkills.map((skill) => (
            <span key={skill} className="badge badge-success badge-outline">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <Info icon={<MapPin className="h-4 w-4" />} text={opportunity.location} />
          <Info icon={<Briefcase className="h-4 w-4" />} text={opportunity.duration} />
          <Info icon={<Download className="h-4 w-4" />} text={opportunity.stipend} />
          <Info icon={<Calendar className="h-4 w-4" />} text={`Deadline: ${new Date(opportunity.deadline).toLocaleDateString()}`} />
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Required skills</h4>
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills.map((skill) => (
              <span
                key={skill}
                className={`badge ${opportunity.matchedSkills.includes(skill) ? "badge-primary" : "badge-ghost"}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button className="btn btn-primary w-full" onClick={() => window.open(opportunity.link, "_blank")}>
          Apply Now
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-base-content/70">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-10 text-center shadow-sm">
      <FileText className="mx-auto mb-4 h-12 w-12 text-base-content/30" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-base-content/60">{body}</p>
    </div>
  );
}
