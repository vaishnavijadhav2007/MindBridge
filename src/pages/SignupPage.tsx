import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, Info } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useWellness } from '../context/WellnessContext';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useWellness();
  const { signUp, user, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; agree?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const newErrors: { name?: string; email?: string; password?: string; agree?: string } = {};

    if (!name.trim()) newErrors.name = 'Please enter your preferred name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!agreeTerms) {
      newErrors.agree = 'Please agree to the wellness community terms.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    if (isConfigured) {
      const { error, requiresEmailConfirmation } = await signUp(email, password, name);
      setIsSubmitting(false);

      if (error) {
        setFormError(error);
        return;
      }

      if (requiresEmailConfirmation) {
        setEmailConfirmationRequired(true);
        showToast('Confirmation email sent.');
      } else {
        showToast(`Welcome to MindBridge, ${name.trim()}!`);
        navigate('/dashboard', { replace: true });
      }
    } else {
      // Demo mode fallback
      setTimeout(() => {
        setIsSubmitting(false);
        showToast(`Welcome to MindBridge, ${name.trim()}! (Demo)`);
        navigate('/dashboard', { replace: true });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#77736B] hover:text-[#403B35] transition-colors py-1 px-2 rounded-lg hover:bg-[#EAE1D2]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium border flex items-center gap-1.5 ${
            isConfigured
              ? 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
              : 'bg-[#FAF3E7] text-[#8C6D4F] border-[#E8DBCA]'
          }`}
        >
          {isConfigured ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#829675]" />
              <span>Real Account Creation</span>
            </>
          ) : (
            <>
              <Info className="w-3.5 h-3.5 text-[#C59B7E]" />
              <span>Demo Mode</span>
            </>
          )}
        </span>
      </div>

      <div className="max-w-md w-full mx-auto my-auto py-6">
        <Card padding="lg" className="shadow-soft-md border-[#E4DACA] bg-[#FFFCF6]">
          {/* Logo & Headings */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo size="lg" linkToHome />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
                Begin your journey.
              </h1>
              <p className="text-sm text-[#77736B]">
                Create your private space for mindful reflection.
              </p>
            </div>
          </div>

          {/* Email Confirmation Screen */}
          {emailConfirmationRequired ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#E9EFE7] text-[#56664F] flex items-center justify-center mx-auto border border-[#D7E2D3]">
                <Mail className="w-7 h-7 text-[#829675]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#403B35]">Check your inbox</h3>
                <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed max-w-sm mx-auto">
                  We've sent a verification email to <strong className="text-[#403B35]">{email}</strong>. Please click the confirmation link to activate your account.
                </p>
              </div>

              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="md">
                    Return to Log In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {formError && (
                <div className="mb-5 p-3.5 rounded-xl bg-[#FEF0F0] border border-[#EDBBBB] text-xs text-[#C0392B] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label="Preferred Name"
                  type="text"
                  placeholder="e.g. Maya"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                    if (formError) setFormError(null);
                  }}
                  error={errors.name}
                  leftIcon={<User className="w-4 h-4" />}
                  autoComplete="name"
                />

                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                    if (formError) setFormError(null);
                  }}
                  error={errors.email}
                  leftIcon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                />

                <Input
                  label="Create a password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                    if (formError) setFormError(null);
                  }}
                  error={errors.password}
                  leftIcon={<Lock className="w-4 h-4" />}
                  autoComplete="new-password"
                />

                <div className="space-y-1 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#77736B]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#E4DACA] text-[#829675] focus:ring-[#829675]"
                    />
                    <span>
                      I understand that MindBridge is an AI wellness companion, not a clinical therapy service or crisis hotline.
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="text-xs text-[#C0392B] pl-6">{errors.agree}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="md"
                    isLoading={isSubmitting}
                    className="py-3 text-sm font-semibold"
                  >
                    Create Account
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-[#77736B]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#829675] font-semibold hover:underline">
                  Log in
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F0E8DC] text-center">
                <Link to="/" className="text-xs text-[#77736B] hover:text-[#403B35]">
                  Return to MindBridge Homepage
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="text-center text-xs text-[#77736B] pb-2">
        MindBridge — Mental Wellness Companion • Secure & Private
      </div>
    </div>
  );
};
