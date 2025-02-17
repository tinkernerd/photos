"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/trpc/client";
import { Loader2, Upload } from "lucide-react";
import { cloudflareR2 } from "@/lib/cloudflare-r2";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const photoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
});

type PhotoFormValues = z.infer<typeof photoFormSchema>;

interface PhotoUploaderProps {
  onUploadSuccess?: (url: string) => void;
  folder?: string;
}

export function PhotoUploader({
  onUploadSuccess,
  folder = DEFAULT_FOLDER,
}: PhotoUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { mutateAsync: getUploadUrl, isPending: isGettingUrl } =
    trpc.cloudflare.getUploadUrl.useMutation();

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);

      const { publicUrl } = await cloudflareR2.upload({
        file,
        folder,
        onProgress: setProgress,
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
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const isLoading = isGettingUrl || isUploading;
  const loadingText = isGettingUrl
    ? "Preparing upload..."
    : isUploading
    ? "Uploading..."
    : "Upload Photo";

  if (uploadedImageUrl) {
    const steps = [
      {
        title: "详细信息",
        active: true,
        completed: false,
      },
      {
        title: "视频元素",
        active: false,
        completed: false,
      },
      {
        title: "检查",
        active: false,
        completed: false,
      },
      {
        title: "公开范围",
        active: false,
        completed: false,
      },
    ];

    return (
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="relative">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    step.active
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white"
                  )}
                >
                  {step.completed ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm",
                    step.active ? "text-primary" : "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full">
            <div className="h-[2px] bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>标题（必填）</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="为你的照片添加标题"
                          {...field}
                          className="h-12"
                        />
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
                      <FormLabel>说明</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="向观看者介绍你的视频（输入 @ 可提及某个频道）"
                          {...field}
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>位置</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="添加拍摄地点"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUploadedImageUrl(null)}
                  >
                    重新上传
                  </Button>
                  <Button type="submit">保存</Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Column - Image Preview */}
          <div className="space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 border">
              <img
                src={uploadedImageUrl}
                alt="Uploaded photo"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <p className="text-sm font-medium">文件名</p>
              <p className="text-sm text-gray-500 break-all">
                {uploadedImageUrl?.split("/").pop()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600",
          isDragActive && "border-primary bg-primary/5",
          isLoading && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-gray-500 mb-3" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {loadingText}
              </p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-500 mb-3" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {isDragActive ? (
                  "Drop the photo here"
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG or GIF (MAX. {IMAGE_SIZE_LIMIT / 1024 / 1024}MB)
              </p>
            </>
          )}
        </div>
      </div>

      {isUploading && progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="h-1" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
