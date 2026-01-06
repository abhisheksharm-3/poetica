"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Wand2,
  Settings2,
  ChevronDown,
  RotateCcw,
  Save,
  Download,
  Printer,
  Zap,
  PenLine,
  Lightbulb,
  FileText,
  Clock,
} from "lucide-react";
import { usePoem } from "@/hooks/usePoem";
import { SaveDialog } from "@/components/poem-creator/SaveDialog";
import { PoemLoadingSkeleton } from "@/components/ui/loading";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { generatePoemPDF, printPoem } from "@/utils/pdf-generator";

const fadeUpVariant = {
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

const STYLE_OPTIONS = [
  { value: "sonnet", label: "Sonnet", description: "14 lines, structured rhyme", emoji: "📜" },
  { value: "haiku", label: "Haiku", description: "3 lines, 5-7-5 syllables", emoji: "🎋" },
  { value: "free-verse", label: "Free Verse", description: "No structure, creative flow", emoji: "🌊" },
  { value: "villanelle", label: "Villanelle", description: "19 lines, repeating refrains", emoji: "🔄" },
];

const TONE_OPTIONS = [
  { value: "contemplative", label: "Contemplative", emoji: "🤔" },
  { value: "joyful", label: "Joyful", emoji: "😊" },
  { value: "melancholic", label: "Melancholic", emoji: "🌧️" },
  { value: "romantic", label: "Romantic", emoji: "❤️" },
];

const LENGTH_OPTIONS = [
  { value: "short", label: "Brief", words: "~100 words" },
  { value: "medium", label: "Standard", words: "~200 words" },
  { value: "long", label: "Extended", words: "~300 words" },
];

const WRITING_TIPS = [
  "Describe a cherished memory or moment in time",
  "Capture the essence of a season or weather",
  "Express feelings about love, loss, or hope",
  "Paint a scene from nature in vivid detail",
  "Reflect on a life lesson or personal growth",
];

export default function CreatePage() {
  const {
    content,
    title,
    formState,
    isLoading,
    isTitleLoading,
    saveDialogOpen,
    progress,
    handleGenerate,
    handleGenerateFast,
    handleGenerateTitle,
    handleReset,
    handleSave,
    setContent,
    setTitle,
    setSaveDialogOpen,
    setFormState,
  } = usePoem();

  const [fastMode, setFastMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [currentTip] = useState(() =>
    WRITING_TIPS[Math.floor(Math.random() * WRITING_TIPS.length)]
  );

  const updateFormState = <K extends keyof typeof formState>(
    key: K,
    value: (typeof formState)[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleGeneratePoem = () => {
    if (fastMode) {
      handleGenerateFast(promptText || undefined);
    } else {
      handleGenerate(promptText || undefined);
    }
    setPromptText("");
  };

  const handleDownloadPDF = () => {
    generatePoemPDF({
      title: title.trim() || "Untitled Poem",
      content,
      style: formState.style,
      emotionalTone: formState.emotionalTone,
      createdAt: new Date().toLocaleDateString(),
    });
  };

  const handlePrint = () => {
    printPoem({
      title: title.trim() || "Untitled Poem",
      content,
      style: formState.style,
      emotionalTone: formState.emotionalTone,
      createdAt: new Date().toLocaleDateString(),
    });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content.trim() ? content.trim().split(/\n/).length : 0;

  const currentStyle = STYLE_OPTIONS.find((s) => s.value === formState.style);
  const currentTone = TONE_OPTIONS.find((t) => t.value === formState.emotionalTone);
  const currentLength = LENGTH_OPTIONS.find((l) => l.value === formState.length);

  return (
    <Layout className="min-h-screen">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-4xl py-8 lg:py-12">
          <div className="space-y-8">
            {/* Header */}
            <motion.header
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                AI Poetry Studio
              </div>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
                Create Your Poem
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Describe your vision, customize the style, and let AI craft beautiful verses
              </p>
            </motion.header>

            {/* Current Settings Display */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                {currentStyle?.emoji} {currentStyle?.label}
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                {currentTone?.emoji} {currentTone?.label}
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                <FileText className="h-3 w-3" />
                {currentLength?.label}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={fastMode ? "default" : "outline"}
                      className="gap-1.5 py-1.5 px-3 cursor-pointer transition-colors"
                      onClick={() => setFastMode(!fastMode)}
                    >
                      <Zap className="h-3 w-3" />
                      {fastMode ? "Fast Mode On" : "Standard"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle fast generation mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>

            {/* Prompt Input Section */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
            >
              <Card className="overflow-hidden border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <PenLine className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">What would you like your poem to be about?</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Lightbulb className="h-3.5 w-3.5" />
                        <span className="italic">{currentTip}</span>
                      </p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Describe your theme, mood, imagery, or leave blank for a surprise..."
                    className="min-h-[100px] resize-none text-base bg-background/80 focus-visible:ring-primary/50"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    disabled={isLoading}
                  />

                  {/* Settings Toggle */}
                  <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-muted-foreground hover:text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <Settings2 className="h-4 w-4" />
                          Customize Style & Settings
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${settingsOpen ? "rotate-180" : ""
                            }`}
                        />
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-6 pt-4">
                      {/* Style Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Poem Style</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {STYLE_OPTIONS.map((style) => (
                            <button
                              key={style.value}
                              onClick={() => updateFormState("style", style.value)}
                              className={`p-3 rounded-lg border-2 text-left transition-all ${formState.style === style.value
                                  ? "border-primary bg-primary/10"
                                  : "border-muted hover:border-primary/50"
                                }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{style.emoji}</span>
                                <span className="font-medium text-sm">{style.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {style.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tone Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Emotional Tone</Label>
                        <div className="flex flex-wrap gap-2">
                          {TONE_OPTIONS.map((tone) => (
                            <button
                              key={tone.value}
                              onClick={() => updateFormState("emotionalTone", tone.value)}
                              className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 transition-all ${formState.emotionalTone === tone.value
                                  ? "border-primary bg-primary/10"
                                  : "border-muted hover:border-primary/50"
                                }`}
                            >
                              <span>{tone.emoji}</span>
                              <span className="text-sm font-medium">{tone.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Length Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Length</Label>
                        <Select
                          value={formState.length}
                          onValueChange={(value) => updateFormState("length", value)}
                        >
                          <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LENGTH_OPTIONS.map((length) => (
                              <SelectItem key={length.value} value={length.value}>
                                <div className="flex justify-between gap-4">
                                  <span>{length.label}</span>
                                  <span className="text-muted-foreground text-xs">
                                    {length.words}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Advanced Sliders */}
                      <div className="grid md:grid-cols-3 gap-6 pt-4 border-t">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label className="text-sm">Creativity</Label>
                            <span className="text-xs text-muted-foreground font-mono">
                              {formState.creativeStyle}%
                            </span>
                          </div>
                          <Slider
                            value={[formState.creativeStyle]}
                            onValueChange={([value]) =>
                              updateFormState("creativeStyle", value)
                            }
                            max={100}
                            step={1}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Classic</span>
                            <span>Experimental</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label className="text-sm">Language Richness</Label>
                            <span className="text-xs text-muted-foreground font-mono">
                              {formState.languageVariety.toFixed(1)}
                            </span>
                          </div>
                          <Slider
                            value={[formState.languageVariety]}
                            onValueChange={([value]) =>
                              updateFormState("languageVariety", value)
                            }
                            max={1}
                            step={0.1}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Simple</span>
                            <span>Elaborate</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label className="text-sm">Word Uniqueness</Label>
                            <span className="text-xs text-muted-foreground font-mono">
                              {formState.wordRepetition.toFixed(1)}
                            </span>
                          </div>
                          <Slider
                            value={[formState.wordRepetition]}
                            onValueChange={([value]) =>
                              updateFormState("wordRepetition", value)
                            }
                            min={1}
                            max={2}
                            step={0.1}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Varied</span>
                            <span>Unique</span>
                          </div>
                        </div>
                      </div>

                      {/* Fast Mode Toggle */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5">
                          <Label htmlFor="fast-mode" className="text-sm font-medium">
                            Fast Generation Mode
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Faster generation with slightly lower quality
                          </p>
                        </div>
                        <Switch
                          id="fast-mode"
                          checked={fastMode}
                          onCheckedChange={setFastMode}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Generate Button */}
                  <div className="pt-2">
                    <RainbowButton
                      className="w-full h-12 text-base font-medium gap-2"
                      onClick={handleGeneratePoem}
                      disabled={isLoading}
                    >
                      <Wand2 className="h-5 w-5" />
                      {isLoading ? "Generating..." : "Generate Poem"}
                    </RainbowButton>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Loading / Progress State */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3 p-4 bg-primary/5 rounded-lg"
                >
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  <AnimatedShinyText className="text-sm">
                    {progress || "Crafting your poem..."}
                  </AnimatedShinyText>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Editor Section */}
            <AnimatePresence>
              {(content || isLoading) && (
                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  variants={fadeUpVariant}
                  className="space-y-4"
                >
                  {/* Title Input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Enter poem title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-12 text-lg font-serif pr-12"
                        disabled={isLoading}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleGenerateTitle}
                              disabled={isTitleLoading || !content.trim()}
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                            >
                              <Sparkles
                                className={`h-4 w-4 ${isTitleLoading ? "animate-pulse" : ""}`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Generate title with AI</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Poem Content */}
                  <div className="relative">
                    {isLoading && !content ? (
                      <div className="min-h-[350px] p-6 bg-muted/30 rounded-lg border">
                        <PoemLoadingSkeleton />
                      </div>
                    ) : (
                      <Textarea
                        placeholder="Your poem will appear here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[350px] p-6 text-lg leading-relaxed font-serif resize-none bg-muted/30 focus-visible:ring-primary/50 hide-scrollbar"
                      />
                    )}

                    {/* Floating Stats */}
                    {content && !isLoading && (
                      <div className="absolute bottom-3 left-3 flex gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {wordCount} words
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lineCount} lines
                        </span>
                      </div>
                    )}

                    {/* Floating Reset */}
                    {content && !isLoading && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleReset}
                              className="absolute bottom-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reset editor</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {content && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap items-center justify-between gap-3"
                    >
                      <RainbowButton
                        className="h-10 px-6 text-sm font-medium gap-2"
                        onClick={handleGeneratePoem}
                      >
                        <Wand2 className="h-4 w-4" />
                        Regenerate
                      </RainbowButton>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleSave} className="gap-2">
                          <Save className="h-4 w-4" />
                          Save
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2">
                              <Download className="h-4 w-4" />
                              Download as PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handlePrint} className="gap-2">
                              <Printer className="h-4 w-4" />
                              Print Poem
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        formState={formState}
        content={content}
      />
    </Layout>
  );
}