"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_FOLDER } from "@/constants";
import { toast } from "sonner";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { useLocation } from "../hooks/useLocation";
import { PhotoForm } from "./photo-form";
import { UploadZone } from "./upload-zone";
import { photoFormSchema, PhotoFormValues } from "../types";
import { useGetAddress } from "../hooks/use-get-address";

interface PhotoUploaderProps {
  onUploadSuccess?: (url: string) => void;
  folder?: string;
}

export function PhotoUploader({
  onUploadSuccess,
  folder = DEFAULT_FOLDER,
}: PhotoUploaderProps) {
  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {},
  });

  const { isUploading, uploadedImageUrl, exif, imageInfo, handleUpload } =
    usePhotoUpload({
      folder,
      onUploadSuccess,
    });

  const { currentLocation, setCurrentLocation } = useLocation({
    form,
    exif,
  });

  const { data } = useGetAddress({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });

  const onSubmit = async (values: PhotoFormValues) => {
    if (!uploadedImageUrl) return;

    const data = {
      ...values,
      ...exif,
      ...imageInfo,
      url: uploadedImageUrl,
    };

    console.log(data);

    try {
      // await create.mutateAsync(data);
      toast.success("Photo details saved!");
    } catch {
      toast.error("Failed to save photo details");
    }
  };

  if (uploadedImageUrl) {
    return (
      <PhotoForm
        form={form}
        onSubmit={onSubmit}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        address={data?.features[0]?.properties?.full_address}
        exif={exif}
        imageInfo={imageInfo}
        url={uploadedImageUrl}
      />
    );
  }

  return <UploadZone isUploading={isUploading} onUpload={handleUpload} />;
}
