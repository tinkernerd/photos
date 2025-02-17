"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";

export const PhotoUploadModal = () => {
  return (
    <>
      <ResponsiveModal
        title="Upload a photo"
        open={false}
        onOpenChange={() => {}}
      >
        <div>Upload a photo</div>
      </ResponsiveModal>
      <Button
        disabled={false}
        onClick={() => {}}
        variant="secondary"
        className="flex items-center gap-1"
      >
        {false ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus />}
        Create
      </Button>
    </>
  );
};
