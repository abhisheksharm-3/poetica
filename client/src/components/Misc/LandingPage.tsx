"use client";

import Hero from "../marketing/Hero";
import HowItWorks from "../marketing/HowItWorks";
import FeaturesSection from "../marketing/FeaturesSection";
import DemoSection from "../marketing/Demo";
import Layout from "../layout/Layout";

export default function LandingPage() {
  return (
    <Layout className="text-foreground">
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <DemoSection />
    </Layout>
  );
}
