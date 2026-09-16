import React, { useState, useEffect } from 'react';
import HeaderNavbar from './components/HeaderNavbar';
import LeftSidebar from './components/LeftSidebar';
import HomeScreen from './components/HomeScreen';
import TopicStudyMode from './components/TopicStudyMode';
import PracticeQuizMode from './components/PracticeQuizMode';
import RandomQuizMode from './components/RandomQuizMode';
import CodingQuestionsMode from './components/CodingQuestionsMode';
import AskQuestionModal from './components/AskQuestionModal';
import FeedbackModal from './components/FeedbackModal';
import { Layers } from 'lucide-react';

import initialQuestions from './data/questions.json';
import initialCodingQuestions from './data/coding_questions.json';

export default function App() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [codingQuestions, setCodingQuestions] = useState(initialCodingQuestions);
  const [activeMode, setActiveMode] = useState('home'); // 'home' | 'coding' | 'study' | 'practice' | 'random'
  const [selectedTopic, setSelectedTopic] = useState(null); // { category, subtopic }
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [randomCount, setRandomCount] = useState(25);

  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      })
      .catch(err => {
        console.log('Using bundled static dataset.');
      });

    fetch('/api/coding-questions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions && data.questions.length > 0) {
          setCodingQuestions(data.questions);
        }
      })
      .catch(err => {
        console.log('Using bundled static coding dataset.');
      });
  }, []);

  const handleSelectTopic = (topicObj) => {
    setSelectedTopic(topicObj);
    if (activeMode === 'home' || activeMode === 'coding') {
      setActiveMode('study');
    }
  };

  const handleStartRandomQuiz = (count = 25) => {
    setRandomCount(count);
    setActiveMode('random');
  };

  const handleStartPracticeQuiz = () => {
    setActiveMode('practice');
  };

  const resetSelectedTopic = () => {
    setSelectedTopic(null);
  };

  const handleAddQuestion = (newQuestion) => {
    setQuestions(prev => [newQuestion, ...prev]);

    fetch('/api/questions/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion)
    }).catch(err => {
      console.log('Saved custom question to active state.');
    });
  };

  return (
    <div className="app-container">
      <HeaderNavbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        resetSelectedTopic={resetSelectedTopic}
        onOpenAskModal={() => setIsAskModalOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="main-content-layout">
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            className="mobile-sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Navigation Sidebar */}
        <LeftSidebar
          questions={questions}
          selectedTopic={selectedTopic}
          onSelectTopic={handleSelectTopic}
          onSelectCoding={() => { setActiveMode('coding'); setSelectedTopic(null); }}
          activeMode={activeMode}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Floating Open Topics Button when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            className="open-topics-btn"
            onClick={() => setIsSidebarOpen(true)}
            title="Open Topics Sidebar"
          >
            <Layers size={18} />
            <span>Topics</span>
          </button>
        )}

        {/* Main Content Area */}
        <main className="page-body">
          {activeMode === 'coding' && (
            <CodingQuestionsMode
              codingQuestions={codingQuestions}
            />
          )}

          {activeMode === 'home' && !selectedTopic && (
            <HomeScreen
              questions={questions}
              onStartRandomQuiz={handleStartRandomQuiz}
              onStartPracticeQuiz={handleStartPracticeQuiz}
              onSelectTopic={handleSelectTopic}
              onOpenCoding={() => setActiveMode('coding')}
            />
          )}

          {(activeMode === 'study' || selectedTopic) && activeMode !== 'coding' && activeMode !== 'practice' && activeMode !== 'random' && (
            <TopicStudyMode
              selectedTopic={selectedTopic}
              questions={questions}
            />
          )}

          {activeMode === 'practice' && (
            <PracticeQuizMode
              questions={questions}
              selectedTopic={selectedTopic}
              onReset={() => setSelectedTopic(null)}
            />
          )}

          {activeMode === 'random' && (
            <RandomQuizMode
              questions={questions}
              initialCount={randomCount}
              onGoHome={() => { setActiveMode('home'); resetSelectedTopic(); }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onAddQuestion={handleAddQuestion}
        questions={questions}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
}
