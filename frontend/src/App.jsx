import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";



function ProtectedRoute({ children }) {
  return (
    <>
    <SignedIn>
      {children}
    </SignedIn>
     <SignedOut>
     <Navigate to="/" />  {/* Redirects to the landing page */}
    </SignedOut>
    </>
  )
}

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
   
  );
}

export default App;
