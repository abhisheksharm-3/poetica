"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  BookOpen,
  Search,
  Lightbulb,
  BookMarked,
  Library,
  Eye,
  Sparkles
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';

const LearnPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  // Sample data for poetry resources
  const resources = [
    {
      id: 1,
      title: "Poetry Forms Guide",
      type: "Writing Guide",
      description: "Explore different poetry forms from haiku to villanelle, with examples and structural breakdowns",
      topics: ["Forms", "Structure", "Examples"],
      features: [
        "Interactive form templates",
        "Example poems for each form",
        "Writing tips"
      ]
    },
    {
      id: 2,
      title: "Poetic Devices Encyclopedia",
      type: "Literary Reference",
      description: "Comprehensive guide to metaphor, simile, alliteration, and other poetic devices in action",
      topics: ["Devices", "Techniques", "Analysis"],
      features: [
        "Device definitions",
        "Usage examples",
        "Practice exercises"
      ]
    },
    {
      id: 3,
      title: "Analysis Workshop",
      type: "Interactive Tool",
      description: "Step-by-step poetry analysis tool with annotation features and interpretation guides",
      topics: ["Analysis", "Interpretation", "Annotation"],
      features: [
        "Line-by-line analysis",
        "Theme identification",
        "Context explorer"
      ]
    }
  ];

  return (
    <Layout className="py-12">
      <div className="container mx-auto px-4 max-w-5xl py-12">
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
              Poetry Resources
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover tools and guides to deepen your understanding and mastery of poetry
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search guides, tools, and resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Tabs defaultValue="guides" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="guides">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Writing Guides
                </TabsTrigger>
                <TabsTrigger value="analysis">
                  <Eye className="mr-2 h-4 w-4" />
                  Analysis Tools
                </TabsTrigger>
                <TabsTrigger value="library">
                  <Library className="mr-2 h-4 w-4" />
                  Reference Library
                </TabsTrigger>
                <TabsTrigger value="ai-tools">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Tools
                </TabsTrigger>
              </TabsList>

              {/* Resources Grid */}
              <TabsContent value="guides" className="mt-6">
                <div className="grid gap-6">
                  {resources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      custom={index + 3}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariant}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-serif">{resource.title}</h3>
                                <Badge variant="secondary" className="mt-2">
                                  {resource.type}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="icon">
                                <BookMarked className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <p className="text-muted-foreground">
                              {resource.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              {resource.topics.map(topic => (
                                <Badge key={topic} variant="outline">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="border-t pt-4 mt-4">
                              <h4 className="text-sm font-medium mb-2">Includes:</h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {resource.features.map((feature, i) => (
                                  <li key={i} className="flex items-center text-sm text-muted-foreground">
                                    <Lightbulb className="mr-2 h-4 w-4" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex justify-end pt-2">
                              <Button>
                                <Eye className="mr-2 h-4 w-4" />
                                Explore Resource
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnPage;