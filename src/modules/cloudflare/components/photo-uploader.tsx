"use client";

import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { cloudflareR2 } from "@/lib/cloudflare-r2";
import { useDropzone } from "react-dropzone";
import { cn, formatGPSCoordinates } from "@/lib/utils";
import { DEFAULT_FOLDER, IMAGE_SIZE_LIMIT } from "@/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadCloud } from "lucide-react";
import { photosSelectSchema } from "@/db/schema";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const photoFormSchema = photosSelectSchema;

type PhotoFormValues = z.infer<typeof photoFormSchema>;

interface PhotoUploaderProps {
  onUploadSuccess?: (url: string) => void;
  folder?: string;
}

const MapboxComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-md border flex items-center justify-center bg-muted">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

export function PhotoUploader({
  onUploadSuccess,
  folder = DEFAULT_FOLDER,
}: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  const { mutateAsync: getUploadUrl } =
    trpc.cloudflare.getUploadUrl.useMutation();

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
  });

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);

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

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleUpload(file);
      }
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false,
  });

  // Memoize map values to reduce re-renders
  const mapValues = useMemo(() => {
    const longitude = currentLocation?.lng ?? 0;
    const latitude = currentLocation?.lat ?? 0;

    return {
      markers:
        longitude === 0 && latitude === 0
          ? []
          : [
              {
                id: "location",
                longitude,
                latitude,
              },
            ],
    };
  }, [currentLocation?.lat, currentLocation?.lng]);

  const onSubmit = async () => {
    if (!uploadedImageUrl) return;

    try {
      // TODO: Add your photo creation mutation here
      // await createPhoto.mutateAsync({
      //   ...data,
      //   url: uploadedImageUrl,
      // });

      toast.success("Photo details saved!");
    } catch {
      toast.error("Failed to save photo details");
    }
  };

  if (uploadedImageUrl) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-6 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Photo title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={10}
                        className="resize-none"
                        value={field.value || ""}
                        placeholder="Photo description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Map */}
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="h-[300px] w-full rounded-md overflow-hidden border">
                    <Suspense
                      fallback={
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <Skeleton className="h-full w-full" />
                        </div>
                      }
                    >
                      <MapboxComponent
                        draggableMarker
                        markers={mapValues.markers}
                        onMarkerDragEnd={(data) => {
                          setCurrentLocation({
                            lat: data.lat,
                            lng: data.lng,
                          });
                        }}
                      />
                    </Suspense>
                  </div>
                </FormControl>
                <FormDescription>
                  {currentLocation &&
                    formatGPSCoordinates(
                      currentLocation.lat,
                      currentLocation.lng
                    )}
                </FormDescription>
              </FormItem>
            </div>

            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-muted rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  {/* IMAGE  */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <Button type="submit" disabled={false}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-full size-32 bg-muted cursor-pointer",
          { "opacity-50": isUploading }
        )}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative size-32">
          <UploadCloud className="size-20 opacity-70" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h1 className={cn(isUploading && "opacity-50")}>
          Drag and drop photo file to upload
        </h1>
        <p className="text-xs text-muted-foreground">
          Your photo will be private until you publish it.
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {IMAGE_SIZE_LIMIT / 1024 / 1024} MB
        </p>
      </div>
      <Button type="button" disabled={isUploading} onClick={open}>
        Select file
      </Button>
    </div>
  );
}
