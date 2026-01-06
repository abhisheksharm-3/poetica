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
  Globe,
} from 'lucide-react';
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { DEVELOPER_INFO, TECH_STACK, SOCIAL_LINKS } from "@/constants/config";

interface DeveloperInfo {
  name: string;
  role: string;
  bio: string;
  expertise: readonly string[];
  website: string;
  email: string;
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

const AboutPage: React.FC = () => {
  const developerInfo: DeveloperInfo = DEVELOPER_INFO;
  const techStack = TECH_STACK;

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

          {/* How It Works - Dual Explanation */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Tabs defaultValue="simple" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="simple">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Simple Explanation
                </TabsTrigger>
                <TabsTrigger value="technical">
                  <Code2 className="mr-2 h-4 w-4" />
                  For Tech People
                </TabsTrigger>
                <TabsTrigger value="developer">
                  <User className="mr-2 h-4 w-4" />
                  About Developer
                </TabsTrigger>
              </TabsList>

              {/* Simple Explanation for Non-Tech */}
              <TabsContent value="simple" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-serif">How Poetica Works (In Simple Terms)</h3>
                      </div>

                      <div className="space-y-4 text-muted-foreground">
                        <p className="text-base leading-relaxed">
                          Think of Poetica as a poetry writing assistant that has read thousands of poems
                          and learned the patterns, rhythms, and styles that make poetry beautiful.
                        </p>

                        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">📚 Step 1: Learning from Poetry</h4>
                            <p>
                              We took a special computer program (called an AI model) that&apos;s good at understanding
                              language. We then taught it by showing it thousands of poems from a collection. Just like
                              how you learn to write by reading many books, this AI learned what makes a good poem.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">💡 Step 2: Making It Faster</h4>
                            <p>
                              The original AI was quite large and slow, like a heavy encyclopedia. We made it lighter
                              and faster (like converting that encyclopedia into a compact pocket guide) so it can
                              create poems quickly on your device without needing powerful computers.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">🎨 Step 3: Your Turn to Create</h4>
                            <p>
                              When you use Poetica, you tell it what kind of poem you want - maybe something about
                              nature, or with a happy tone, or in a specific style. The AI then uses everything it
                              learned to create an original poem just for you, combining your ideas with poetic patterns
                              it knows.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">🌐 Step 4: Bringing It Online</h4>
                            <p>
                              We put this AI on the internet (in a special container called Docker) so anyone can use
                              it. When you visit this website and click &quot;Generate&quot;, your request travels to our AI,
                              which creates your poem and sends it back to you - all happening in seconds!
                            </p>
                          </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg">
                          <p className="text-sm">
                            <strong className="text-foreground">In essence:</strong> Poetica is like having a poetry
                            expert who&apos;s read countless poems, can write in any style you want, and is always available
                            to help you create beautiful verses - all powered by smart technology that learns and improves!
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Technical Explanation */}
              <TabsContent value="technical" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-serif">Technical Architecture</h3>
                      </div>

                      <div className="space-y-4 text-muted-foreground">
                        <p className="text-base leading-relaxed font-medium text-foreground">
                          Full-stack AI poetry generation system with custom-trained GPT-2 model
                        </p>

                        <div className="space-y-5">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">1. Model Selection & Architecture</Badge>
                            </div>
                            <div className="pl-4 space-y-2 text-sm">
                              <p><strong className="text-foreground">Base Model:</strong> GPT-2 (124M parameters) from Hugging Face</p>
                              <p><strong className="text-foreground">Optimization:</strong> Stripped non-essential transformer layers to reduce model size by ~40%</p>
                              <p><strong className="text-foreground">Rationale:</strong> Balance between quality and edge-device performance</p>
                              <code className="block bg-muted p-2 rounded text-xs mt-2">
                                transformers==4.30.0, torch==2.0.1
                              </code>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">2. Training Process</Badge>
                            </div>
                            <div className="pl-4 space-y-2 text-sm">
                              <p><strong className="text-foreground">Dataset:</strong> Kaggle Poetry Corpus (~570K poems)</p>
                              <p><strong className="text-foreground">Preprocessing:</strong> Tokenization, cleaning, style/tone classification</p>
                              <p><strong className="text-foreground">Fine-tuning:</strong> 3 epochs, learning rate 2e-5, batch size 8</p>
                              <p><strong className="text-foreground">Techniques:</strong> LoRA adapters for efficient fine-tuning</p>
                              <code className="block bg-muted p-2 rounded text-xs mt-2">
                                peft, accelerate for distributed training
                              </code>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">3. Model Deployment</Badge>
                            </div>
                            <div className="pl-4 space-y-2 text-sm">
                              <p><strong className="text-foreground">Backend:</strong> FastAPI with async endpoints</p>
                              <p><strong className="text-foreground">Containerization:</strong> Docker multi-stage build for optimized image</p>
                              <p><strong className="text-foreground">Hosting:</strong> Hugging Face Spaces (CPU inference)</p>
                              <p><strong className="text-foreground">Inference:</strong> Nucleus sampling (top-p=0.9, temperature=0.8)</p>
                              <code className="block bg-muted p-2 rounded text-xs mt-2">
                                fastapi, uvicorn, python-multipart
                              </code>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">4. Frontend Integration</Badge>
                            </div>
                            <div className="pl-4 space-y-2 text-sm">
                              <p><strong className="text-foreground">Framework:</strong> Next.js 16 (App Router, React 19)</p>
                              <p><strong className="text-foreground">State Management:</strong> Zustand with persist middleware</p>
                              <p><strong className="text-foreground">UI Layer:</strong> shadcn/ui + Tailwind CSS + Framer Motion</p>
                              <p><strong className="text-foreground">API Integration:</strong> RESTful endpoints with error handling & retry logic</p>
                              <code className="block bg-muted p-2 rounded text-xs mt-2">
                                next@16.1.1, zustand@5.0.9, framer-motion@12.x
                              </code>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">5. Key Technical Features</Badge>
                            </div>
                            <div className="pl-4 space-y-2 text-sm">
                              <p>• <strong className="text-foreground">Prompt Engineering:</strong> Enhanced user prompts with style/tone conditioning</p>
                              <p>• <strong className="text-foreground">Local Storage:</strong> Browser-based poem persistence using IndexedDB</p>
                              <p>• <strong className="text-foreground">PDF Generation:</strong> Client-side jsPDF for beautiful exports</p>
                              <p>• <strong className="text-foreground">Type Safety:</strong> Full TypeScript implementation with strict mode</p>
                              <p>• <strong className="text-foreground">Performance:</strong> Code splitting, lazy loading, optimized bundle size</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                          <p className="text-sm">
                            <strong className="text-foreground">Architecture Summary:</strong> Lightweight GPT-2 derivative trained on
                            poetry corpus → FastAPI inference server in Docker → Next.js frontend with Zustand state management →
                            Client-side PDF generation. All deployed on edge infrastructure for global low-latency access.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tech Stack Details */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-serif">Full Technology Stack</h3>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <LayoutIcon className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-sm">Frontend</h4>
                          </div>
                          <div className="space-y-2 pl-6 text-sm text-muted-foreground">
                            {techStack.frontend.map((tech) => (
                              <div key={tech.name}>
                                <Badge variant="outline" className="text-xs">{tech.name}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-sm">Backend</h4>
                          </div>
                          <div className="space-y-2 pl-6 text-sm text-muted-foreground">
                            {techStack.backend.map((tech) => (
                              <div key={tech.name}>
                                <Badge variant="outline" className="text-xs">{tech.name}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-sm">AI/ML</h4>
                          </div>
                          <div className="space-y-2 pl-6 text-sm text-muted-foreground">
                            {techStack.ai.map((tech) => (
                              <div key={tech.name}>
                                <Badge variant="outline" className="text-xs">{tech.name}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-sm">Deployment</h4>
                          </div>
                          <div className="space-y-2 pl-6 text-sm text-muted-foreground">
                            <div><Badge variant="outline" className="text-xs">Docker</Badge></div>
                            <div><Badge variant="outline" className="text-xs">Hugging Face Spaces</Badge></div>
                            <div><Badge variant="outline" className="text-xs">Vercel</Badge></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Developer Content */}
              <TabsContent value="developer" className="mt-6">
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
              <Link href={SOCIAL_LINKS.github.url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" /> {SOCIAL_LINKS.github.name}
              </Link>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href={SOCIAL_LINKS.twitter.url} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z"></path>
                </svg>
                {SOCIAL_LINKS.twitter.name}
              </Link>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href={DEVELOPER_INFO.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" /> Contact Me
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
