import { SingleFileUploader } from "@/components/single-file-uploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePictureFormProps {
  defaultValues: {
    url?: string;
    legalName: string;
  };
  submitting?: boolean;
  handleSubmit?: (profilePictureUrl: string) => Promise<void>;
}

export function ProfilePictureForm(props: ProfilePictureFormProps) {
  const { defaultValues } = props;
  return (
    <div className="flex w-fit flex-col items-center space-y-2">
      <Avatar className="relative size-60">
        <AvatarImage src={defaultValues.url} />
        <AvatarFallback>{defaultValues.legalName[0]}</AvatarFallback>
      </Avatar>
      <SingleFileUploader
        onChange={props.handleSubmit}
        render={({ loading, trigger }) => (
          <Button
            loading={loading || props.submitting}
            onClick={(event) => {
              event.preventDefault();
              trigger?.();
            }}
            className="relative space-x-2 bg-accent-400 hover:bg-accent-500"
          >
            <CameraIcon className="size-5" />
            <span>Upload new picture</span>
            <div className="z-4 absolute inset-0" />
          </Button>
        )}
      />
    </div>
  );
}
