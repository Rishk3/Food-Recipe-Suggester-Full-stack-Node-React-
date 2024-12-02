import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DishDetailsPage from './pages/DishDetailsPage';
import DishSuggesterPage from './pages/DishSuggesterPage';
import Header from './components/Header';
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        {' '}
        {/* Wrap the routes with ErrorBoundary */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dish/:name" element={<DishDetailsPage />} />
          <Route path="/suggester" element={<DishSuggesterPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
