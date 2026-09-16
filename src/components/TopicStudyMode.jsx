import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, Lightbulb, ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';

export default function TopicStudyMode({ selectedTopic, questions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomImage, setZoomImage] = useState(null); // URL for full screen image modal
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
      {/* Image Zoom Modal */}
      {zoomImage && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }} onClick={() => setZoomImage(null)}>
          <div style={{ position: 'relative', maxWidth: '95vw', maxHeight: '95vh' }}>
            <button
              onClick={() => setZoomImage(null)}
              style={{
                position: 'absolute',
                top: '-1rem',
                right: '-1rem',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <X size={20} />
            </button>
            <img
              src={zoomImage}
              alt="Data Interpretation Diagram"
              style={{ maxWidth: '95vw', maxHeight: '90vh', borderRadius: '8px', objectFit: 'contain', background: 'white', padding: '0.5rem' }}
            />
          </div>
        </div>
      )}

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

              {/* Data Interpretation Image / Diagram Display */}
              {q.image && (
                <div style={{ marginBottom: '1.25rem', position: 'relative', display: 'inline-block', width: '100%' }}>
                  <div
                    onClick={() => setZoomImage(q.image)}
                    style={{
                      position: 'relative',
                      cursor: 'zoom-in',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1.5px solid var(--primary-200)',
                      background: 'white',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <img
                      src={q.image}
                      alt={`Diagram for ${q.title}`}
                      style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', display: 'block', padding: '0.5rem', background: 'white' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      right: '0.5rem',
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: 'white',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backdropFilter: 'blur(4px)'
                    }}>
                      <Maximize2 size={12} /> Click Diagram to Enlarge
                    </div>
                  </div>
                </div>
              )}

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

      {/* Prominent Bottom Pagination Bar */}
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
