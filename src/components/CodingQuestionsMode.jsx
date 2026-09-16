import React, { useState } from 'react';
import {
  Code2,
  Search,
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Zap,
  List
} from 'lucide-react';

export default function CodingQuestionsMode({ codingQuestions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('All');
  const [activeQuestion, setActiveQuestion] = useState(null); // null means list view, else object
  const [solutionTab, setSolutionTab] = useState('optimized'); // 'brute' | 'optimized'
  const [copiedCode, setCopiedCode] = useState(false);

  // Extract unique subtopics for filtering
  const subtopics = ['All', ...new Set(codingQuestions.map(q => q.subtopic))];

  // Filter coding questions
  const filteredQuestions = codingQuestions.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.problemStatement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subtopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.dataStructure.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubtopic =
      selectedSubtopic === 'All' || q.subtopic.toLowerCase() === selectedSubtopic.toLowerCase();

    return matchesSearch && matchesSubtopic;
  });

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleNextQuestion = () => {
    if (!activeQuestion) return;
    const currentIndex = codingQuestions.findIndex(q => q.id === activeQuestion.id);
    if (currentIndex < codingQuestions.length - 1) {
      setActiveQuestion(codingQuestions[currentIndex + 1]);
      setSolutionTab('optimized');
    }
  };

  const handlePrevQuestion = () => {
    if (!activeQuestion) return;
    const currentIndex = codingQuestions.findIndex(q => q.id === activeQuestion.id);
    if (currentIndex > 0) {
      setActiveQuestion(codingQuestions[currentIndex - 1]);
      setSolutionTab('optimized');
    }
  };

  return (
    <div className="coding-questions-screen" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        color: 'white',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '20px', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.6rem' }}>
            <Code2 size={14} /> Veeva SDET Coding Suite
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
            Java Coding Questions & Algorithmic Solutions
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '750px', margin: '0.35rem 0 0 0' }}>
            Explore verified coding questions with step-by-step logic explanations, data structures used, and complete Java solutions in both Brute Force and Optimized approaches with Time & Space Complexity analysis.
          </p>
        </div>

        {activeQuestion && (
          <button
            onClick={() => setActiveQuestion(null)}
            className="nav-btn nav-btn-outline"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft size={16} /> Back to Questions List
          </button>
        )}
      </div>

      {/* Main Content: List View OR Detailed Question View */}
      {!activeQuestion ? (
        /* LIST VIEW */
        <div>
          {/* Search & Subtopic Filter Bar */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by title, concept, or data structure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Filter Module:</span>
              {subtopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedSubtopic(topic)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    border: selectedSubtopic === topic ? '1.5px solid var(--primary-500)' : '1px solid var(--border-light)',
                    background: selectedSubtopic === topic ? 'var(--primary-50)' : 'white',
                    color: selectedSubtopic === topic ? 'var(--primary-700)' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Question List Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="feature-card"
                onClick={() => { setActiveQuestion(q); setSolutionTab('optimized'); }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  border: '1.5px solid var(--border-light)',
                  transition: 'all 0.2s ease',
                  padding: '1.35rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="tag-badge" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
                      <Layers size={13} /> {q.subtopic}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      background: q.difficulty === 'Easy' ? '#dcfce7' : '#fef3c7',
                      color: q.difficulty === 'Easy' ? '#15803d' : '#b45309'
                    }}>
                      {q.difficulty || 'Medium'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.6rem', lineHeight: '1.4' }}>
                    {idx + 1}. {q.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <Cpu size={14} color="var(--primary-500)" />
                    <span style={{ fontWeight: '600' }}>Data Structure:</span> {q.dataStructure}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)', color: 'var(--primary-600)', fontWeight: '700', fontSize: '0.88rem' }}>
                  <span>Read Full Problem & Java Solution</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No coding questions match your search or filter.</p>
            </div>
          )}
        </div>
      ) : (
        /* DETAILED QUESTION VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Navigation & Title Bar */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => setActiveQuestion(null)}
                  className="nav-btn nav-btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
                >
                  <ArrowLeft size={16} /> All Questions
                </button>
                <span className="tag-badge"><Layers size={13} /> {activeQuestion.subtopic}</span>
                <span className="tag-badge" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
                  <Cpu size={13} /> {activeQuestion.dataStructure}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handlePrevQuestion}
                  disabled={codingQuestions.findIndex(q => q.id === activeQuestion.id) === 0}
                  className="nav-btn nav-btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', opacity: codingQuestions.findIndex(q => q.id === activeQuestion.id) === 0 ? 0.4 : 1 }}
                >
                  <ArrowLeft size={14} /> Prev
                </button>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  {codingQuestions.findIndex(q => q.id === activeQuestion.id) + 1} of {codingQuestions.length}
                </span>
                <button
                  onClick={handleNextQuestion}
                  disabled={codingQuestions.findIndex(q => q.id === activeQuestion.id) === codingQuestions.length - 1}
                  className="nav-btn nav-btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', opacity: codingQuestions.findIndex(q => q.id === activeQuestion.id) === codingQuestions.length - 1 ? 0.4 : 1 }}
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.5rem' }}>
              {activeQuestion.title}
            </h2>
          </div>

          {/* Section 1: Problem Statement & Test Cases */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="var(--primary-600)" /> 1. Question & Problem Statement
            </h3>
            <div
              style={{
                fontSize: '0.95rem',
                lineHeight: '1.65',
                color: '#334155',
                whiteSpace: 'pre-line',
                background: 'var(--bg-surface-alt)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--primary-500)'
              }}
            >
              {activeQuestion.problemStatement}
            </div>
          </div>

          {/* Section 2: Solution Approach & Data Structures Used */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-green-dark)" /> 2. Conceptual Solution & Data Structures Used
            </h3>
            
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#334155', marginBottom: '1.25rem' }}>
              {activeQuestion.explanation}
            </p>

            {activeQuestion.dataStructuresUsed && activeQuestion.dataStructuresUsed.length > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#166534', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={16} /> Key Data Structure(s) Employed:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#15803d' }}>
                  {activeQuestion.dataStructuresUsed.map((ds, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem', fontWeight: '600' }}>{ds}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section 3: Java Solutions (Brute Force vs. Optimized) */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={20} color="var(--primary-600)" /> 3. Complete Java Code Solution
              </h3>

              {/* Solution Approach Switcher Tabs */}
              <div style={{ display: 'flex', background: 'var(--bg-surface-alt)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <button
                  onClick={() => setSolutionTab('optimized')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    border: 'none',
                    background: solutionTab === 'optimized' ? 'white' : 'transparent',
                    color: solutionTab === 'optimized' ? 'var(--accent-green-dark)' : 'var(--text-muted)',
                    boxShadow: solutionTab === 'optimized' ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Zap size={14} /> Optimized Solution
                </button>
                <button
                  onClick={() => setSolutionTab('brute')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    border: 'none',
                    background: solutionTab === 'brute' ? 'white' : 'transparent',
                    color: solutionTab === 'brute' ? 'var(--primary-700)' : 'var(--text-muted)',
                    boxShadow: solutionTab === 'brute' ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <List size={14} /> Brute Force Solution
                </button>
              </div>
            </div>

            {/* Current Selected Solution Details */}
            {solutionTab === 'optimized' ? (
              <div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: '800', color: '#047857', fontSize: '0.95rem' }}>
                      Approach: {activeQuestion.optimized.approach}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800' }}>
                        Time: {activeQuestion.optimized.timeComplexity}
                      </span>
                      <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800' }}>
                        Space: {activeQuestion.optimized.spaceComplexity}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#065f46', margin: 0, lineHeight: '1.5' }}>
                    {activeQuestion.optimized.description}
                  </p>
                </div>

                {/* Code Block with Copy Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleCopyCode(activeQuestion.optimized.code)}
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      right: '0.85rem',
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      color: 'white',
                      padding: '0.35rem 0.7rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {copiedCode ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>

                  <pre className="code-block" style={{ margin: 0, padding: '1.25rem' }}>
                    <code>{activeQuestion.optimized.code}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: '800', color: '#1e40af', fontSize: '0.95rem' }}>
                      Approach: {activeQuestion.bruteForce.approach}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ background: '#dbeafe', color: '#1e3a8a', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800' }}>
                        Time: {activeQuestion.bruteForce.timeComplexity}
                      </span>
                      <span style={{ background: '#dbeafe', color: '#1e3a8a', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800' }}>
                        Space: {activeQuestion.bruteForce.spaceComplexity}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#1e3a8a', margin: 0, lineHeight: '1.5' }}>
                    {activeQuestion.bruteForce.description}
                  </p>
                </div>

                {/* Code Block with Copy Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleCopyCode(activeQuestion.bruteForce.code)}
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      right: '0.85rem',
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      color: 'white',
                      padding: '0.35rem 0.7rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {copiedCode ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>

                  <pre className="code-block" style={{ margin: 0, padding: '1.25rem' }}>
                    <code>{activeQuestion.bruteForce.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
