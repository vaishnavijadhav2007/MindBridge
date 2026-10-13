import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { useWellness } from '../context/WellnessContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useWellness();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    // Frontend demo simulation
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Welcome back! Entering MindBridge dashboard.');
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail('sarah.chen@example.com');
    setPassword('mindful123');
    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Signed in with Demo Account!');
      navigate('/dashboard');
    }, 400);
  };

  const handleGoogleDemo = () => {
    showToast('Signed in via Google (Demo)');
    navigate('/dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      showToast('Please enter a valid email address.');
      return;
    }
    setForgotSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header / Back Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#77736B] hover:text-[#403B35] transition-colors py-1 px-2 rounded-lg hover:bg-[#EAE1D2]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
        <span className="text-xs bg-[#E9EFE7] text-[#56664F] px-2.5 py-1 rounded-full font-medium border border-[#D7E2D3]">
          Frontend Demo Mode
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <Card padding="lg" className="shadow-soft-md border-[#E4DACA] bg-[#FFFCF6]">
          
          {/* Logo & Headings */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo size="lg" linkToHome />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
                Welcome back.
              </h1>
              <p className="text-sm text-[#77736B]">
                Your space to pause, reflect, and recharge.
              </p>
            </div>
          </div>

          {/* Demo Quick-Fill Bar */}
          <div className="mb-6 bg-[#F3EBDD] border border-[#E4DACA] rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#403B35]">
              <Sparkles className="w-4 h-4 text-[#829675]" />
              <span>Want a quick test?</span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-[#829675] font-semibold hover:underline"
            >
              1-Click Demo Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#403B35]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E4DACA] text-[#829675] focus:ring-[#829675]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotSubmitted(false);
                  setShowForgotModal(true);
                }}
                className="text-[#829675] hover:underline font-medium focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                isLoading={isSubmitting}
                className="py-3 text-sm font-semibold"
              >
                Log In
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E4DACA]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FFFCF6] px-3 text-[#77736B] font-medium">or</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleDemo}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#E4DACA] rounded-xl text-sm font-medium text-[#403B35] bg-[#FFFCF6] hover:bg-[#F3EBDD]/50 transition-colors shadow-soft-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Create Account link */}
          <div className="mt-6 text-center text-xs text-[#77736B]">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-[#829675] font-semibold hover:underline">
              Create an account
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-[#F0E8DC] text-center">
            <Link to="/" className="text-xs text-[#77736B] hover:text-[#403B35]">
              Return to MindBridge Homepage
            </Link>
          </div>

        </Card>
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-[#77736B] pb-2">
        MindBridge — Frontend Demonstration • Safe and Private
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        subtitle="We will send a secure password reset link to your email."
      >
        {forgotSubmitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#E9EFE7] text-[#829675] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-[#403B35]">Reset instructions sent!</h4>
            <p className="text-sm text-[#77736B]">
              In this frontend demo, a reset email has been simulated for <strong className="text-[#403B35]">{forgotEmail}</strong>.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowForgotModal(false)}
              className="mt-2"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <Input
              label="Account email"
              type="email"
              placeholder="you@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowForgotModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
