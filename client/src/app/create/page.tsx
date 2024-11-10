"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout/Layout";
import { PoemSettings } from "@/components/PoemCreator/PoemSettings";
import { PoemEditor } from "@/components/PoemCreator/PoemEditor";
import { CreationTips } from "@/components/PoemCreator/CreationTips";
import { SaveDialog } from "@/components/PoemCreator/SaveDialog";
import { ShareDialog } from "@/components/PoemCreator/ShareDialog";
import { usePoem } from "@/hooks/usePoem";
// import { fadeUpVariant } from "@/lib/animations";

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

const CreatePage = () => {
  const {
    content,
    formState,
    isLoading,
    saveDialogOpen,
    shareDialogOpen,
    shareUrl,
    handleGenerate,
    handleGenerateFast,
    handleReset,
    handleSave,
    handleShare,
    handleCopyShareUrl,
    setContent,
    setSaveDialogOpen,
    setShareDialogOpen,
    setFormState,
    progress,
  } = usePoem();

  const [fastMode, setFastMode] = useState(false);

  const handleFastModeChange = () => {
    setFastMode((prev) => !prev);
  };

  return (
    <Layout className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl min-h-screen">
        <div className="space-y-8 mb-10">
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
            <PoemSettings formState={formState} setFormState={setFormState} />
            <PoemEditor
              content={content}
              setContent={setContent}
              isLoading={isLoading}
              onGenerateNormal={handleGenerate}
              onGenerateFast={handleGenerateFast}
              onReset={handleReset}
              onSave={handleSave}
              onShare={handleShare}
              fastMode={fastMode}
              onFastModeChange={handleFastModeChange}
              progress={progress}
            />
          </motion.div>

          <CreationTips />
        </div>
      </div>

      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        formState={formState}
        content={content}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={shareUrl}
        formState={formState}
        content={content}
        onCopy={handleCopyShareUrl}
      />
    </Layout>
  );
};

export default CreatePage;