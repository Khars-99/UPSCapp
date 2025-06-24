import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { KnowledgeBase } from './components/KnowledgeBase/KnowledgeBase';
import { TestGenerator } from './components/TestGenerator/TestGenerator';
import { CurrentAffairs } from './components/CurrentAffairs/CurrentAffairs';
import { AnswerEvaluator } from './components/AnswerEvaluator/AnswerEvaluator';

function App() {
  return (
    <CustomThemeProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/tests" element={<TestGenerator />} />
            <Route path="/current-affairs" element={<CurrentAffairs />} />
            <Route path="/evaluator" element={<AnswerEvaluator />} />
          </Routes>
        </AppLayout>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;