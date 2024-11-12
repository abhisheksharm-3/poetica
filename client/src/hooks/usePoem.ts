/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { toast } from "sonner";
import { PoemFormState } from "@/Lib/types";

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
  const [progress, setProgress] = useState<string>(""); // For showing generation progress

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
        throw new Error("Failed to initiate poem generation");
      }

      const { jobId } = await response.json();
      const eventSource = new EventSource(`/api/poem/generate?jobId=${jobId}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.status) {
          case 'pending':
            setProgress("Generating your poem...");
            break;
            
          case 'completed':
            eventSource.close();
            setContent(data.result);
            setProgress("");
            setIsLoading(false);
            toast.success("Poem Generated", {
              description: "Feel free to edit and enhance the generated poem.",
            });
            break;
            
          case 'failed':
            eventSource.close();
            setProgress("");
            setIsLoading(false);
            toast.error("Generation Failed", {
              description: data.error || "Unable to generate poem. Please try again.",
            });
            break;
        }
      };

      eventSource.onerror = (error) => {
        eventSource.close();
        setProgress("");
        setIsLoading(false);
        toast.error("Generation Failed", {
          description: "Connection lost. Please try again.",
        });
      };

      return () => {
        eventSource.close();
      };

    } catch (error) {
      setProgress("");
      setIsLoading(false);
      toast.error("Generation Failed", {
        description: "Unable to start poem generation. Please try again.",
      });
    }
  };

  const handleGenerateFast = async (userPrompt?: string) => {
    try {
      setIsLoading(true);
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
      toast.success("Poem Generated", {
        description: "Feel free to edit and enhance the generated poem.",
      });
    } catch (error) {
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
  };

  const handleSave = async () => {
    try {
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
      toast.success("Poem Saved", {
        description: "Your poem has been saved successfully.",
      });
    } catch (error) {
      toast.error("Save Failed", {
        description: "Unable to save poem. Please try again.",
      });
    }
  };

  const handleShare = async () => {
    try {
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

      toast.success("Share Link Generated", {
        description: "Open the dialog to copy your share link.",
      });
    } catch (error) {
      toast.error("Share Failed", {
        description: "Unable to generate share link. Please try again.",
      });
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Copied to Clipboard", {
        description: "Share link has been copied successfully.",
      });
    } catch (error) {
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