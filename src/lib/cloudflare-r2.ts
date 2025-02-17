import { IMAGE_SIZE_LIMIT } from "@/constants";

interface UploadToR2Options {
  file: File;
  folder: string;
  onProgress?: (progress: number) => void;
  getUploadUrl: (input: {
    filename: string;
    contentType: string;
    folder: string;
  }) => Promise<{ uploadUrl: string; publicUrl: string }>;
}

interface UploadToR2Result {
  publicUrl: string;
}

class UploadError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "UploadError";
  }
}

export class CloudflareR2Client {
  /**
   * 生成唯一的文件名
   * @param originalFilename 原始文件名
   * @returns 带有时间戳的唯一文件名
   */
  private generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const extension = originalFilename.split(".").pop() || "";
    const baseName = originalFilename.replace(`.${extension}`, "");
    return `${baseName}-${timestamp}.${extension}`;
  }

  /**
   * 验证文件
   * @param file 要上传的文件
   * @throws {UploadError} 如果文件验证失败
   */
  private validateFile(file: File) {
    const MAX_FILE_SIZE = IMAGE_SIZE_LIMIT;
    if (file.size > MAX_FILE_SIZE) {
      throw new UploadError(
        `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
      );
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      throw new UploadError("Only image files are allowed");
    }
  }

  /**
   * 使用 XMLHttpRequest 上传文件并跟踪进度
   * @param file 要上传的文件
   * @param uploadUrl 预签名上传 URL
   * @param onProgress 进度回调函数
   */
  private async uploadWithProgress(
    file: File,
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 进度处理
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress?.(progress);
        }
      });

      // 完成处理
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(
            new UploadError(`Upload failed with status ${xhr.status}`, {
              status: xhr.status,
              response: xhr.response,
            })
          );
        }
      };

      // 错误处理
      xhr.onerror = () => {
        reject(new UploadError("Network error during upload"));
      };

      xhr.ontimeout = () => {
        reject(new UploadError("Upload timed out"));
      };

      // 设置超时时间（30秒）
      xhr.timeout = 30000;

      // 发送请求
      xhr.open("PUT", uploadUrl);
      xhr.send(file);
    });
  }

  /**
   * 上传文件到 R2
   * @param options 上传选项
   * @returns 上传结果，包含公共访问 URL
   * @throws {UploadError} 如果上传过程中出现错误
   */
  async upload({
    file,
    folder,
    onProgress,
    getUploadUrl,
  }: UploadToR2Options): Promise<UploadToR2Result> {
    try {
      // 1. 验证文件
      this.validateFile(file);

      // 2. 生成唯一文件名
      const uniqueFilename = this.generateUniqueFilename(file.name);

      // 3. 获取预签名 URL
      const { uploadUrl, publicUrl } = await getUploadUrl({
        filename: uniqueFilename,
        contentType: file.type,
        folder,
      });

      // 4. 上传文件
      await this.uploadWithProgress(file, uploadUrl, onProgress);

      return { publicUrl };
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      }
      throw new UploadError(
        "Failed to upload file",
        error instanceof Error ? error : undefined
      );
    }
  }
}

// 导出单例实例
export const cloudflareR2 = new CloudflareR2Client();
