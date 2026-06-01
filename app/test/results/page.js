'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';

const QUESTION_TOPICS = {
  easy: ['HTML basics', 'JavaScript basics', 'CSS fundamentals', 'APIs', 'Git', 'Databases', 'HTML links', 'SQL', 'React basics', 'JavaScript DOM'],
  medium: ['JavaScript scope', 'React state', 'DSA complexity', 'REST APIs', 'Express middleware', 'Databases', 'Docker', 'HTTP methods', 'JavaScript arrays', 'Environment variables'],
  hard: ['JavaScript memory', 'React effects', 'Sorting algorithms', 'JWT auth', 'System design', 'Caching', 'Scaling', 'GraphQL', 'WebSockets', 'React performance'],
};

const CORRECT_ANSWERS = {
  easy: [0, 1, 1, 0, 0, 0, 1, 0, 2, 1],
  medium: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
  hard: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
};

const VIDEO_LIBRARY = {
  tech: [
    { title: 'Full Stack Web Development Roadmap', url: 'https://www.youtube.com/results?search_query=full+stack+web+development+roadmap+2026' },
    { title: 'React and Next.js Project Based Learning', url: 'https://www.youtube.com/results?search_query=react+next.js+project+based+learning' },
    { title: 'DSA for Coding Interviews', url: 'https://www.youtube.com/results?search_query=data+structures+algorithms+coding+interview+playlist' },
    { title: 'System Design Basics', url: 'https://www.youtube.com/results?search_query=system+design+basics+for+beginners' },
  ],
  management: [
    { title: 'Product Management Fundamentals', url: 'https://www.youtube.com/results?search_query=product+management+fundamentals+for+beginners' },
    { title: 'Business Analyst Roadmap', url: 'https://www.youtube.com/results?search_query=business+analyst+roadmap+for+freshers' },
    { title: 'Project Management Basics', url: 'https://www.youtube.com/results?search_query=project+management+basics+for+beginners' },
  ],
  finance: [
    { title: 'Financial Analyst Skills', url: 'https://www.youtube.com/results?search_query=financial+analyst+skills+for+beginners' },
    { title: 'Excel for Finance', url: 'https://www.youtube.com/results?search_query=excel+for+finance+full+course' },
    { title: 'Accounting Basics', url: 'https://www.youtube.com/results?search_query=accounting+basics+for+beginners' },
  ],
  social: [
    { title: 'Social Work Career Guide', url: 'https://www.youtube.com/results?search_query=social+work+career+guide+india' },
    { title: 'NGO Project Management', url: 'https://www.youtube.com/results?search_query=ngo+project+management+training' },
    { title: 'Community Development Strategy', url: 'https://www.youtube.com/results?search_query=community+development+strategy+training' },
  ],
};

function getLevel(percentage) {
  if (percentage >= 80) return { label: 'Strong', color: 'text-success', badge: 'badge-success', note: 'You are ready for advanced projects and interview practice.' };
  if (percentage >= 50) return { label: 'Improving', color: 'text-warning', badge: 'badge-warning', note: 'You have a base. Focus on weak topics and build one proof project.' };
  return { label: 'Foundation', color: 'text-error', badge: 'badge-error', note: 'Start with fundamentals, then retake the assessment after practice.' };
}

function getStrategy(result, weakTopics) {
  const role = result?.selectedRole || 'your target role';
  const firstWeak = weakTopics.slice(0, 3).join(', ') || 'core fundamentals';

  return [
    { day: 'Day 1', task: `Revise ${firstWeak}. Make handwritten notes with examples.` },
    { day: 'Day 2', task: `Watch one focused video for ${role}, then implement the concept in a small task.` },
    { day: 'Day 3', task: 'Solve 10 practice questions from weak topics and explain each mistake in one line.' },
    { day: 'Day 4', task: 'Build or improve one mini project feature related to your role.' },
    { day: 'Day 5', task: 'Practice interview-style questions and speak answers out loud.' },
    { day: 'Day 6', task: 'Update resume/project portfolio with measurable outcomes.' },
    { day: 'Day 7', task: 'Retake this test on the next difficulty or same difficulty for score improvement.' },
  ];
}

