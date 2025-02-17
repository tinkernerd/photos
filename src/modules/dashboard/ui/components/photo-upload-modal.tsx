"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { PhotoUploader } from "@/modules/cloudflare/components/photo-uploader";
import { ImagePlus } from "lucide-react";
import { useState } from "react";

export const PhotoUploadModal = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <>
      <ResponsiveModal
        title="Upload a photo"
        open={isUploading}
        onOpenChange={() => setIsUploading(false)}
      >
        <PhotoUploader />
      </ResponsiveModal>
      <Button
        onClick={() => setIsUploading(true)}
        variant="secondary"
        className="flex items-center gap-1"
      >
        <ImagePlus />
        Create
      </Button>
    </>
  );
};
