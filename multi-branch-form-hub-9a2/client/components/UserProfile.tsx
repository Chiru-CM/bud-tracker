import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, ChevronDown, User } from 'lucide-react';

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="user-profile-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-profile-button"
      >
        <div className="user-profile-avatar">
          <User className="w-4 h-4" />
        </div>
        <div className="user-profile-info">
          <span className="user-profile-email">{user.email}</span>
          <ChevronDown className="user-profile-chevron" />
        </div>
      </button>

      {isOpen && (
        <div className="user-profile-dropdown">
          <button
            onClick={handleLogout}
            className="user-profile-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
