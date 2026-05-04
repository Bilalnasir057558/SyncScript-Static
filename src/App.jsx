import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VaultDetailPage from './pages/VaultDetailPage';

function App() {
  const { currentUser, logout } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/dashboard" /> : <SignupPage />}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={currentUser ? <DashboardPage currentUser={currentUser} onLogout={logout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/vault/:vaultId"
          element={currentUser ? <VaultDetailPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
