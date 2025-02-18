import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { cloudflareR2 } from "@/lib/cloudflare-r2";
import { ExifData, getPhotoExif, getImageInfo, ImageInfo } from "@/features/photos/utils";

interface UsePhotoUploadProps {
  folder: string;
  onUploadSuccess?: (url: string) => void;
}

export function usePhotoUpload({ folder, onUploadSuccess }: UsePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [exif, setExif] = useState<ExifData | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);

  const { mutateAsync: getUploadUrl } = trpc.cloudflare.getUploadUrl.useMutation();

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const exifData = await getPhotoExif(file);
      const imageInfo = await getImageInfo(file);
      setExif(exifData);
      setImageInfo(imageInfo);

      const { publicUrl } = await cloudflareR2.upload({
        file,
        folder,
        getUploadUrl,
      });

      setUploadedImageUrl(publicUrl);
      toast.success("Photo uploaded successfully!");
      onUploadSuccess?.(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload photo"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadedImageUrl,
    exif,
    imageInfo,
    handleUpload,
  };
}
