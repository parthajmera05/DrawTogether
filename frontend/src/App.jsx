// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  ClerkProvider, 
  SignIn, 
  SignUp, 
  RedirectToSignIn, 
  SignedIn, 
  SignedOut 
} from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

// Import your components
import LandingPage from './pages/LandingPage';

import Whiteboard from './pages/Whiteboard';

// Get Clerk publishable key
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
          
          {/* Protected routes */}
          
          <Route
            path="/whiteboard/:boardId"
            element={
              <>
                <SignedIn>
                  <Whiteboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;