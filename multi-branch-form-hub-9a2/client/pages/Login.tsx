import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-gradient" />
      
      {/* Content */}
      <div className="login-content">
        {/* Logo/Title */}
        <div className="login-header">
          <h1 className="login-title">Budget Tracker</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="login-form-card">
          {/* Email Input */}
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              className="login-input"
            />
          </div>

          {/* Password Input */}
          <div className="login-form-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="login-input"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="login-spinner" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Demo Credentials */}
          <div className="login-demo-info">
            <p className="login-demo-title">Demo Credentials:</p>
            <p className="login-demo-text">
              Email: <span className="login-demo-highlight">demo@example.com</span>
            </p>
            <p className="login-demo-text">
              Password: <span className="login-demo-highlight">any password</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
