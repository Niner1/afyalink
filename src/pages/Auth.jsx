import React, { useState } from 'react';

export default function Auth() {
  const [userType, setUserType] = useState('admin');
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      if (mode === 'register' && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Simulate API call
      const userData = {
        email: formData.email,
        name: mode === 'register' ? formData.name : formData.email.split('@')[0],
        userType,
        timestamp: Date.now(),
      };

      localStorage.setItem('user', JSON.stringify(userData));
      window.location.href = userType === 'admin' ? '/dashboard' : '/client-portal';
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=code&scope=openid%20email%20profile`;
    window.location.href = authUrl;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: '#FFFFFF',
          padding: '40px 32px 32px',
          textAlign: 'center',
          borderBottom: '1px solid #E5E7EB',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 24,
            fontWeight: 700,
            margin: '0 auto 16px',
          }}>
            A
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#1F2937',
            margin: '0 0 8px',
          }}>
            AFyalink
          </h1>
          <p style={{
            fontSize: 14,
            color: '#6B7280',
            margin: 0,
          }}>
            Clinical IMS Platform
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px' }}>
          {/* User Type Selection */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 12,
            }}>
              I AM A:
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { value: 'admin', label: 'Admin / Dietitian' },
                { value: 'client', label: 'Client' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setUserType(opt.value); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: `2px solid ${userType === opt.value ? '#1E40AF' : '#E5E7EB'}`,
                    background: userType === opt.value ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    color: userType === opt.value ? '#1E40AF' : '#6B7280',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggle */}
          <div style={{
            display: 'flex',
            gap: 8,
            background: '#F3F4F6',
            padding: 4,
            borderRadius: 8,
            marginBottom: 24,
          }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setFormData({ email: '', password: '', name: '', confirmPassword: '' }); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: mode === m ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  color: mode === m ? '#1E40AF' : '#9CA3AF',
                  transition: 'all 0.2s ease',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: 12,
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              color: '#991B1B',
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name Field (Register Only) */}
            {mode === 'register' && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 6,
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#1F2937',
                    background: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1E40AF'}
                  onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#374151',
                marginBottom: 6,
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#1F2937',
                  background: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#1E40AF'}
                onBlur={e => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#374151',
                marginBottom: 6,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#1F2937',
                    background: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1E40AF'}
                  onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    fontSize: 18,
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {mode === 'register' && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 6,
                }}>
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#1F2937',
                    background: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1E40AF'}
                  onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '11px 16px',
                background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onMouseEnter={e => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={e => e.target.style.background = '#F9FAFB'}
            onMouseLeave={e => e.target.style.background = '#FFFFFF'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 32px',
          background: '#F9FAFB',
          borderTop: '1px solid #E5E7EB',
          textAlign: 'center',
          fontSize: 12,
          color: '#9CA3AF',
        }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
