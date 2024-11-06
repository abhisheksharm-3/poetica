"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Wand2, RotateCcw, Send, SaveIcon } from "lucide-react";
import Layout from "@/components/Layout/Layout";

const CreatePage = () => {
  const [content, setContent] = useState("");

  const fadeUpVariant = {
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

  return (
    <Layout className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl min-h-screen">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
              Create Your Poem
            </h1>
            <p className="text-lg text-muted-foreground">
              Blend classical traditions with modern AI assistance
            </p>
          </motion.div>

          {/* Main Creation Interface */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Settings Panel */}
            <Card className="lg:col-span-1 h-fit">
              <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Poem Style</label>
                <Select defaultValue="sonnet">
                <SelectTrigger>
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sonnet">Sonnet</SelectItem>
                  <SelectItem value="haiku">Haiku</SelectItem>
                  <SelectItem value="free-verse">Free Verse</SelectItem>
                  <SelectItem value="villanelle">Villanelle</SelectItem>
                </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Emotional Tone</label>
                <Select defaultValue="contemplative">
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contemplative">
                  Thoughtful
                  </SelectItem>
                  <SelectItem value="joyful">Uplifting</SelectItem>
                  <SelectItem value="melancholic">Wistful</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">
                Creative Style
                </label>
                <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                <span>Classic</span>
                <span>Modern</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">
                Language Variety
                </label>
                <Slider
                defaultValue={[0.9]}
                max={1}
                step={0.1}
                className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                <span>Simple</span>
                <span>Rich</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Length</label>
                <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Choose length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Brief (100 words)</SelectItem>
                  <SelectItem value="medium">Standard (200 words)</SelectItem>
                  <SelectItem value="long">Extended (300 words)</SelectItem>
                </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Word Repetition</label>
                <Slider
                defaultValue={[1.2]}
                min={1}
                max={2}
                step={0.1}
                className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                <span>Allow</span>
                <span>Minimize</span>
                </div>
              </div>
              </CardContent>
            </Card>

            {/* Writing Area */}
            <Card className="lg:col-span-2">
              <CardContent className="space-y-4 pt-6">
                <Textarea
                  placeholder="Wait for AI to generate a poem for you... then enhance it!"
                  className="min-h-[300px] resize-none font-serif text-lg leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex flex-wrap gap-3">
                  <Button className="group">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                  <Button variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Enhance
                  </Button>
                  <Button variant="outline">
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips Section */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="border-l-2 border-gray-200 pl-6 space-y-4"
            >
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                Tips for Getting the Best AI-Generated Poems
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <p>• Set higher Creative Style (70-90) for innovative, contemporary expressions</p>
                <p>• Keep Language Variety above 0.7 for rich vocabulary and metaphors</p>
                <p>• Match Emotional Tone to your theme (e.g., Romantic for love poems)</p>
                <p>• Choose Word Repetition closer to 2 for more varied language</p>
                <p>• Try Sonnet style for structured, emotional narratives</p>
                <p>• Use Free Verse for more experimental, modern poetry</p>
                <p>• Combine thoughtful tone with rich language for deeper meanings</p>
                <p>• Start with Standard length and adjust based on complexity</p>
                <p>• Use Haiku style for nature-themed or minimalist expressions</p>
                <p>• Select Villanelle for poems with recurring themes</p>
                <p>• Experiment with different style-tone combinations</p>
                <p>• Generate multiple versions to find the perfect match</p>
              </div>
            </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePage;
