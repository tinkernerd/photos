import { Suspense } from "react";
import { PhotoFormValues } from "../types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UseFormReturn } from "react-hook-form";
import dynamic from "next/dynamic";
import { ExifData, ImageInfo } from "@/features/photos/utils";
import BlurImage from "@/components/blur-image";

const MapboxComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-md border flex items-center justify-center bg-muted">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

interface PhotoFormProps {
  form: UseFormReturn<PhotoFormValues>;
  onSubmit: (values: PhotoFormValues) => Promise<void>;
  currentLocation: { lat: number; lng: number };
  setCurrentLocation: (location: { lat: number; lng: number }) => void;
  exif: ExifData | null;
  imageInfo: ImageInfo | null;
  url: string;
  address?: string | null;
}

export function PhotoForm({
  form,
  onSubmit,
  currentLocation,
  setCurrentLocation,
  exif,
  imageInfo,
  url,
  address,
}: PhotoFormProps) {
  if (!imageInfo?.blurhash) return null;

  const mapValues = {
    markers:
      currentLocation.lng === 0 && currentLocation.lat === 0
        ? []
        : [
            {
              id: "location",
              longitude: currentLocation.lng,
              latitude: currentLocation.lat,
            },
          ],
  };

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
                      rows={5}
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
                      initialViewState={{
                        longitude: currentLocation.lng,
                        latitude: currentLocation.lat,
                        zoom: 14,
                      }}
                    />
                  </Suspense>
                </div>
              </FormControl>
              <FormDescription>{address}</FormDescription>
            </FormItem>
          </div>

          <div className="flex flex-col gap-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-muted rounded-md overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative">
                <BlurImage
                  src={url}
                  alt="photo"
                  fill
                  blurhash={imageInfo.blurhash}
                  className="object-cover"
                />
              </div>

              {exif && (
                <div className="p-4">
                  <p>{JSON.stringify(exif, null, 2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-6">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
