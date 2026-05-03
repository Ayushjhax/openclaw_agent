import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <div className="grain-overlay" />
      <PageLoader />
      <Navbar />
      <HeroSection />
      <IntroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
