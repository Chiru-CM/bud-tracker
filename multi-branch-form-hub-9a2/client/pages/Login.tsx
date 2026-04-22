import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, verifyOtp, pendingOtpEmail, cancelOtp } = useAuth();

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await verifyOtp(otp);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Show OTP verification screen
  if (pendingOtpEmail) {
    return (
      <div className="login-container">
        <div className="login-gradient" />

        {/* Content */}
        <div className="login-content">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">Verify Your Identity</h1>
            <p className="login-subtitle">Enter the code from your authenticator app</p>
          </div>

          {/* OTP Form Card */}
          <form onSubmit={handleOtpSubmit} className="login-form-card">
            {/* Email Display */}
            <div className="otp-email-display">
              <p className="otp-email-label">Verifying:</p>
              <p className="otp-email-text">{pendingOtpEmail}</p>
            </div>

            {/* OTP Input */}
            <div className="login-form-group">
              <label htmlFor="otp" className="login-label">
                Authentication Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                disabled={isLoading}
                className="login-input otp-input"
              />
              <p className="otp-input-hint">Enter the 6-digit code</p>
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
              disabled={isLoading || otp.length !== 6}
              className="login-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="login-spinner" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                cancelOtp();
                setEmail('');
                setPassword('');
                setOtp('');
                setError('');
              }}
              className="otp-back-button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            {/* Demo OTP */}
            <div className="login-demo-info">
              <p className="login-demo-title">Demo OTP Code:</p>
              <p className="login-demo-text">
                Code: <span className="login-demo-highlight">123456</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show login form
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
        <form onSubmit={handleLoginSubmit} className="login-form-card">
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