export default function TestResultsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setMounted(true);
    const storedResult = localStorage.getItem('testResult');
    if (!storedResult) return;

    try {
      setResult(JSON.parse(storedResult));
    } catch {
      setResult(null);
    }
  }, []);

  const analysis = useMemo(() => {
    if (!result) return null;

    const difficulty = result.difficulty || 'easy';
    const topics = QUESTION_TOPICS[difficulty] || QUESTION_TOPICS.easy;
    const correctAnswers = CORRECT_ANSWERS[difficulty] || CORRECT_ANSWERS.easy;
    const answers = result.answers || [];
    const rows = topics.map((topic, index) => ({
      topic,
      correct: answers[index] === correctAnswers[index],
      attempted: typeof answers[index] === 'number',
    }));
    const weakTopics = rows.filter((row) => !row.correct).map((row) => row.topic);
    const strongTopics = rows.filter((row) => row.correct).map((row) => row.topic);
    const percentage = Math.round(result.percentage || 0);

    return {
      rows,
      weakTopics,
      strongTopics,
      percentage,
      level: getLevel(percentage),
      strategy: getStrategy(result, weakTopics),
      videos: VIDEO_LIBRARY[result.id] || VIDEO_LIBRARY.tech,
    };
  }, [result]);

  if (!mounted) return null;

  if (!result || !analysis) {
    return (
      <div className="min-h-screen bg-base-200 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-lg bg-base-100 p-8 text-center shadow">
          <Target className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold">No test result found</h1>
          <p className="mt-2 text-base-content/70">Take an assessment first, then your result and preparation plan will appear here.</p>
          <button onClick={() => router.push('/test')} className="btn btn-primary mt-6">
            Start Assessment
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <section className="bg-base-100 border-b border-base-300">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Assessment result</p>
              <h1 className="mt-2 text-4xl font-bold">{result.selectedRole} Preparation Plan</h1>
              <p className="mt-3 text-base-content/70">
                {result.name} · {result.difficultyName} · Completed {new Date(result.completedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-200 p-5 text-center">
              <div className={`text-5xl font-black ${analysis.level.color}`}>{analysis.percentage}%</div>
              <div className={`badge ${analysis.level.badge} mt-3`}>{analysis.level.label}</div>
              <p className="mt-3 text-sm text-base-content/70">{analysis.level.note}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Topic Breakdown</h2>
                <p className="text-base-content/60">Use this to see exactly where to revise.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{result.score}/{result.totalQuestions}</div>
                <p className="text-sm text-base-content/60">correct</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {analysis.rows.map((row) => (
                <div key={row.topic} className="flex items-center justify-between rounded-lg border border-base-300 p-3">
                  <span className="font-medium">{row.topic}</span>
                  {row.correct ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-error" />}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-2xl font-bold">7-Day Strategy</h2>
            <div className="mt-5 space-y-3">
              {analysis.strategy.map((item) => (
                <div key={item.day} className="grid gap-3 rounded-lg bg-base-200 p-4 sm:grid-cols-[90px_1fr]">
                  <span className="font-bold text-primary">{item.day}</span>
                  <p className="text-base-content/80">{item.task}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="h-5 w-5 text-primary" />
              Focus Areas
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(analysis.weakTopics.length ? analysis.weakTopics : ['Advanced projects', 'Mock interviews']).slice(0, 6).map((topic) => (
                <span key={topic} className="badge badge-warning badge-outline">{topic}</span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <PlayCircle className="h-5 w-5 text-primary" />
              Related Videos
            </h2>
            <div className="mt-4 space-y-3">
              {analysis.videos.map((video) => (
                <a key={video.title} href={video.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-base-300 p-3 hover:border-primary">
                  <span className="font-medium">{video.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Trophy className="h-5 w-5 text-primary" />
              Next Step
            </h2>
            <p className="mt-3 text-base-content/70">Retake after completing the strategy. Move to a harder level only after scoring 80%+.</p>
            <div className="mt-5 grid gap-3">
              <button onClick={() => router.push('/test/difficulty')} className="btn btn-primary">
                <RotateCcw className="h-4 w-4" />
                Retake Test
              </button>
              <button onClick={() => router.push('/test')} className="btn btn-outline">
                Change Role
              </button>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
