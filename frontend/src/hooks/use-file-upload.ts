import { useState } from "react";
import { ServerResponse } from "@/server/utils";

interface CloudinaryResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
  resource_type: string;
  created_at: string;

  [key: string]: any;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState<boolean>(false);

  async function uploadFile(
    file: File
  ): Promise<ServerResponse<CloudinaryResult> | undefined> {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      setUploading(false);
      const result = await response.json();
      if (result.data) {
        return {
          data: result.data,
        };
      }
      if (result.error) {
        return {
          error: result.error,
        };
      }
    }
  }

  return { uploadFile, loading: uploading };
}
