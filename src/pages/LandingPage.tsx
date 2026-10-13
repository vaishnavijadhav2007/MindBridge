import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Smile, 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Compass, 
  Feather
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { CalmHeroIllustration } from '../components/illustration/CalmHeroIllustration';

export const LandingPage: React.FC = () => {
  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      id: 'mood-monitor',
      icon: Smile,
      title: 'Mood Monitor',
      description: 'Check in with your emotions and track your mood.',
      highlight: 'Daily Reflection',
      badgeColor: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
    },
    {
      id: 'ai-companion',
      icon: Sparkles,
      title: 'AI Wellness Companion',
      description: 'Get supportive answers to your mental wellness questions.',
      highlight: 'Compassionate Guidance',
      badgeColor: 'bg-[#F2ECE1] text-[#715E49] border-[#E5DBCA]'
    },
    {
      id: 'self-care',
      icon: Compass,
      title: 'Personalized Self-Care',
      description: 'Discover exercises and activities suited to your needs.',
      highlight: 'Mindful Routines',
      badgeColor: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
    },
    {
      id: 'professional-support',
      icon: UserCheck,
      title: 'Professional Support',
      description: 'Find mental health professionals when you need additional help.',
      highlight: 'Verified Therapists',
      badgeColor: 'bg-[#F4ECE4] text-[#845E45] border-[#EADACD]'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EBDD] text-[#403B35]">
      {/* Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
          {/* Subtle ambient backdrops */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline, Subheading, Action Buttons */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                
                {/* Gentle Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] text-xs font-medium text-[#56664F] shadow-soft-sm">
                  <Feather className="w-3.5 h-3.5 text-[#829675]" />
                  <span>A safe, gentle space for your emotional wellness</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#403B35] leading-[1.18]">
                    A little care for your mind <span className="text-[#829675]">goes a long way.</span>
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-[#77736B] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                    Understand your emotions, build healthier habits, and find support whenever you need it.
                  </p>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="px-7 py-3.5 text-base shadow-soft"
                    >
                      Get Started
                    </Button>
                  </Link>
                  
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={scrollToFeatures}
                    className="w-full sm:w-auto px-7 py-3.5 text-base"
                  >
                    Explore Features
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#77736B]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#829675]" />
                    <span>Free demo access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#829675]" />
                    <span>Private & confidential</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#829675]" />
                    <span>Evidence-informed habits</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Mindful Artwork */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <CalmHeroIllustration className="w-full max-w-md lg:max-w-none" />
              </div>

            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 lg:py-28 bg-[#EDE4D5]/70 border-t border-b border-[#E4DACA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#829675]">
                What We Offer
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#403B35] tracking-tight">
                Designed to nurture your daily peace of mind
              </h2>
              <p className="text-sm sm:text-base text-[#77736B] leading-relaxed">
                Simple, mindful tools created to meet you exactly where you are, without judgment or overwhelm.
              </p>
            </div>

            {/* 4 Clean Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <Card
                    key={feat.id}
                    hoverEffect
                    padding="md"
                    className="flex flex-col justify-between group h-full border-[#E4DACA] bg-[#FFFCF6]"
                  >
                    <div className="space-y-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-[#E9EFE7] text-[#829675] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-soft-sm">
                        <IconComponent className="w-6 h-6 text-[#829675]" />
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[#403B35] tracking-tight">
                          {feat.title}
                        </h3>
                        <p className="text-sm text-[#77736B] leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>

                    {/* Subtle micro tag */}
                    <div className="pt-6 mt-4 border-t border-[#F0E8DC]">
                      <span className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                        {feat.highlight}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Features callout */}
            <div className="mt-12 text-center">
              <Link to="/dashboard">
                <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4 text-[#829675]" />}>
                  Try Feature Previews in Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-20 lg:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card padding="lg" className="bg-[#FFFCF6] border-[#E4DACA] shadow-soft-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                <div className="md:col-span-8 space-y-5 text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829675]">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Our Philosophy</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
                    Your well-being matters.
                  </h2>

                  <p className="text-base text-[#77736B] leading-relaxed">
                    MindBridge helps you reflect on your feelings, discover healthy coping habits, and explore appropriate support at your own pace.
                  </p>

                  <p className="text-sm text-[#77736B] leading-relaxed">
                    We believe mental wellness is not a destination to conquer, but an ongoing conversation with oneself. Whether you have 2 minutes for mindful breathing or wish to browse certified therapists, we are here as your steady companion.
                  </p>

                  <div className="pt-2">
                    <Link to="/login">
                      <Button variant="primary" size="md">
                        Start Your Wellness Journey
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right highlight card */}
                <div className="md:col-span-4 bg-[#F3EBDD] rounded-2xl p-6 border border-[#E4DACA] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#829675] text-[#FFFCF6] flex items-center justify-center font-serif italic text-lg shadow-soft-sm">
                    “
                  </div>
                  <p className="text-sm font-medium text-[#403B35] italic leading-relaxed">
                    "Healing takes time, and asking for help is a courageous step of self-kindness."
                  </p>
                  <div className="text-xs text-[#77736B] border-t border-[#E4DACA] pt-3">
                    — The MindBridge Care Team
                  </div>
                </div>

              </div>
            </Card>
          </div>
        </section>

        {/* INVITATION CALL TO ACTION BANNER */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#829675] text-[#FFFCF6] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-soft-md text-center relative overflow-hidden">
              {/* Background ambient circular rings */}
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-xl" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#FFFCF6]">
                  Take a moment for yourself today.
                </h3>
                <p className="text-base text-[#FFFCF6]/90 leading-relaxed">
                  Join thousands of individuals taking intentional, compassionate steps toward emotional balance and calmer days.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <Link to="/login" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-7 py-3.5 bg-[#FFFCF6] text-[#403B35] hover:bg-[#FAF6EE] font-medium rounded-xl shadow-soft transition-all duration-200">
                      Explore Dashboard Demo
                    </button>
                  </Link>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-7 py-3.5 border border-[#FFFCF6]/40 text-[#FFFCF6] hover:bg-white/10 font-medium rounded-xl transition-all duration-200">
                      Create Account
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
