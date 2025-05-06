import { DEFAULT_CLOUDINARY_STYLES } from "@/lib/cloudinaryStyles";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { UploadZone } from "../upload-zone";

interface FileInputProps {
  onSuccess?: (data: CloudinaryUploadWidgetResults) => void;
  onError?: (error: CloudinaryUploadWidgetError) => void;
  uploadPreset: string;
  sources?: CloudinaryUploadWidgetOptions["sources"];
  multiple?: boolean;
  value?: string;
  renderTrigger?: (open: () => void) => React.ReactNode;
}

export function FileInput({
  onSuccess,
  onError,
  multiple,
  uploadPreset,
  sources = ["local"],
  value,
  renderTrigger = (open) => <UploadZone onClick={open} />,
}: FileInputProps) {
  function fileName() {
    if (!value) {
      return undefined;
    }
    return value.split("/").pop();
  }

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{
        sources,
        multiple,
        styles: {
          ...DEFAULT_CLOUDINARY_STYLES,
        },
      }}
      onSuccess={(data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      }}
      onError={onError}
    >
      {({ open }) => renderTrigger(open)}
    </CldUploadWidget>
  );
}
