import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import NoteList from './pages/NoteList';
import NoteEditor from './pages/NoteEditor';
import Paraphraser from './pages/Editor';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? children : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Workspace Routes */}
        <Route path="/app" element={
          <PrivateRoute>
            <NoteList />
          </PrivateRoute>
        } />

        <Route path="/note/new" element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        } />

        <Route path="/note/:id" element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        } />

        <Route path="/ai-note" element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        } />

        {/* Legacy Tool */}
        <Route path="/tools/paraphraser" element={<Paraphraser />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
