import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StackPage from './pages/StackPage';
import PlayerPage from './pages/PlayerPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/" element={<Home />} />

          {/* Protected routes with layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stack/:id" element={<StackPage />} />
            <Route path="/player/:stackId" element={<PlayerPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
