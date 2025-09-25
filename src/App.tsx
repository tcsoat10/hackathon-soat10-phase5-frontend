
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import { HttpClient } from './services/HttpClient';
import { AuthService } from './services/AuthService';
import { VideoService } from './services/VideoService';

// Create service instances following Dependency Injection
const httpClient = new HttpClient();
const authService = new AuthService(httpClient);
const videoService = new VideoService(httpClient);

function App() {
  return (
    <Router>
      <AuthProvider authService={authService}>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            <Route path="/login" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage videoService={videoService} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage videoService={videoService} />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
