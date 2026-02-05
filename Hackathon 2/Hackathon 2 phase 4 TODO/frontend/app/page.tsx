import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import SpecsSection from "@/components/landing/SpecsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features / Specs Section */}
      <SpecsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
