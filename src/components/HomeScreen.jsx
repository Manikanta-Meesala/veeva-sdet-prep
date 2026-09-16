import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, BookOpen, Clock, Award, ArrowRight, Zap, Target, Code2 } from 'lucide-react';

export default function HomeScreen({ questions, onStartRandomQuiz, onStartPracticeQuiz, onSelectTopic, onOpenCoding }) {
  const [selectedCount, setSelectedCount] = useState(25);

  const totalQuestions = questions.length;
  const categoriesCount = new Set(questions.map(q => q.category)).size;
  const subtopicsCount = new Set(questions.map(q => q.subtopic)).size;

  return (
    <div className="home-screen">
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1 className="hero-title">VEEVA SDET PREP</h1>
        <p className="hero-subtitle">
          Master Veeva SDET, Core Java, Collections, OOPs, Exception Handling, DBMS & Aptitude MCQs along with verified Java Coding Problems, detailed algorithmic breakdowns, and Java solutions.
        </p>

        <div className="hero-actions">
          <button className="hero-btn hero-btn-primary" onClick={onOpenCoding}>
            <Code2 size={20} /> Open Java Coding Problems
          </button>
          <button className="hero-btn hero-btn-secondary" onClick={() => onStartPracticeQuiz()}>
            <CheckCircle2 size={20} /> Practice MCQ Dumps
          </button>
        </div>
      </div>

      {/* Main Choice Cards */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* Java Coding Questions Card */}
        <div className="feature-card" style={{ border: '2px solid #3b82f6', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
          <div>
            <div className="feature-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
              <Code2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>
              Java Coding Questions Section
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', marginBottom: '1.25rem' }}>
              Access 8 essential Veeva SDET coding problems including String parsing, HashMap frequencies, Two Sum, Valid Parentheses, Majority Element, and Day of Week calculation.
            </p>

            <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.35rem' }}>
                <Code2 size={16} /> Structured Format:
              </div>
              <p style={{ fontSize: '0.82rem', color: '#1e3a8a', margin: 0, lineHeight: '1.5' }}>
                Question Explanation → Data Structure Selection → Java Brute Force & Optimized Code with Time & Space Complexities.
              </p>
            </div>
          </div>

          <button
            className="nav-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#38bdf8' }}
            onClick={onOpenCoding}
          >
            Explore Coding Problems <ArrowRight size={18} />
          </button>
        </div>

        {/* Random Quiz Card */}
        <div className="feature-card">
          <div>
            <div className="feature-icon feature-icon-blue">
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>Random Timed Exam</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', marginBottom: '1.25rem' }}>
              Simulates a live exam environment with a running countdown timer. One question per screen with Next/Previous navigation and score report.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                Select Question Count:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[25, 50, 75, 100].map(count => (
                  <button
                    key={count}
                    onClick={() => setSelectedCount(count)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedCount === count ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                      background: selectedCount === count ? 'var(--primary-50)' : 'white',
                      color: selectedCount === count ? 'var(--primary-700)' : 'var(--text-main)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className="nav-btn nav-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            onClick={() => onStartRandomQuiz(selectedCount)}
          >
            Start Exam Now <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Quick Overview Stats Bar */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="var(--primary-500)" /> VEEVA SDET Preparation Repository Overview
        </h3>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--primary-600)' }}>{totalQuestions}</div>
            <div className="stat-label">Verified Exam MCQs</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--accent-green-dark)' }}>8</div>
            <div className="stat-label">Coding Problems & Solutions</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--primary-700)' }}>{subtopicsCount}</div>
            <div className="stat-label">Subtopic Modules</div>
          </div>
        </div>
      </div>
    </div>
  );
}
