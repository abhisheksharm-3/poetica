"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Feather, BarChart3, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Footer from "../Layout/Footer";
import Navbar from "../Layout/Navbar";
import Hero from "../Marketing/Hero";

export default function LandingPage() {
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
      <Navbar isScrolled={isScrolled} />

      <main>
        {/* Hero Section */}
        <Hero scrollToComponent={scrollToHowItWorks} />

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Emotional Intelligence",
                  description:
                    "Our AI understands and conveys complex human emotions in every verse.",
                },
                {
                  icon: Feather,
                  title: "Multiple Poetry Styles",
                  description:
                    "From sonnets to haiku, explore a wide range of poetic forms and structures.",
                },
                {
                  icon: BarChart3,
                  title: "Real-time Analysis",
                  description:
                    "Get instant insights into the sentiment and emotional depth of generated poems.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <feature.icon className="w-8 h-8 mb-4 text-primary" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-muted">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
              {[
                { title: "Choose mood and theme", icon: "🎭" },
                { title: "Select poetry style", icon: "📜" },
                { title: "Get AI-generated poems with analysis", icon: "🤖" },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  {index < 2 && (
                    <ChevronRight className="w-6 h-6 mt-4 text-muted-foreground md:rotate-0 rotate-90" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
