import React, { useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { trpc } from '../lib/trpc';

const LOGO_URL = '/manus-storage/afyalink-logo_5123d512.png';

// Multi-color theme from AFyalink logo
const COLORS = {
  green: '#6BA82E',      // Primary green
  orange: '#FF9500',     // Energy orange
  darkBlue: '#1E3A5F',   // Trust dark blue
  lightBlue: '#0D5A7D',  // Accent light blue
  lightGreen: '#E8F5E9', // Light green background
  lightOrange: '#FFF3E0',// Light orange background
};

export default function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [userType, setUserType] = useState('admin'); // 'admin' | 'client'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await trpc.auth.login.mutate({
        email: formData.email,
        password: formData.password,
        userType: userType === 'admin' ? 'admin' : 'client',
      });

      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userType', userType === 'admin' ? 'admin' : 'client');
        if (onLoginSuccess) {
          onLoginSuccess(response.user, userType === 'admin' ? 'admin' : 'client');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await trpc.auth.register.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType: userType === 'admin' ? 'admin' : 'client',
      });

      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userType', userType === 'admin' ? 'admin' : 'client');
        if (onLoginSuccess) {
          onLoginSuccess(response.user, userType === 'admin' ? 'admin' : 'client');
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${COLORS.lightGreen} 0%, ${COLORS.lightOrange} 100%)`,
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}>
        {/* Header with gradient */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.darkBlue} 0%, ${COLORS.lightBlue} 100%)`,
          padding: '40px 24px',
          textAlign: 'center',
          color: 'white',
        }}>
          <img src={LOGO_URL} alt="AFyalink" style={{ height: '48px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0' }}>AFyalink</h1>
          <p style={{ fontSize: '13px', margin: '0', opacity: 0.9 }}>Wellness Centre</p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px' }}>
          {/* User Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: COLORS.darkBlue, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              I AM A:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setUserType('admin')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: `2px solid ${userType === 'admin' ? COLORS.green : '#E5E7EB'}`,
                  borderRadius: '8px',
                  background: userType === 'admin' ? COLORS.lightGreen : 'white',
                  color: userType === 'admin' ? COLORS.green : '#6B7280',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (userType !== 'admin') {
                    e.target.style.borderColor = COLORS.green;
                    e.target.style.background = COLORS.lightGreen;
                  }
                }}
                onMouseLeave={(e) => {
                  if (userType !== 'admin') {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = 'white';
                  }
                }}
              >
                Admin / Dietitian
              </button>
              <button
                onClick={() => setUserType('client')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: `2px solid ${userType === 'client' ? COLORS.orange : '#E5E7EB'}`,
                  borderRadius: '8px',
                  background: userType === 'client' ? COLORS.lightOrange : 'white',
                  color: userType === 'client' ? COLORS.orange : '#6B7280',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (userType !== 'client') {
                    e.target.style.borderColor = COLORS.orange;
                    e.target.style.background = COLORS.lightOrange;
                  }
                }}
                onMouseLeave={(e) => {
                  if (userType !== 'client') {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = 'white';
                  }
                }}
              >
                Client
              </button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#F3F4F6', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setMode('signin')}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'signin' ? COLORS.green : 'transparent',
                color: mode === 'signin' ? 'white' : '#6B7280',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'signup' ? COLORS.green : 'transparent',
                color: mode === 'signup' ? 'white' : '#6B7280',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FEE2E2',
              border: `1px solid #FECACA`,
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '13px',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'signin' ? handleLogin : handleRegister}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.darkBlue, marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required={mode === 'signup'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.darkBlue, marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: mode === 'signup' ? '16px' : '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.darkBlue, marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.darkBlue, marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required={mode === 'signup'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: COLORS.green,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => !loading && (e.target.style.background = '#5A9620')}
              onMouseLeave={(e) => !loading && (e.target.style.background = COLORS.green)}
            >
              {loading && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          background: '#F9FAFB',
          borderTop: '1px solid #E5E7EB',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6B7280',
        }}>
          By signing in, you agree to our <a href="#" style={{ color: COLORS.green, textDecoration: 'none', fontWeight: '600' }}>Terms of Service</a> and <a href="#" style={{ color: COLORS.green, textDecoration: 'none', fontWeight: '600' }}>Privacy Policy</a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
