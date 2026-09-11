import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, BookOpen, Clock, Award, ArrowRight, Zap, Target } from 'lucide-react';

export default function HomeScreen({ questions, onStartRandomQuiz, onStartPracticeQuiz, onSelectTopic }) {
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
          Master Veeva SDET, Core Java, Collections, OOPs, Exception Handling, DBMS & Aptitude MCQs with verified exam dumps, instant explanations, and timed mock tests.
        </p>

        <div className="hero-actions">
          <button className="hero-btn hero-btn-primary" onClick={() => onStartRandomQuiz(selectedCount)}>
            <PlayCircle size={20} /> Launch Timed Exam ({selectedCount} Qs)
          </button>
          <button className="hero-btn hero-btn-secondary" onClick={() => onStartPracticeQuiz()}>
            <CheckCircle2 size={20} /> Start Practice Mode
          </button>
        </div>
      </div>

      {/* Main Choice Cards */}
      <div className="grid-2">
        {/* Random Quiz Card */}
        <div className="feature-card">
          <div>
            <div className="feature-icon feature-icon-blue">
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>Random Timed Exam</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', marginBottom: '1.25rem' }}>
              Simulates a live exam environment with a running countdown timer. One question per screen with Next/Previous navigation and comprehensive score report upon submission.
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

        {/* Practice Quiz Card */}
        <div className="feature-card">
          <div>
            <div className="feature-icon feature-icon-green">
              <Zap size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>Interactive Practice Quiz</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', marginBottom: '1.25rem' }}>
              Learn as you practice with immediate feedback. Select an option to instantly reveal if it's correct (Green) or wrong (Red) with detailed code explanations.
            </p>

            <div style={{ background: 'var(--bg-surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                <Target size={16} color="var(--accent-green)" /> Instant Feedback & Code Insights
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Contains all 125+ Veeva dumps covering ArrayList, HashMap, Classes & Objects, Exceptions, and Multithreading.
              </p>
            </div>
          </div>

          <button
            className="nav-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', background: 'var(--accent-green)', color: 'white' }}
            onClick={() => onStartPracticeQuiz()}
          >
            Practice All Topics <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Quick Overview Stats Bar */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="var(--primary-500)" /> VEEVA SDET Question Dumps Summary
        </h3>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--primary-600)' }}>{totalQuestions}</div>
            <div className="stat-label">Verified Exam MCQs</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--accent-green-dark)' }}>{categoriesCount}</div>
            <div className="stat-label">Core Categories</div>
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
