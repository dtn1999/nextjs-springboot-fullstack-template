import {
  createContext,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image, { ImageProps } from "next/image";
import { CheckCircle, ChevronUp, Eye, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IdVerificationFormData } from "@/server/api/routers/account/schema";
import { ImageZoom } from "@/components/image-zoom";
import { Control } from "react-hook-form";
import { SingleFileUploader } from "@/components/single-file-uploader";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export type GovernmentIdField = keyof IdVerificationFormData;

export interface GovernmentIdPart {
  id: GovernmentIdField;
  title: string;
  description: string;
  imageSrc?: string;
  verified?: boolean;
}

interface GovernmentIdContextType {
  documentsParts: GovernmentIdPart[];
  expandedDocumentPartId?: string;
  setExpandedDocumentPartId: (id: string) => void;
  toggleExpandedDocumentPartId: (id: string) => void;
  isExpandedDocumentPartId: (id: string) => boolean;
}

const GovernmentIdContext = createContext<GovernmentIdContextType | undefined>(
  undefined
);

export function useGovernmentIdData() {
  const context = useContext(GovernmentIdContext);
  if (!context) {
    throw new Error(
      "useGovernmentIdData must be used within a GovernmentIdProvider"
    );
  }
  return context;
}

interface GovernmentIdDocumentProps {
  documentsParts: GovernmentIdPart[];
  onUpload?: () => void;
}

export function GovernmentIdDocumentProvider(
  props: PropsWithChildren<GovernmentIdDocumentProps>
) {
  const { documentsParts, children } = props;
  const [expandedDocumentPartId, setExpandedDocumentPartId] = useState<
    string | undefined
  >();

  const toggleExpandedDocumentPartId = (id: string) => {
    setExpandedDocumentPartId(expandedDocumentPartId === id ? undefined : id);
  };

  const isExpandedDocumentPartId = (id: string): boolean => {
    return id === expandedDocumentPartId;
  };

  return (
    <GovernmentIdContext
      value={{
        documentsParts,
        expandedDocumentPartId,
        setExpandedDocumentPartId,
        toggleExpandedDocumentPartId,
        isExpandedDocumentPartId,
      }}
    >
      {children}
    </GovernmentIdContext>
  );
}

function GovernmentDocumentPart({ children }: PropsWithChildren) {
  return (
    <Card className="overflow-hidden p-0 transition-all duration-300">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

function DocumentPartHeader({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      {...props}
      className={cn("flex items-start space-x-4 p-5", props.className)}
    >
      {children}
    </div>
  );
}

interface DocumentPartAction {
  documentPart: GovernmentIdPart;
  control?: Control<IdVerificationFormData>;
  onUploadComplete?: (imageUrl: string) => void;
}

function GovernmentDocumentPartAction(props: DocumentPartAction) {
  const { toggleExpandedDocumentPartId, isExpandedDocumentPartId } =
    useGovernmentIdData();

  const { documentPart } = props;

  // If there is no image for ID part, then ask the user to upload one
  if (!documentPart.imageSrc) {
    return (
      <FormField
        control={props.control}
        name={documentPart.id}
        render={({ field }) => (
          <FormItem className={cn("flex-1 hover:cursor-pointer")}>
            <FormControl className="relative flex-1">
              <SingleFileUploader
                onChange={field.onChange}
                render={({ loading, trigger }) => (
                  <Button
                    type="button"
                    variant="ghost"
                    href={undefined}
                    loading={loading}
                    onClick={trigger}
                    className="flex items-center gap-1"
                  >
                    <ArrowUpTrayIcon className="mr-1 h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => toggleExpandedDocumentPartId(documentPart.id)}
      className="flex items-center gap-1"
    >
      {isExpandedDocumentPartId(documentPart.id) ? (
        <>
          <ChevronUp className="mr-1 h-4 w-4" />
          Close
        </>
      ) : (
        <>
          <Eye className="mr-1 h-4 w-4" />
          View
        </>
      )}
    </Button>
  );
}

interface DocumentPartBodyProps {
  documentPart: Omit<GovernmentIdPart, "verified">;
  renderAction?: () => ReactNode;
}

function DocumentPartBody({
  renderAction,
  documentPart,
}: DocumentPartBodyProps) {
  const { expandedDocumentPartId } = useGovernmentIdData();

  const expanded = expandedDocumentPartId === documentPart.id;

  if (!documentPart.imageSrc || !expanded) {
    return null;
  }

  return (
    <div
      className={cn(
        "overflow-hidden py-5 transition-all duration-300",
        expanded ? "max-h-[400px] border-t" : "max-h-0"
      )}
    >
      <div className="mx-auto max-w-md">
        <ImageZoom
          src={documentPart.imageSrc}
          alt={documentPart.title}
          className="w-full rounded-md"
          maxZoom={5}
        />
      </div>
      {renderAction?.()}
    </div>
  );
}

function DocumentDescription(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>
) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

interface DocumentPreviewImageProps extends Omit<ImageProps, "src"> {
  src?: string;
  verified?: boolean;
}

interface DocumentPreviewProps extends HTMLAttributes<HTMLDivElement> {}

function DocumentPreview({
  children,
  ...props
}: PropsWithChildren<DocumentPreviewProps>) {
  return (
    <div {...props} className={cn("relative", props.className)}>
      {children}
    </div>
  );
}

function DocumentPreviewImage({
  verified,
  ...imageProps
}: DocumentPreviewImageProps) {
  if (!imageProps.src) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-10">
      <div className="relative size-20 flex-shrink-0">
        {imageProps.src && (
          <Image
            className={cn(
              "rounded-md object-cover object-center",
              imageProps.className
            )}
            {...imageProps}
            fill
            src={imageProps.src}
          />
        )}
        {verified !== undefined && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-white">
            {verified ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface DocumentPreviewFallbackProps extends HTMLAttributes<HTMLDivElement> {}

function DocumentPreviewFallback(
  props: PropsWithChildren<DocumentPreviewFallbackProps>
) {
  return (
    <div
      {...props}
      className={cn("relative size-20 flex-shrink-0", props.className)}
    >
      {props.children}
    </div>
  );
}

export {
  GovernmentDocumentPartAction,
  DocumentPreviewFallback,
  GovernmentDocumentPart,
  DocumentPreviewImage,
  DocumentDescription,
  DocumentPartHeader,
  DocumentPartBody,
  DocumentPreview,
};
