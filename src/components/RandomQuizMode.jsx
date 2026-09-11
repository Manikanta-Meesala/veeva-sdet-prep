import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, Flag, Grid } from 'lucide-react';
import ScoreReport from './ScoreReport';

export default function RandomQuizMode({ questions, initialCount = 25, onGoHome }) {
  const [selectedCount, setSelectedCount] = useState(initialCount);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedIndex }
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showPalette, setShowPalette] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isExamStarted && !isExamSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExamStarted, isExamSubmitted]);

  // Start exam handler
  const handleStartExam = (count) => {
    // Shuffle array using Fisher-Yates
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    setExamQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimerSeconds(0);
    setIsExamStarted(true);
    setIsExamSubmitted(false);
  };

  const handleSelectOption = (oIdx) => {
    const currentQ = examQuestions[currentIndex];
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: oIdx }));
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If exam is submitted, render ScoreReport!
  if (isExamSubmitted) {
    return (
      <ScoreReport
        examQuestions={examQuestions}
        userAnswers={userAnswers}
        timeSpentSeconds={timerSeconds}
        onRetake={() => handleStartExam(selectedCount)}
        onGoHome={onGoHome}
      />
    );
  }

  // Setup Modal if exam not started
  if (!isExamStarted) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <div className="question-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div className="feature-icon feature-icon-blue" style={{ margin: '0 auto 1.25rem auto' }}>
            <Clock size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.75rem' }}>
            Generate Random Timed Test
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Select the number of questions you want for this exam session. A timer will track your progress from start until submission.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.75rem' }}>
              Choose Question Count:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {[25, 50, 75, 100].map(count => (
                <button
                  key={count}
                  onClick={() => setSelectedCount(count)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedCount === count ? '2px solid var(--primary-500)' : '1.5px solid var(--border-light)',
                    background: selectedCount === count ? 'var(--primary-50)' : 'white',
                    color: selectedCount === count ? 'var(--primary-700)' : 'var(--text-main)',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  {count} Qs
                </button>
              ))}
            </div>
          </div>

          <button
            className="nav-btn nav-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1.05rem' }}
            onClick={() => handleStartExam(selectedCount)}
          >
            <PlayCircle size={20} /> Begin Timed Exam Now
          </button>
        </div>
      </div>
    );
  }

  const currentQ = examQuestions[currentIndex];
  const selectedOptIndex = userAnswers[currentQ.id];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="random-quiz-mode">
      {/* Top Controls & Timer Bar */}
      <div className="quiz-top-bar">
        <div>
          <div className="tag-badge" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
            Exam Mode • {selectedCount} Questions
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.35rem' }}>
            Question {currentIndex + 1} of {examQuestions.length}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="nav-btn nav-btn-outline"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            onClick={() => setShowPalette(!showPalette)}
          >
            <Grid size={16} /> Question Grid ({answeredCount}/{examQuestions.length})
          </button>

          <div className="timer-pill">
            <Clock size={18} /> {formatTimer(timerSeconds)}
          </div>

          <button
            className="nav-btn"
            style={{ background: 'var(--accent-green)', color: 'white', fontWeight: '700' }}
            onClick={handleSubmitExam}
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Question Palette Drawer Grid */}
      {showPalette && (
        <div className="question-card" style={{ marginBottom: '1.5rem', background: 'var(--bg-surface-alt)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            Question Palette (Click number to jump)
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {examQuestions.map((q, idx) => {
              const isAns = userAnswers[q.id] !== undefined;
              const isCurr = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => { setCurrentIndex(idx); setShowPalette(false); }}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    border: isCurr ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                    background: isAns ? 'var(--accent-green)' : 'white',
                    color: isAns ? 'white' : 'var(--text-main)',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="question-card">
        <div className="question-header-tag">
          <span className="tag-badge">Q{currentIndex + 1} • {currentQ.subtopic}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600' }}>ID: {currentQ.id}</span>
        </div>

        <h2 className="question-text">{currentQ.question}</h2>

        {currentQ.code && (
          <pre className="code-block">
            <code>{currentQ.code}</code>
          </pre>
        )}

        <div className="options-container">
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = selectedOptIndex === oIdx;
            return (
              <div
                key={oIdx}
                className={`option-item ${isSelected ? 'selected-correct' : ''}`}
                onClick={() => handleSelectOption(oIdx)}
                style={{
                  borderColor: isSelected ? 'var(--primary-500)' : 'var(--border-light)',
                  background: isSelected ? 'var(--primary-50)' : 'white',
                  color: isSelected ? 'var(--primary-900)' : 'var(--text-main)',
                  fontWeight: isSelected ? '700' : '500'
                }}
              >
                <div
                  className="option-indicator"
                  style={{
                    borderColor: isSelected ? 'var(--primary-500)' : 'var(--border-light)',
                    background: isSelected ? 'var(--primary-500)' : 'transparent',
                    color: isSelected ? 'white' : 'var(--text-main)'
                  }}
                >
                  {String.fromCharCode(65 + oIdx)}
                </div>
                <span>{opt}</span>
              </div>
            );
          })}
        </div>

        {/* Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            className="nav-btn nav-btn-outline"
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
          >
            <ArrowLeft size={18} /> Previous
          </button>

          {currentIndex === examQuestions.length - 1 ? (
            <button
              className="nav-btn"
              style={{ background: 'var(--accent-green)', color: 'white', padding: '0.65rem 1.5rem', fontWeight: '800' }}
              onClick={handleSubmitExam}
            >
              Finish & Submit Exam <CheckCircle2 size={18} />
            </button>
          ) : (
            <button
              className="nav-btn nav-btn-primary"
              onClick={() => setCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
            >
              Next Question <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
