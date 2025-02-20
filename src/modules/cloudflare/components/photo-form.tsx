import { Suspense, useState } from "react";
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
import dynamic from "next/dynamic";
import type { TExifData, TImageInfo } from "@/lib/utils";
import BlurImage from "@/components/blur-image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { photosInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const MapboxComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-md border flex items-center justify-center bg-muted">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

interface PhotoFormProps {
  exif: TExifData | null;
  imageInfo: TImageInfo;
  url: string;
}

export function PhotoForm({ exif, imageInfo, url }: PhotoFormProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 39.9042, // Default to Beijing
    lng: 116.4074,
  });

  const form = useForm<z.infer<typeof photosInsertSchema>>({
    resolver: zodResolver(photosInsertSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
      isFavorite: false,
      url,
      aspectRatio: imageInfo.aspectRatio,
      width: imageInfo.width,
      height: imageInfo.height,
      blurData: imageInfo.blurhash,
      latitude: exif?.latitude ?? currentLocation.lat,
      longitude: exif?.longitude ?? currentLocation.lng,
      ...exif,
    },
  });

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

  const onSubmit = (values: z.infer<typeof photosInsertSchema>) => {
    console.log(values);
  };

  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
                      placeholder="Photo description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Fields */}
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
                        form.setValue("latitude", data.lat);
                        form.setValue("longitude", data.lng);
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
              <FormDescription>
                Drag the marker to set the photo location
              </FormDescription>
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                          setCurrentLocation((prev) => ({
                            ...prev,
                            lat: value,
                          }));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                          setCurrentLocation((prev) => ({
                            ...prev,
                            lng: value,
                          }));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

              <div className="p-4 flex flex-col gap-y-6">
                <div className="flex justify-between items-center gap-x-2">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Photo link</p>
                    <div className="flex items-center gap-x-2">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <p className="line-clamp-1 text-sm text-blue-500">
                          {url}
                        </p>
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onCopy}
                        className="shrink-0"
                        disabled={isCopied}
                      >
                        {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="isFavorite"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Favorite</FormLabel>
                    <FormDescription>
                      Mark this photo as favorite
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-end mt-6">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
