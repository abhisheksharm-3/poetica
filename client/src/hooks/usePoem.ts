/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { toast } from "sonner";
import { PoemFormState } from "@/utils/types";

const DEFAULT_FORM_STATE: PoemFormState = {
  style: "sonnet",
  emotionalTone: "contemplative",
  creativeStyle: 50,
  languageVariety: 0.9,
  length: "medium",
  wordRepetition: 1.2,
};

export const usePoem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [formState, setFormState] = useState<PoemFormState>(DEFAULT_FORM_STATE);
  const [progress, setProgress] = useState<string>("");

  const handleGenerate = async (userPrompt?: string) => {
    try {
      setIsLoading(true);
      setContent(""); // Clear any existing content
      setProgress("Starting poem generation..."); // Initial progress message

      const response = await fetch("/api/poem/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          userPrompt, // Include the user's prompt if provided
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate poem");
      }

      setProgress("Processing poem...");
      const data = await response.json();
      setContent(data.poem.content);
      setProgress("");
      
      toast.success("Poem Generated", {
        description: "Feel free to edit and enhance the generated poem.",
      });
    } catch (error) {
      setProgress("");
      toast.error("Generation Failed", {
        description: "Unable to generate poem. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFast = async (userPrompt?: string) => {
    try {
      setIsLoading(true);
      setProgress("Generating your poem..."); // Progress for fast generation

      const response = await fetch("/api/poem/generate-fast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          userPrompt, // Include the user's prompt if provided
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate poem");
      }

      const data = await response.json();
      setContent(data.poem);
      setProgress("");
      
      toast.success("Poem Generated", {
        description: "Feel free to edit and enhance the generated poem.",
      });
    } catch (error) {
      setProgress("");
      toast.error("Generation Failed", {
        description: "Unable to generate poem. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContent("");
    setFormState(DEFAULT_FORM_STATE);
    setProgress("");
  };

  const handleSave = async () => {
    try {
      setProgress("Saving poem...");
      const response = await fetch("/api/poem/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ...formState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save poem");
      }

      setSaveDialogOpen(true);
      setProgress("");
      toast.success("Poem Saved", {
        description: "Your poem has been saved successfully.",
      });
    } catch (error) {
      setProgress("");
      toast.error("Save Failed", {
        description: "Unable to save poem. Please try again.",
      });
    }
  };

  const handleShare = async () => {
    try {
      setProgress("Generating share link...");
      const response = await fetch("/api/poem/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ...formState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to share poem");
      }

      const data = await response.json();
      setShareUrl(data.shareUrl);
      setShareDialogOpen(true);
      setProgress("");

      toast.success("Share Link Generated", {
        description: "Open the dialog to copy your share link.",
      });
    } catch (error) {
      setProgress("");
      toast.error("Share Failed", {
        description: "Unable to generate share link. Please try again.",
      });
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      setProgress("Copying to clipboard...");
      await navigator.clipboard.writeText(shareUrl);
      setProgress("");
      
      toast.success("Copied to Clipboard", {
        description: "Share link has been copied successfully.",
      });
    } catch (error) {
      setProgress("");
      toast.error("Copy Failed", {
        description: "Unable to copy link. Please try again.",
      });
    }
  };

  return {
    content,
    formState,
    isLoading,
    saveDialogOpen,
    shareDialogOpen,
    shareUrl,
    progress,
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
  };
};