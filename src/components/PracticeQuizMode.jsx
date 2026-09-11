import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Lightbulb, RefreshCw, Zap } from 'lucide-react';

export default function PracticeQuizMode({ questions, selectedTopic, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOptIndex }

  // Filter questions by topic if selected
  const quizQuestions = questions.filter(q => {
    if (!selectedTopic) return true;
    if (selectedTopic.subtopic) {
      return q.subtopic && q.subtopic.toLowerCase() === selectedTopic.subtopic.toLowerCase();
    }
    if (selectedTopic.category) {
      return q.category && q.category.toLowerCase() === selectedTopic.category.toLowerCase();
    }
    return true;
  });

  if (quizQuestions.length === 0) {
    return (
      <div className="question-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>No practice questions available for this filter.</h2>
        <button className="nav-btn nav-btn-primary" style={{ marginTop: '1rem' }} onClick={onReset}>
          Reset Filter & Show All
        </button>
      </div>
    );
  }

  const currentQ = quizQuestions[currentIndex];
  const selectedOptIndex = userAnswers[currentQ.id];
  const isAnswered = selectedOptIndex !== undefined;
  const isCorrect = isAnswered && selectedOptIndex === currentQ.correctAnswer;

  const handleSelectOption = (oIdx) => {
    if (isAnswered) return; // Allow selecting once per question in practice mode
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: oIdx }));
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="practice-quiz-mode">
      {/* Top Header Controls */}
      <div className="quiz-top-bar">
        <div>
          <div className="tag-badge" style={{ background: 'var(--accent-green-light)', color: 'var(--accent-green-dark)', border: '1px solid #a7f3d0' }}>
            <Zap size={14} /> Interactive Practice Quiz
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.35rem' }}>
            {selectedTopic ? `${selectedTopic.category} → ${selectedTopic.subtopic || 'All'}` : 'All Core Dumps Practice'}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Question {currentIndex + 1} of {quizQuestions.length}
            </div>
            <div style={{ width: '120px', height: '6px', background: 'var(--border-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: '0.3rem' }}>
              <div
                style={{
                  width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
                  height: '100%',
                  background: 'var(--accent-green)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

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
            let optionState = '';
            if (isAnswered) {
              if (oIdx === currentQ.correctAnswer) {
                optionState = 'selected-correct';
              } else if (oIdx === selectedOptIndex) {
                optionState = 'selected-wrong';
              }
            }

            return (
              <div
                key={oIdx}
                className={`option-item ${optionState}`}
                onClick={() => handleSelectOption(oIdx)}
              >
                <div className="option-indicator">
                  {isAnswered && oIdx === currentQ.correctAnswer ? '✓' : isAnswered && oIdx === selectedOptIndex ? '✗' : String.fromCharCode(65 + oIdx)}
                </div>
                <span>{opt}</span>

                {isAnswered && oIdx === currentQ.correctAnswer && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-green-dark)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={16} /> Correct Option
                  </span>
                )}

                {isAnswered && oIdx === selectedOptIndex && oIdx !== currentQ.correctAnswer && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-red-dark)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <XCircle size={16} /> Wrong Selection
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Instant Feedback & Explanation Box */}
        {isAnswered && (
          <div className="explanation-box" style={{ background: isCorrect ? '#f0fdf4' : '#fef2f2', borderColor: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            <div className="explanation-title" style={{ color: isCorrect ? 'var(--accent-green-dark)' : 'var(--accent-red-dark)' }}>
              <Lightbulb size={16} /> {isCorrect ? 'Great Job! Correct Answer' : 'Incorrect Answer Explanation'}
            </div>
            <div className="explanation-text" style={{ color: isCorrect ? '#166534' : '#991b1b' }}>
              {currentQ.explanation}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            className="nav-btn nav-btn-outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
          >
            <ArrowLeft size={18} /> Previous Question
          </button>

          <button
            className="nav-btn nav-btn-primary"
            onClick={handleNext}
            disabled={currentIndex === quizQuestions.length - 1}
            style={{ opacity: currentIndex === quizQuestions.length - 1 ? 0.5 : 1, cursor: currentIndex === quizQuestions.length - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next Question <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
