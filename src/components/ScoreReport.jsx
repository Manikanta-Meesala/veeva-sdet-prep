import React from 'react';
import { Award, CheckCircle2, XCircle, Clock, RotateCcw, Lightbulb } from 'lucide-react';

export default function ScoreReport({ examQuestions, userAnswers, timeSpentSeconds, onRetake, onGoHome }) {
  // Compute score statistics
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  examQuestions.forEach(q => {
    const selected = userAnswers[q.id];
    if (selected === undefined) {
      unattemptedCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const total = examQuestions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const isPassed = percentage >= 70;

  // Format timer
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="score-report-view">
      {/* Summary Score Card */}
      <div className="score-summary-card">
        <div className={`score-badge-circle ${isPassed ? 'pass' : 'fail'}`}>
          <span className="score-val">{percentage}%</span>
          <span className="score-total">{correctCount} / {total} Marks</span>
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {isPassed ? '🎉 Congratulations! You Passed!' : '💪 Keep Practicing! You can do better!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {isPassed
            ? 'Excellent performance on Veeva SDET & Java Exam Dumps!'
            : 'Review your detailed question-by-question report below to improve your score.'}
        </p>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--accent-green-dark)' }}>{correctCount}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--accent-red-dark)' }}>{wrongCount}</div>
            <div className="stat-label">Wrong Answers</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--primary-700)' }}>{formatTime(timeSpentSeconds)}</div>
            <div className="stat-label">Time Taken</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="nav-btn nav-btn-primary" onClick={onRetake}>
            <RotateCcw size={18} /> Retake Exam
          </button>
          <button className="nav-btn nav-btn-outline" onClick={onGoHome}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Detailed Question Breakdown Review */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '2rem 0 1rem 0', color: 'var(--text-main)' }}>
        Detailed Exam Question Breakdown & Answers Review
      </h3>

      {examQuestions.map((q, idx) => {
        const userChoice = userAnswers[q.id];
        const isUserCorrect = userChoice === q.correctAnswer;
        const isSkipped = userChoice === undefined;

        return (
          <div
            key={q.id || idx}
            className="question-card"
            style={{
              borderColor: isUserCorrect ? '#a7f3d0' : isSkipped ? 'var(--border-light)' : '#fca5a5',
              borderWidth: '1.5px'
            }}
          >
            <div className="question-header-tag">
              <span
                className="tag-badge"
                style={{
                  background: isUserCorrect ? 'var(--accent-green-light)' : isSkipped ? 'var(--bg-surface-alt)' : 'var(--accent-red-light)',
                  color: isUserCorrect ? 'var(--accent-green-dark)' : isSkipped ? 'var(--text-muted)' : 'var(--accent-red-dark)',
                  borderColor: isUserCorrect ? '#a7f3d0' : isSkipped ? 'var(--border-light)' : '#fca5a5'
                }}
              >
                Q{idx + 1} • {isUserCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Wrong Answer'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600' }}>{q.subtopic}</span>
            </div>

            <h3 className="question-text">{q.question}</h3>

            {q.code && (
              <pre className="code-block">
                <code>{q.code}</code>
              </pre>
            )}

            <div className="options-container">
              {q.options.map((opt, oIdx) => {
                const isCorrectOpt = oIdx === q.correctAnswer;
                const isSelectedOpt = oIdx === userChoice;

                let optClass = '';
                if (isCorrectOpt) {
                  optClass = 'selected-correct';
                } else if (isSelectedOpt && !isCorrectOpt) {
                  optClass = 'selected-wrong';
                }

                return (
                  <div key={oIdx} className={`option-item ${optClass}`}>
                    <div className="option-indicator">
                      {isCorrectOpt ? '✓' : isSelectedOpt ? '✗' : String.fromCharCode(65 + oIdx)}
                    </div>
                    <span>{opt}</span>

                    {isCorrectOpt && (
                      <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-green-dark)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <CheckCircle2 size={16} /> Right Answer
                      </span>
                    )}

                    {isSelectedOpt && !isCorrectOpt && (
                      <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-red-dark)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <XCircle size={16} /> Your Selection (Wrong)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {q.explanation && (
              <div className="explanation-box">
                <div className="explanation-title">
                  <Lightbulb size={16} /> Solution Explanation
                </div>
                <div className="explanation-text">{q.explanation}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
