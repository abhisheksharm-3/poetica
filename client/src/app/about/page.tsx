"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    User,
    Code2,
    BookOpen,
    Github,
    Sparkles,
    Server,
    Layout as LayoutIcon,
    Cpu,
    Globe,
  } from 'lucide-react';
import Layout from "@/components/Layout/Layout";
import Link from "next/link";

interface DeveloperInfo {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const AboutPage: React.FC = () => {
  const developerInfo: DeveloperInfo = {
    name: "Abhishek Sharma",
    role: "Full-Stack Developer",
    bio: "As part of my Neural Networks major project, I developed Poetica to demonstrate practical applications of Large Language Models in creative writing and computational linguistics.",
    expertise: [
      "Neural Networks",
      "LLM Integration",
      "Full-Stack Development",
      "Natural Language Processing",
    ],
  };
  const techStack = {
    frontend: [
      { name: "Next.js", description: "React framework for production" },
      { name: "shadcn/ui", description: "UI component library" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" }
    ],
    backend: [
      { name: "FastAPI", description: "Modern Python web framework" }
    ],
    ai: [
      { name: "Gemini API", description: "Google's advanced language model" },
      { name: "PoeticaGPT", description: "Quantized local language model based on GPT2 Architecture (Experimental)" }
    ]
  };

  return (
    <Layout className="py-12">
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="space-y-12">
          {/* Header Section */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
              About Poetica
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A Neural Networks major project exploring the intersection of
              Large Language Models and creative writing, demonstrating the
              potential of AI in computational poetry.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-serif">Project Overview</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Poetica represents the culmination of my Final Year project
                    in Neural Networks, showcasing how Large Language Models can
                    be leveraged to create meaningful interactions between
                    artificial intelligence and creative writing. This project
                    demonstrates practical applications of neural networks in
                    generating and understanding poetry.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Tabs defaultValue="developer" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="developer">
                  <User className="mr-2 h-4 w-4" />
                  Developer
                </TabsTrigger>
                <TabsTrigger value="technology">
                  <Code2 className="mr-2 h-4 w-4" />
                  Technology
                </TabsTrigger>
                <TabsTrigger value="journey">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Dev Process
                </TabsTrigger>
              </TabsList>

              {/* Developer Content */}
              <TabsContent value="developer" className="mt-6">
                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUpVariant}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-xl font-serif">
                              {developerInfo.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {developerInfo.role}
                            </p>
                          </div>
                        </div>

                        <p className="text-muted-foreground">
                          {developerInfo.bio}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {developerInfo.expertise.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Technology Content */}
              <TabsContent value="technology" className="mt-6 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-serif">Technical Implementation</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Poetica combines modern web technologies with state-of-the-art AI models. 
                    The architecture leverages both cloud-based and local AI processing to 
                    ensure reliable performance while exploring cutting-edge language models.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Frontend Stack */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LayoutIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-serif">Frontend Stack</h3>
                  </div>
                  <div className="grid gap-4">
                    {techStack.frontend.map((tech) => (
                      <div key={tech.name} className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit">
                          {tech.name}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backend Stack */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-serif">Backend Stack</h3>
                  </div>
                  <div className="grid gap-4">
                    {techStack.backend.map((tech) => (
                      <div key={tech.name} className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit">
                          {tech.name}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Models */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-serif">AI Models</h3>
                  </div>
                  <div className="grid gap-4">
                    {techStack.ai.map((tech) => (
                      <div key={tech.name} className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit">
                          {tech.name}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

              {/* Journey Content */}
              <TabsContent value="journey" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <h3 className="text-xl font-serif">
                        Development Journey
                      </h3>
                      <p className="text-muted-foreground">
                        This project began as an exploration of LLMs for my
                        Final Year Neural Networks major, evolving into a
                        full-fledged application that demonstrates the practical
                        applications of neural networks in creative computing.
                        It represents the intersection of technical expertise
                        and creative expression.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="https://github.com/abhisheksharm-3/" target="_blank"><Github className="h-4 w-4" /> GitHub</Link>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="https://x.com/iabhisheksan" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z"></path></svg></Link>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="https://abhisheksan.com" target="_blank"><Globe className="h-4 w-4" /> Contact Me</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
