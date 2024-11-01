"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Footer from "../Layout/Footer";
import Hero from "../Marketing/Hero";
import { DockedNavbar } from "../Layout/DockedNavbar";
import HowItWorks from "../Marketing/HowItWorks";
import FeaturesSection from "../Marketing/FeaturesSection";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      {/* <Navbar isScrolled={isScrolled} /> */}
      <DockedNavbar />

      <main>
        {/* Hero Section */}
        <Hero scrollToComponent={scrollToHowItWorks} />

        {/* Features Section */}
<FeaturesSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Demo Showcase */}
        <section id="demo" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Demo Showcase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Generated Poem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg italic">
                      In twilight&apos;s embrace, whispers unfold,
                      <br />
                      Echoes of dreams, stories untold.
                      <br />
                      Moonlit shadows dance and sway,
                      <br />
                      As night&apos;s symphony begins to play.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Emotion Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Joy</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Serenity</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Wonder</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-xl">
                Generation Speed: <span className="font-bold">1.2 seconds</span>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
