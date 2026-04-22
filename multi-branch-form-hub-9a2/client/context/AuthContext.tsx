import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  pendingOtpEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  cancelOtp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock OTP for demo - in production, this would be sent via SMS/email
const DEMO_OTP = '123456';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_token') !== null;
  });
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Simple client-side validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    // Mock authentication - in production, this would call a backend API
    // For demo purposes, any valid email/password combination works
    // Store email for OTP verification
    setPendingOtpEmail(email);
  }, []);

  const verifyOtp = useCallback(async (otp: string) => {
    if (!pendingOtpEmail) {
      throw new Error('No pending OTP verification');
    }

    if (!otp || otp.length !== 6) {
      throw new Error('OTP must be 6 digits');
    }

    // Mock OTP verification - in production, this would validate with backend
    if (otp !== DEMO_OTP) {
      throw new Error('Invalid OTP. Demo OTP is: 123456');
    }

    // OTP verified, complete authentication
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('user', JSON.stringify({ email: pendingOtpEmail }));

    setUser({ email: pendingOtpEmail });
    setPendingOtpEmail(null);
    setIsAuthenticated(true);
  }, [pendingOtpEmail]);

  const cancelOtp = useCallback(() => {
    setPendingOtpEmail(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setPendingOtpEmail(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, pendingOtpEmail, login, verifyOtp, logout, cancelOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
