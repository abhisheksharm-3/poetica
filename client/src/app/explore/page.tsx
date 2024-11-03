"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Heart,
  MessageCircle,
  BookmarkPlus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Award,
  Sparkles
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';

const ExplorePage = () => {
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

  // Sample data for poems
  const poems = [
    {
      id: 1,
      title: "Whispers of Dawn",
      author: "Elena Rivers",
      excerpt: "Morning dew on petals bright,\nGolden rays pierce through the night...",
      likes: 234,
      comments: 42,
      tags: ["Nature", "Dawn", "Modern"],
      timeAgo: "2h"
    },
    {
      id: 2,
      title: "Urban Symphony",
      author: "Marcus Chen",
      excerpt: "Steel giants touch clouded skies,\nWhile subway rhythms harmonize...",
      likes: 189,
      comments: 27,
      tags: ["City", "Contemporary", "Free Verse"],
      timeAgo: "4h"
    },
    {
      id: 3,
      title: "Memories in Sepia",
      author: "Sarah O'Connor",
      excerpt: "Dusty photographs speak volumes,\nOf moments caught in amber columns...",
      likes: 312,
      comments: 56,
      tags: ["Nostalgia", "Time", "Sonnet"],
      timeAgo: "6h"
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
              Explore Poems
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover contemporary and classical poetry from around the world
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search poems, authors, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex-shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="trending" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="mr-2 h-4 w-4" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="featured">
                  <Award className="mr-2 h-4 w-4" />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="ai-enhanced">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Enhanced
                </TabsTrigger>
              </TabsList>

              {/* Poems Grid */}
              <TabsContent value="trending" className="mt-6">
                <div className="grid gap-6">
                  {poems.map((poem, index) => (
                    <motion.div
                      key={poem.id}
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
                                <h3 className="text-xl font-serif">{poem.title}</h3>
                                <p className="text-sm text-muted-foreground">by {poem.author} • {poem.timeAgo}</p>
                              </div>
                              <Button variant="ghost" size="icon">
                                <BookmarkPlus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <p className="font-serif text-muted-foreground whitespace-pre-line">
                              {poem.excerpt}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              {poem.tags.map(tag => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-4 pt-2">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Heart className="mr-2 h-4 w-4" />
                                {poem.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                {poem.comments}
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

export default ExplorePage;