"use client";

import { useState, useEffect } from "react";
import Hero from "../Marketing/Hero";
import HowItWorks from "../Marketing/HowItWorks";
import FeaturesSection from "../Marketing/FeaturesSection";
import DemoSection from "../Marketing/Demo";
import Layout from "../Layout/Layout";

export default function LandingPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout className=" text-foreground">
        <Hero scrollToComponent={scrollToHowItWorks} />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Demo Showcase */}
        <DemoSection />
    </Layout>
  );
}
