import React, { useState, useMemo } from 'react';
import { X, Send, PlusCircle, CheckCircle, HelpCircle } from 'lucide-react';

export default function AskQuestionModal({ isOpen, onClose, onAddQuestion, questions = [] }) {
  const [category, setCategory] = useState('Java');
  const [selectedSubtopic, setSelectedSubtopic] = useState('OOPs');
  const [customSubtopic, setCustomSubtopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctLetter, setCorrectLetter] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Extract all existing subtopics grouped by Category and overall
  const { existingSubtopicsForCat, allKnownSubtopics } = useMemo(() => {
    const catMap = {};
    const globalSet = new Set(['OOPs', 'Collections - ArrayList', 'Collections - HashMap', 'General Core Java', 'Exception Handling', 'Strings & Memory']);

    questions.forEach(q => {
      const cat = q.category || 'Java';
      const sub = q.subtopic;
      if (sub) {
        globalSet.add(sub);
        if (!catMap[cat]) catMap[cat] = new Set();
        catMap[cat].add(sub);
      }
    });

    const currentCatSubs = catMap[category] ? Array.from(catMap[category]) : Array.from(globalSet);

    return {
      existingSubtopicsForCat: currentCatSubs.sort(),
      allKnownSubtopics: Array.from(globalSet)
    };
  }, [questions, category]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText || !optA || !optB) {
      alert('Please fill in the question and at least options A & B.');
      return;
    }

    // Determine subtopic name & perform case-insensitive deduplication
    let rawSubtopic = selectedSubtopic === '__NEW_CUSTOM__' ? customSubtopic : selectedSubtopic;
    rawSubtopic = (rawSubtopic || '').trim();

    // Check case-insensitively against all known subtopics in dataset
    const matchedSubtopic = allKnownSubtopics.find(
      s => s.toLowerCase() === rawSubtopic.toLowerCase()
    );

    // If case-insensitive match found, use exact existing casing (e.g. 'oops' -> 'OOPs')
    const finalSubtopic = matchedSubtopic || rawSubtopic || 'General Core';

    const options = [
      `A) ${optA}`,
      `B) ${optB}`,
      optC ? `C) ${optC}` : 'C) N/A',
      optD ? `D) ${optD}` : 'D) N/A'
    ];

    const correctIdx = ord(correctLetter) - ord('A');

    const newQuestion = {
      id: `custom_${Date.now()}`,
      category,
      subtopic: finalSubtopic,
      title: `Submitted Q`,
      question: questionText,
      code: codeSnippet,
      options,
      correctAnswer: Math.max(0, Math.min(3, correctIdx)),
      correctLetter,
      explanation: explanation || 'User submitted question dump.'
    };

    onAddQuestion(newQuestion);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reset form
      setQuestionText('');
      setCodeSnippet('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setExplanation('');
      setCustomSubtopic('');
    }, 1500);
  };

  const ord = (str) => str.charCodeAt(0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-surface-alt)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <HelpCircle size={24} color="var(--primary-500)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Submit New Question / MCQ Dump</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Add custom interview dumps or ask questions to expand the VEEVA SDET preparation database.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-green-dark)' }}>
              Question Added Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Your question has been automatically categorized and added to the practice database.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                >
                  <option value="Java">Java Core & Collections</option>
                  <option value="Software Testing">Software Testing</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Aptitude">Aptitude</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                  Subtopic / Module:
                </label>
                <select
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontWeight: '600' }}
                >
                  {existingSubtopicsForCat.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="__NEW_CUSTOM__">+ Enter New Custom Submodule...</option>
                </select>
              </div>
            </div>

            {/* Custom Submodule text input if selected */}
            {selectedSubtopic === '__NEW_CUSTOM__' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem', color: 'var(--primary-700)' }}>
                  New Submodule Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. OOPs / Multithreading / Selenium"
                  value={customSubtopic}
                  onChange={(e) => setCustomSubtopic(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-300)', background: 'var(--primary-50)' }}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  * If this topic exists under a different case (e.g. "oops"), it will automatically attach to the existing "OOPs" module.
                </span>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                Question Prompt:
              </label>
              <textarea
                rows={3}
                placeholder="Type the question text here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                Code Snippet (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="Paste code snippet if applicable..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Option A:</label>
                <input
                  type="text"
                  placeholder="Option A text"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Option B:</label>
                <input
                  type="text"
                  placeholder="Option B text"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Option C:</label>
                <input
                  type="text"
                  placeholder="Option C text"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Option D:</label>
                <input
                  type="text"
                  placeholder="Option D text"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                  Correct Choice:
                </label>
                <select
                  value={correctLetter}
                  onChange={(e) => setCorrectLetter(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontWeight: '700' }}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                  Explanation:
                </label>
                <input
                  type="text"
                  placeholder="Explain why this answer is correct..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                className="nav-btn nav-btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="nav-btn nav-btn-primary"
              >
                <PlusCircle size={18} /> Submit Question
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
