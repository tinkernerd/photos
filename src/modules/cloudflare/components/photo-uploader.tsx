"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_FOLDER } from "@/constants";
import { toast } from "sonner";
import { usePhotoUpload } from "../hooks/usePhotoUpload";

import { PhotoForm } from "./photo-form";
import { UploadZone } from "./upload-zone";
import { photoSchema, PhotoFormData } from "../types";
import { trpc } from "@/trpc/client";

interface PhotoUploaderProps {
  onUploadSuccess?: (url: string) => void;
  folder?: string;
}

export function PhotoUploader({
  onUploadSuccess,
  folder = DEFAULT_FOLDER,
}: PhotoUploaderProps) {
  const form = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const create = trpc.photos.create.useMutation();

  const { isUploading, uploadedImageUrl, exif, imageInfo, handleUpload } =
    usePhotoUpload({
      folder,
      onUploadSuccess,
    });

  const onSubmit = async (values: PhotoFormData) => {
    if (!uploadedImageUrl || !imageInfo) return;

    const data = {
      title: values.title,
      description: values.description,
      aspectRatio: imageInfo.aspectRatio,
      width: imageInfo.width,
      height: imageInfo.height,
      blurData: imageInfo.blurhash,
      make: exif?.make,
      model: exif?.model,
      lensModel: exif?.lensModel,
      focalLength: exif?.focalLength,
      focalLength35mm: exif?.focalLength35mm,
      fNumber: exif?.fNumber,
      iso: exif?.iso,
      exposureTime: exif?.exposureTime,
      exposureCompensation: exif?.exposureCompensation,
      latitude: exif?.latitude ?? values.latitude,
      longitude: exif?.longitude ?? values.longitude,
      gpsAltitude: exif?.gpsAltitude,
      dateTimeOriginal: exif?.dateTimeOriginal?.toString() ?? null,
      url: uploadedImageUrl,
    };

    console.log(data);

    try {
      await create.mutateAsync(data);
      toast.success("Photo details saved!");
    } catch {
      toast.error("Failed to save photo details");
    }
  };

  if (uploadedImageUrl && imageInfo) {
    return (
      <PhotoForm
        form={form}
        onSubmit={onSubmit}
        exif={exif}
        imageInfo={imageInfo}
        url={uploadedImageUrl}
      />
    );
  }

  return <UploadZone isUploading={isUploading} onUpload={handleUpload} />;
}
