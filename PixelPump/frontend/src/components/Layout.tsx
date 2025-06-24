import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'DASHBOARD', icon: '🏠' },
    { path: '/quests', label: 'QUESTS', icon: '⚔️' },
    { path: '/achievements', label: 'ACHIEVEMENTS', icon: '🏆' },
    { path: '/profile', label: 'PROFILE', icon: '👤' },
  ];

  return (
    <div className="min-h-screen space-gradient pixel-grid-bg retro-scan-lines">
      {/* Header */}
      <header className="border-b border-[var(--pixel-grid)] bg-[var(--pixel-space)]/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center">
                <h1 className="pixel-title text-2xl text-[var(--pixel-purple)]">
                  PIXELPUMP
                </h1>
              </Link>

              <nav className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded font-pixel text-sm transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-[var(--pixel-cyan)] bg-[var(--pixel-space)] border-2 border-[var(--pixel-cyan)]'
                        : 'text-[var(--pixel-grid)] hover:text-[var(--foreground)] hover:bg-[var(--pixel-space)]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-pixel text-sm text-[var(--pixel-cyan)]">
                      {user.username}
                    </div>
                    <div className="font-pixel text-xs text-[var(--pixel-yellow)]">
                      Level {user.level} • {user.xp} XP
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--pixel-purple)] to-[var(--pixel-pink)] rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-[var(--pixel-orange)] rounded opacity-90"></div>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="font-pixel"
              >
                LOGOUT
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--pixel-space)]/90 backdrop-blur-sm border-t border-[var(--pixel-grid)]">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded font-pixel text-xs transition-all duration-200 ${
                location.pathname === item.path
                  ? 'text-[var(--pixel-cyan)]'
                  : 'text-[var(--pixel-grid)] hover:text-[var(--foreground)]'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
