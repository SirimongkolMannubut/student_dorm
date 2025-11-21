import LandingHeader from '@/components/landing/LandingHeader';
import Features from '@/components/landing/Features';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  return (
    <div className="landing-page">
      <LandingHeader />
      <Features />
      <LandingFooter />
    </div>
  );
}
