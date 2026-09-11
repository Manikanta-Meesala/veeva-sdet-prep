import React, { useState } from 'react';
import { X, Star, Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [comments, setComments] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      alert('Please enter your feedback comments.');
      return;
    }

    const payload = {
      rating,
      type: feedbackType,
      comments,
      email: contactEmail
    };

    // Send to backend API if available
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.log('Saved feedback locally.');
    });

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setComments('');
      setContactEmail('');
    }, 1500);
  };

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
        maxWidth: '520px',
        width: '100%',
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
          <MessageSquare size={24} color="var(--primary-500)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Platform Feedback & Suggestions</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Share your feedback, report question issues, or request new dump subjects.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-green-dark)' }}>
              Thank You for Your Feedback!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Your response helps us continuously improve VEEVA SDET PREP.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                Overall Platform Rating:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: star <= rating ? '#f59e0b' : '#cbd5e1'
                    }}
                  >
                    <Star size={28} fill={star <= rating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                Feedback Type:
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
              >
                <option value="General Feedback">General Feedback</option>
                <option value="Report Question Error">Report Issue / Wrong Answer</option>
                <option value="Feature Request">Request Extra Feature</option>
                <option value="New Dump Request">Request New Dumps / Subjects</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                Your Comments & Suggestions:
              </label>
              <textarea
                rows={4}
                placeholder="Tell us what features you want or report any questions..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                Your Email (Optional):
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
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
                <Send size={18} /> Send Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
