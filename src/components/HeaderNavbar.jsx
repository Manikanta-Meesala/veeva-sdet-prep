import React from 'react';
import { CheckCircle2, PlayCircle, Home, Layers, PlusCircle, MessageSquare } from 'lucide-react';

export default function HeaderNavbar({
  activeMode,
  setActiveMode,
  toggleSidebar,
  isSidebarOpen,
  resetSelectedTopic,
  onOpenAskModal,
  onOpenFeedbackModal
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
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <Layers size={18} />
          <span>{isSidebarOpen ? 'Hide Topics' : 'Show Topics'}</span>
        </button>

        <button
          className={`nav-btn ${activeMode === 'home' ? 'nav-btn-primary' : 'nav-btn-outline'}`}
          onClick={() => { setActiveMode('home'); resetSelectedTopic(); }}
        >
          <Home size={18} /> Home
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
