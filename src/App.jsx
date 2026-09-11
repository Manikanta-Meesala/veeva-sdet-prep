import React, { useState, useEffect } from 'react';
import HeaderNavbar from './components/HeaderNavbar';
import LeftSidebar from './components/LeftSidebar';
import HomeScreen from './components/HomeScreen';
import TopicStudyMode from './components/TopicStudyMode';
import PracticeQuizMode from './components/PracticeQuizMode';
import RandomQuizMode from './components/RandomQuizMode';
import AskQuestionModal from './components/AskQuestionModal';
import FeedbackModal from './components/FeedbackModal';

import initialQuestions from './data/questions.json';

export default function App() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [activeMode, setActiveMode] = useState('home'); // 'home' | 'study' | 'practice' | 'random'
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
  }, []);

  const handleSelectTopic = (topicObj) => {
    setSelectedTopic(topicObj);
    if (activeMode === 'home') {
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

    // Send to backend API if available
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
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        resetSelectedTopic={resetSelectedTopic}
        onOpenAskModal={() => setIsAskModalOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
      />

      <div className="main-content-layout">
        {/* Left Navigation Sidebar */}
        <LeftSidebar
          questions={questions}
          selectedTopic={selectedTopic}
          onSelectTopic={handleSelectTopic}
          isOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="page-body">
          {activeMode === 'home' && !selectedTopic && (
            <HomeScreen
              questions={questions}
              onStartRandomQuiz={handleStartRandomQuiz}
              onStartPracticeQuiz={handleStartPracticeQuiz}
              onSelectTopic={handleSelectTopic}
            />
          )}

          {(activeMode === 'study' || selectedTopic) && activeMode !== 'practice' && activeMode !== 'random' && (
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

      {/* Interactive Modals */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onAddQuestion={handleAddQuestion}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
}
