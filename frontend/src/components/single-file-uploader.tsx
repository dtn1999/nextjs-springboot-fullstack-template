import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, useRef } from "react";
import { ProblemDetail } from "@/server/types/domain";
import { useFileUpload } from "@/hooks/use-file-upload";

interface FileUploadProps {
  render: (arg: { loading: boolean; trigger?: () => void }) => ReactNode;
  onChange?: (url: string) => void;
  onUploadComplete?: (result: CloudinaryResult) => void;
  onUploadError?: (error: ProblemDetail) => void;
  maxSize?: number; // in MB
  acceptedFileTypes?: string;
  uploadPreset?: string;
  cloudName?: string;
  folder?: string;
}

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

export function SingleFileUploader(props: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { loading, uploadFile: _uploadFile } = useFileUpload();

  const onClick = () => {
    inputRef.current?.click();
  };

  async function uploadFile(file: File) {
    console.log(file);
    if (file) {
      const result = await _uploadFile(file);
      if (result?.data) {
        props.onUploadComplete?.(result.data as CloudinaryResult);
        props.onChange?.((result.data as CloudinaryResult).secure_url);
      }
      if (result?.error) {
        props.onUploadError?.(result.error as ProblemDetail);
      }
    }
  }

  return (
    <Label htmlFor="picture" className="bg-accklent-400 flex-1">
      {props.render({ loading, trigger: onClick })}
      <Input
        ref={inputRef}
        id="picture"
        type="file"
        className="hidden"
        onChange={async (e) => {
          e.preventDefault();
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]!;
            await uploadFile(file);
          }
        }}
      />
    </Label>
  );
}
