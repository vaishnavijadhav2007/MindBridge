import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useWellness } from '../context/WellnessContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useWellness();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; agree?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Welcome to MindBridge, ${name.trim()}!`);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#77736B] hover:text-[#403B35] transition-colors py-1 px-2 rounded-lg hover:bg-[#EAE1D2]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
        <span className="text-xs bg-[#E9EFE7] text-[#56664F] px-2.5 py-1 rounded-full font-medium border border-[#D7E2D3]">
          Create Account Demo
        </span>
      </div>

      <div className="max-w-md w-full mx-auto my-auto py-6">
        <Card padding="lg" className="shadow-soft-md border-[#E4DACA] bg-[#FFFCF6]">
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

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Preferred Name"
              type="text"
              placeholder="e.g. Maya"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              error={errors.name}
              leftIcon={<User className="w-4 h-4" />}
            />

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
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#403B35]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.agree) setErrors({ ...errors, agree: undefined });
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-[#E4DACA] text-[#829675] focus:ring-[#829675]"
                />
                <span>
                  I understand MindBridge is a personal self-care tool and does not substitute for clinical mental healthcare.
                </span>
              </label>
              {errors.agree && <p className="text-xs text-red-600 mt-1">{errors.agree}</p>}
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
                Create Free Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-[#77736B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#829675] font-semibold hover:underline">
              Log in instead
            </Link>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-[#77736B] pb-2">
        MindBridge — Frontend Demonstration • Safe and Private
      </div>
    </div>
  );
};
