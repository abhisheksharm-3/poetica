"use client"
import React, { useState, Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Heart,
  Search,
  TrendingUp,
  MessageCircle,
  Share2,
  Clock,
  Filter,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface Poem {
  id: number;
  title: string;
  excerpt: string;
  fullText: string;
  saveCount: number;
  comments: number;
  tags: string[];
  timeAgo: string;
  trending?: boolean;
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as const
    }
  })
};

// Separate component for the search params dependent part
const PoemDialog: React.FC<{ poems: Poem[], onClose: () => void }> = ({ poems, onClose }) => {
  const searchParams = useSearchParams();
  const poemId = searchParams.get('poem');
  const openPoem = poems.find(p => p.id === Number(poemId));

  if (!openPoem) return null;

  return (
    <Dialog open={!!poemId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-serif">{openPoem.title}</DialogTitle>
            {openPoem.trending && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Trending
              </Badge>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <p className="font-serif text-muted-foreground whitespace-pre-line">
            {openPoem.fullText}
          </p>

          <div className="flex flex-wrap gap-2">
            {openPoem.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Heart className="mr-2 h-4 w-4" />
              {openPoem.saveCount}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="mr-2 h-4 w-4" />
              {openPoem.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FavoritesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // Sample data for favorited poems
  const favoritedPoems: Poem[] = [
    {
      id: 1,
      title: "Whispers of Dawn",
      excerpt: "Morning dew on petals bright,\nGolden rays pierce through the night...",
      fullText: "Morning dew on petals bright,\nGolden rays pierce through the night,\nNature's canvas comes alive,\nAs the world begins to thrive.\n\nGentle breeze whispers sweet,\nWhere earth and heaven seem to meet,\nIn this moment, time stands still,\nAs dawn climbs over distant hill.",
      saveCount: 234,
      comments: 42,
      tags: ["Nature", "Dawn", "AI-Generated"],
      timeAgo: "2h",
      trending: true
    },
    {
      id: 2,
      title: "Urban Symphony",
      excerpt: "Steel giants touch clouded skies,\nWhile subway rhythms harmonize...",
      fullText: "Steel giants touch clouded skies,\nWhile subway rhythms harmonize,\nCity pulse beats day and night,\nNeon dreams take endless flight.\n\nConcrete canyons stretch so wide,\nWhere million stories reside,\nUrban life in constant flow,\nModern tales both high and low.",
      saveCount: 189,
      comments: 27,
      tags: ["City", "Contemporary", "AI-Generated"],
      timeAgo: "4h"
    },
    {
      id: 3,
      title: "Digital Dreams",
      excerpt: "Through circuits of silicon streams,\nAI weaves these poetic dreams...",
      fullText: "Through circuits of silicon streams,\nAI weaves these poetic dreams,\nData flows like liquid light,\nTransforming darkness into bright.\n\nBinary thoughts spark and grow,\nCreative currents ebb and flow,\nIn this digital renaissance,\nArt and code join in their dance.",
      saveCount: 312,
      comments: 56,
      tags: ["Technology", "AI", "Modern"],
      timeAgo: "6h",
      trending: true
    }
  ];

  const handlePoemOpen = (poem: Poem): void => {
    router.push(`?poem=${poem.id}`, { scroll: false });
  };

  const handlePoemClose = (): void => {
    router.push('?', { scroll: false });
  };

  const handleButtonClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    // Add your logic here
  };

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
              Community Favorites
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover AI-generated poems loved by the community
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
                placeholder="Search favorited poems..."
                className="pl-10"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
            <Tabs defaultValue="most-saved" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="most-saved">
                  <Heart className="mr-2 h-4 w-4" />
                  Most Saved
                </TabsTrigger>
                <TabsTrigger value="trending">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="mr-2 h-4 w-4" />
                  Recent
                </TabsTrigger>
              </TabsList>

              {/* Most Saved Poems Grid */}
              <TabsContent value="most-saved" className="mt-6">
                <div className="grid gap-6">
                  {favoritedPoems.map((poem, index) => (
                    <motion.div
                      key={poem.id}
                      custom={index + 3}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariant}
                    >
                      <Card
                        className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                        onClick={() => handlePoemOpen(poem)}
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-xl font-serif group-hover:text-primary transition-colors">{poem.title}</h3>
                                  {poem.trending && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" />
                                      Trending
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Saved {poem.timeAgo} • <span className="font-medium">{poem.saveCount} saves</span>
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleButtonClick}
                                className="text-primary hover:text-primary/80"
                              >
                                <Heart className="h-5 w-5 fill-current" />
                              </Button>
                            </div>

                            <p className="font-serif text-muted-foreground whitespace-pre-line leading-relaxed">
                              {poem.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {poem.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="px-3">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                                onClick={handleButtonClick}
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                <span className="font-medium">{poem.comments}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                                onClick={handleButtonClick}
                              >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePoemOpen(poem);
                                }}
                              >
                                Read Full Poem
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Trending Tab */}
              <TabsContent value="trending" className="mt-6">
                <div className="grid gap-6">
                  {favoritedPoems.filter(p => p.trending).map((poem, index) => (
                    <motion.div
                      key={poem.id}
                      custom={index + 3}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUpVariant}
                    >
                      <Card
                        className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                        onClick={() => handlePoemOpen(poem)}
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-xl font-serif group-hover:text-primary transition-colors">{poem.title}</h3>
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    Trending
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Saved {poem.timeAgo} • <span className="font-medium">{poem.saveCount} saves</span>
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleButtonClick}
                                className="text-primary hover:text-primary/80"
                              >
                                <Heart className="h-5 w-5 fill-current" />
                              </Button>
                            </div>

                            <p className="font-serif text-muted-foreground whitespace-pre-line leading-relaxed">
                              {poem.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {poem.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="px-3">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                                onClick={handleButtonClick}
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                <span className="font-medium">{poem.comments}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                                onClick={handleButtonClick}
                              >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePoemOpen(poem);
                                }}
                              >
                                Read Full Poem
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Recent Tab */}
              <TabsContent value="recent" className="mt-6">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-serif mb-2">No Recent Activity</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your recently viewed poems will appear here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Poem Dialog with Suspense */}
      <Suspense fallback={null}>
        <PoemDialog
          poems={favoritedPoems}
          onClose={handlePoemClose}
        />
      </Suspense>
    </Layout>
  );
};

export default FavoritesPage;