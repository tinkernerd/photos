"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_FOLDER } from "@/constants";
import { toast } from "sonner";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { useLocation } from "../hooks/useLocation";
import { PhotoForm } from "./photo-form";
import { UploadZone } from "./upload-zone";
import { photoSchema, PhotoFormData } from "../types";
import { useGetAddress } from "../hooks/use-get-address";
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

  const { currentLocation, setCurrentLocation } = useLocation({
    form,
    exif,
  });

  const { data: address } = useGetAddress({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
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
      country: address?.features[0].properties.context.country?.name,
      countryCode:
        address?.features[0].properties.context.country?.country_code,
      region: address?.features[0].properties.context.region?.name,
      city:
        address?.features[0].properties.context.country.country_code === "JP" ||
        address?.features[0].properties.context.country.country_code === "TW"
          ? address?.features[0].properties.context.region?.name
          : address?.features[0].properties.context.place?.name,
      district: address?.features[0].properties.context.locality?.name,
      fullAddress: address?.features[0].properties.full_address,
      placeFormatted: address?.features[0].properties.place_formatted,
    };

    console.log(data);

    try {
      await create.mutateAsync(data);
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
        address={address?.features[0]?.properties?.full_address}
        exif={exif}
        imageInfo={imageInfo}
        url={uploadedImageUrl}
      />
    );
  }

  return <UploadZone isUploading={isUploading} onUpload={handleUpload} />;
}
