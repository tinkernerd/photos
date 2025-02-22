"use client";

import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { PhotoForm } from "./photo-form";
import { UploadZone } from "./upload-zone";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhotoUploaderProps {
  onUploadSuccess?: (url: string) => void;
  folder?: string;
}

export function PhotoUploader({
  onUploadSuccess,
  folder = "photos",
}: PhotoUploaderProps) {
  const { isUploading, uploadedImageUrl, exif, imageInfo, handleUpload } =
    usePhotoUpload({
      folder,
      onUploadSuccess,
    });

  if (uploadedImageUrl && imageInfo) {
    return (
      <ScrollArea className="pr-4">
        <PhotoForm exif={exif} imageInfo={imageInfo} url={uploadedImageUrl} />
      </ScrollArea>
    );
  }

  return <UploadZone isUploading={isUploading} onUpload={handleUpload} />;
}
