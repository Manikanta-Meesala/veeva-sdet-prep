import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, BookOpen, Layers, X } from 'lucide-react';

export default function LeftSidebar({ questions, selectedTopic, onSelectTopic, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Software Testing': true,
    Java: true,
    DBMS: true,
    Aptitude: true
  });

  // Group questions by Category -> Subtopic
  const tree = {};
  questions.forEach(q => {
    const cat = q.category || 'Software Testing';
    const sub = q.subtopic || 'General Core';

    if (!tree[cat]) {
      tree[cat] = { name: cat, totalCount: 0, subtopics: {} };
    }
    tree[cat].totalCount += 1;

    if (!tree[cat].subtopics[sub]) {
      tree[cat].subtopics[sub] = { name: sub, count: 0 };
    }
    tree[cat].subtopics[sub].count += 1;
  });

  const toggleCategory = (catName) => {
    setExpandedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const handleSubtopicClick = (catName, subtopicName) => {
    onSelectTopic({ category: catName, subtopic: subtopicName });
    // On mobile screens, auto-close sidebar after selection
    if (window.innerWidth <= 900) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="left-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--primary-500)" />
            <span>Topics & Modules</span>
          </div>

          {/* Close X Button inside Sidebar Header */}
          <button className="sidebar-close-btn" onClick={onClose} title="Close Navigation">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-search">
          <Search className="sidebar-search-icon" />
          <input
            type="text"
            placeholder="Search topic or module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-content">
        {Object.values(tree).map(category => {
          const matchingSubtopics = Object.values(category.subtopics).filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (matchingSubtopics.length === 0 && searchTerm) return null;

          const isExpanded = expandedCategories[category.name] || searchTerm !== '';

          return (
            <div key={category.name} className="topic-category-group">
              <div className="category-header" onClick={() => toggleCategory(category.name)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>{category.name} Dumps</span>
                </div>
                <span className="topic-badge">{category.totalCount} MCQs</span>
              </div>

              {isExpanded && (
                <ul className="subtopic-list">
                  {matchingSubtopics.map(subtopic => {
                    const isSelected = selectedTopic && selectedTopic.category === category.name && selectedTopic.subtopic === subtopic.name;
                    return (
                      <li
                        key={subtopic.name}
                        className={`subtopic-item ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSubtopicClick(category.name, subtopic.name)}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <BookOpen size={14} />
                          {subtopic.name}
                        </span>
                        <span className="topic-badge">{subtopic.count}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
