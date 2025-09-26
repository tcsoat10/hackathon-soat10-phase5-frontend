import React from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Upload, List } from 'lucide-react';
import Logo from '../assets/logo_abstract_video_unpack';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 animate-slideInRight">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">
                Video Unpack
              </h1>
            </div>
            
            <nav className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="nav-link flex items-center"
              >
                <List className="w-4 h-4 mr-2" />
                Dashboard
              </a>
              <a
                href="/upload"
                className="nav-link flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-700">
                  Olá, {user.name}
                </span>
              )}
              <button
                onClick={signOut}
                className="btn-secondary flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;