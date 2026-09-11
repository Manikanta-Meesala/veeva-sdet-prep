import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';

export default function TopicStudyMode({ selectedTopic, questions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef(null);
  const ITEMS_PER_PAGE = 10;

  // Reset page to 1 when selectedTopic changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopic]);

  // Filter questions for the selected subtopic or category
  const filteredQuestions = questions.filter(q => {
    if (!selectedTopic) return true;
    if (selectedTopic.subtopic) {
      return q.subtopic && q.subtopic.toLowerCase() === selectedTopic.subtopic.toLowerCase();
    }
    if (selectedTopic.category) {
      return q.category && q.category.toLowerCase() === selectedTopic.category.toLowerCase();
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredQuestions.length);
  const currentWindowQuestions = filteredQuestions.slice(startIndex, endIndex);

  const topicName = selectedTopic ? `${selectedTopic.category} → ${selectedTopic.subtopic || 'All Subtopics'}` : 'All Prepared Dumps';

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="topic-study-mode" ref={topRef}>
      {/* Header Banner */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.5rem 1.75rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="tag-badge" style={{ marginBottom: '0.4rem' }}>
              <BookOpen size={14} /> Topic Study Mode (10 Questions per Window)
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{topicName}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="topic-badge" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
              Total: {filteredQuestions.length} Questions
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: '700' }}>
              Showing {startIndex + 1}–{endIndex} (Page {currentPage} of {totalPages})
            </div>
          </div>
        </div>
      </div>

      {/* 10 Questions Container */}
      {currentWindowQuestions.length === 0 ? (
        <div className="question-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No questions found for this topic.</p>
        </div>
      ) : (
        currentWindowQuestions.map((q, idx) => {
          const globalQIndex = startIndex + idx + 1;
          return (
            <div key={q.id || idx} className="question-card">
              <div className="question-header-tag">
                <span className="tag-badge">Q{globalQIndex} of {filteredQuestions.length} • {q.subtopic}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600' }}>ID: {q.id}</span>
              </div>

              <h3 className="question-text">{q.question}</h3>

              {q.code && (
                <pre className="code-block">
                  <code>{q.code}</code>
                </pre>
              )}

              <div className="options-container">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctAnswer;
                  return (
                    <div
                      key={oIdx}
                      className={`option-item ${isCorrect ? 'marked-correct' : ''}`}
                    >
                      <div className="option-indicator">
                        {isCorrect ? '✓' : String.fromCharCode(65 + oIdx)}
                      </div>
                      <span>{opt}</span>
                      {isCorrect && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-green-dark)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <CheckCircle size={14} /> Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="explanation-box">
                  <div className="explanation-title">
                    <Lightbulb size={16} /> Explanation
                  </div>
                  <div className="explanation-text">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Prominent Bottom Pagination Bar (At the bottom of all 10 questions) */}
      {filteredQuestions.length > 0 && (
        <div className="pagination-bar" style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--primary-100)', boxShadow: 'var(--shadow-md)' }}>
          <button
            className="nav-btn nav-btn-outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              padding: '0.65rem 1.25rem',
              fontWeight: '700'
            }}
          >
            <ArrowLeft size={18} /> Previous 10 Questions
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
              <button
                key={pNum}
                className={`page-num-btn ${currentPage === pNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pNum)}
              >
                {pNum}
              </button>
            ))}
          </div>

          <button
            className="nav-btn nav-btn-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              padding: '0.65rem 1.25rem',
              fontWeight: '700'
            }}
          >
            Next 10 Questions <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
