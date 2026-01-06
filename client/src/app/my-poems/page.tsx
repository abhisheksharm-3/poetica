"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Heart,
  Search,
  Trash2,
  Edit,
  Clock,
  Filter,
  BookMarked,
  AlertCircle,
  X,
} from "lucide-react";
import { usePoemStore } from "@/store/usePoemStore";
import { SavedPoem } from "@/utils/types";
import { fadeUpVariant } from "@/utils/animations";
import { toast } from "sonner";
import Link from "next/link";


const STYLE_OPTIONS = ["sonnet", "haiku", "free-verse", "villanelle"];
const TONE_OPTIONS = ["contemplative", "joyful", "melancholic", "romantic"];
const LENGTH_OPTIONS = ["short", "medium", "long"];

const MyPoemsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPoem, setSelectedPoem] = useState<SavedPoem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [poemToDelete, setPoemToDelete] = useState<string | null>(null);

  // Filter state
  const [styleFilter, setStyleFilter] = useState<string | null>(null);
  const [toneFilter, setToneFilter] = useState<string | null>(null);
  const [lengthFilter, setLengthFilter] = useState<string | null>(null);

  const { poems, favorites, deletePoem, toggleFavorite, isFavorite, getFavorites } = usePoemStore();

  const activeFiltersCount = [styleFilter, toneFilter, lengthFilter].filter(Boolean).length;

  const handleDeleteClick = (id: string) => {
    setPoemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (poemToDelete) {
      deletePoem(poemToDelete);
      toast.success("Poem deleted successfully");
      setDeleteConfirmOpen(false);
      setPoemToDelete(null);
      if (selectedPoem?.id === poemToDelete) {
        setSelectedPoem(null);
      }
    }
  };

  const handlePoemClick = (poem: SavedPoem) => {
    setSelectedPoem(poem);
  };

  const handleFavoriteToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
    toast.success(isFavorite(id) ? "Removed from favorites" : "Added to favorites");
  };

  const clearAllFilters = () => {
    setStyleFilter(null);
    setToneFilter(null);
    setLengthFilter(null);
  };

  const filteredPoems = useMemo(() => {
    return poems.filter((poem) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          poem.content.toLowerCase().includes(query) ||
          poem.title?.toLowerCase().includes(query) ||
          poem.style.toLowerCase().includes(query) ||
          poem.emotionalTone.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Style filter
      if (styleFilter && poem.style !== styleFilter) return false;

      // Tone filter
      if (toneFilter && poem.emotionalTone !== toneFilter) return false;

      // Length filter
      if (lengthFilter && poem.length !== lengthFilter) return false;

      return true;
    });
  }, [poems, searchQuery, styleFilter, toneFilter, lengthFilter]);

  const favoritePoems = getFavorites();


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const PoemCard = ({ poem }: { poem: SavedPoem }) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariant}
      custom={0}
    >
      <Card
        className="hover:shadow-md transition-all cursor-pointer group"
        onClick={() => handlePoemClick(poem)}
      >
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-serif line-clamp-1">
                    {poem.title || "Untitled Poem"}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(poem.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleFavoriteToggle(e, poem.id)}
                  className="h-8 w-8"
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(poem.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(poem.id);
                  }}
                  className="h-8 w-8 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="font-serif text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
              {poem.content}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{poem.style}</Badge>
              <Badge variant="secondary">{poem.emotionalTone}</Badge>
              <Badge variant="outline">{poem.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmptyState = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
    <motion.div
      custom={0}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariant}
      className="flex flex-col items-center justify-center py-16 space-y-4"
    >
      <div className="rounded-full bg-muted p-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/create">Create Your First Poem</Link>
      </Button>
    </motion.div>
  );

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
              My Poems
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personal collection of AI-generated poetry
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          {poems.length > 0 && (
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
                  placeholder="Search your poems..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0 gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filter Poems</h4>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs">
                          <X className="h-3 w-3 mr-1" />
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Style Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Style</label>
                      <div className="flex flex-wrap gap-1.5">
                        {STYLE_OPTIONS.map((style) => (
                          <Badge
                            key={style}
                            variant={styleFilter === style ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => setStyleFilter(styleFilter === style ? null : style)}
                          >
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tone Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Tone</label>
                      <div className="flex flex-wrap gap-1.5">
                        {TONE_OPTIONS.map((tone) => (
                          <Badge
                            key={tone}
                            variant={toneFilter === tone ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => setToneFilter(toneFilter === tone ? null : tone)}
                          >
                            {tone}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Length Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Length</label>
                      <div className="flex flex-wrap gap-1.5">
                        {LENGTH_OPTIONS.map((length) => (
                          <Badge
                            key={length}
                            variant={lengthFilter === length ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => setLengthFilter(lengthFilter === length ? null : length)}
                          >
                            {length}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}

          {/* Tabs Section */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">
                  <BookMarked className="mr-2 h-4 w-4" />
                  All Poems ({poems.length})
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites ({favorites.length})
                </TabsTrigger>
              </TabsList>

              {/* All Poems Tab */}
              <TabsContent value="all" className="mt-6">
                {filteredPoems.length === 0 ? (
                  poems.length === 0 ? (
                    <EmptyState
                      icon={BookMarked}
                      title="No poems yet"
                      description="Start creating beautiful poetry with AI assistance. Your poems will be saved here automatically."
                    />
                  ) : (
                    <EmptyState
                      icon={Search}
                      title="No poems found"
                      description="Try adjusting your search query to find what you're looking for."
                    />
                  )
                ) : (
                  <div className="grid gap-6">
                    {filteredPoems.map((poem) => (
                      <PoemCard key={poem.id} poem={poem} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="mt-6">
                {favoritePoems.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="No favorite poems"
                    description="Mark your favorite poems by clicking the heart icon. They'll appear here for quick access."
                  />
                ) : (
                  <div className="grid gap-6">
                    {favoritePoems.map((poem) => (
                      <PoemCard key={poem.id} poem={poem} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Poem Detail Dialog */}
      <Dialog open={!!selectedPoem} onOpenChange={() => setSelectedPoem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedPoem && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <DialogTitle className="text-2xl font-serif">
                      {selectedPoem.title || "Untitled Poem"}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Created on {formatDate(selectedPoem.createdAt)}
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toggleFavorite(selectedPoem.id);
                      toast.success(
                        isFavorite(selectedPoem.id)
                          ? "Removed from favorites"
                          : "Added to favorites"
                      );
                    }}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite(selectedPoem.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                        }`}
                    />
                  </Button>
                </div>
              </DialogHeader>
              <div className="space-y-6">
                <p className="font-serif text-base leading-relaxed whitespace-pre-line">
                  {selectedPoem.content}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedPoem.style}</Badge>
                  <Badge variant="secondary">{selectedPoem.emotionalTone}</Badge>
                  <Badge variant="outline">{selectedPoem.length}</Badge>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeleteClick(selectedPoem.id);
                    setSelectedPoem(null);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/create">
                    <Edit className="mr-2 h-4 w-4" />
                    Create Similar
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Poem
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this poem? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MyPoemsPage;
