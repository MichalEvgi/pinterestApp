import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage'; 
import FeedPage from './components/FeedPage';
import PersonalArea from "./components/PersonalArea";
import CreateMedia from "./components/CreateMedia";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/personal-area" element={<PersonalArea />} />
          <Route path="/create" element={<CreateMedia />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
