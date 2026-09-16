import React from 'react';
import { CheckCircle2, PlayCircle, Home, PlusCircle, MessageSquare, Layers, Code2 } from 'lucide-react';

export default function HeaderNavbar({
  activeMode,
  setActiveMode,
  resetSelectedTopic,
  onOpenAskModal,
  onOpenFeedbackModal,
  onOpenSidebar,
  isSidebarOpen
}) {
  return (
    <header className="header-navbar">
      <div className="brand-logo" onClick={() => { setActiveMode('home'); resetSelectedTopic(); }}>
        <div className="brand-icon">V</div>
        <div>
          <span>VEEVA SDET</span> PREP
        </div>
      </div>

      <div className="nav-actions">
        {/* Mobile Topics Button in Header */}
        {!isSidebarOpen && (
          <button
            className="mobile-header-topics-btn"
            onClick={onOpenSidebar}
            title="Open Topics Sidebar"
          >
            <Layers size={18} />
            <span>Topics</span>
          </button>
        )}

        <button
          className={`nav-btn ${activeMode === 'home' ? 'nav-btn-primary' : 'nav-btn-outline'}`}
          onClick={() => { setActiveMode('home'); resetSelectedTopic(); }}
        >
          <Home size={18} /> Home
        </button>

        <button
          className={`nav-btn ${activeMode === 'coding' ? 'nav-btn-primary' : 'nav-btn-outline'}`}
          onClick={() => setActiveMode('coding')}
          style={{
            background: activeMode === 'coding' ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'white',
            borderColor: activeMode === 'coding' ? '#1e293b' : 'var(--border-light)',
            color: activeMode === 'coding' ? '#38bdf8' : 'var(--text-main)',
            fontWeight: '700'
          }}
        >
          <Code2 size={18} color={activeMode === 'coding' ? '#38bdf8' : 'var(--primary-600)'} /> Coding Questions
        </button>

        <button
          className={`nav-btn ${activeMode === 'practice' ? 'nav-btn-primary' : 'nav-btn-outline'}`}
          onClick={() => setActiveMode('practice')}
        >
          <CheckCircle2 size={18} /> Practice Quiz
        </button>

        <button
          className={`nav-btn ${activeMode === 'random' ? 'nav-btn-primary' : 'nav-btn-outline'}`}
          onClick={() => setActiveMode('random')}
        >
          <PlayCircle size={18} /> Timed Exam
        </button>

        <button
          className="nav-btn nav-btn-outline"
          onClick={onOpenAskModal}
          style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', borderColor: 'var(--primary-100)' }}
        >
          <PlusCircle size={18} /> Submit Dump / Ask Q
        </button>

        <button
          className="nav-btn nav-btn-outline"
          onClick={onOpenFeedbackModal}
        >
          <MessageSquare size={18} /> Feedback
        </button>
      </div>
    </header>
  );
}
