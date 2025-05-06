"use client";

import {
  DocumentDescription,
  DocumentPartBody,
  DocumentPartHeader,
  DocumentPreview,
  DocumentPreviewFallback,
  DocumentPreviewImage,
  GovernmentDocumentPart,
  GovernmentDocumentPartAction,
  GovernmentIdDocumentProvider,
  GovernmentIdField,
  GovernmentIdPart,
} from "@/features/users/components/government-id-document-provider";
import { GovernmentId } from "@/server/types/domain";
import { useForm } from "react-hook-form";
import {
  IdVerificationFormData,
  IdVerificationFormSchema,
} from "@/server/api/routers/account/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCardIcon,
  IdentificationIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { alert } from "@/lib/alert";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { usePatchAccountMutation } from "@/features/users/hooks/use-accounts";

interface GovernmentIdVerifierProps {
  accountId: number;
  governmentId?: GovernmentId;
}

export function GovernmentIdUploader({
  accountId,
  governmentId,
}: GovernmentIdVerifierProps) {
  const router = useRouter();
  const form = useForm<IdVerificationFormData>({
    resolver: zodResolver(IdVerificationFormSchema),
    defaultValues: governmentId,
  });
  const { mutateAsync: updateAccountInfo } = usePatchAccountMutation();

  const onSubmit = async (values: IdVerificationFormData) => {
    const result = await updateAccountInfo({
      accountId,
      governmentId: {
        ...values,
      },
    });

    if (result.error) {
      alert(result.error);
    }

    if (result.data) {
      toast.success("Identity verification submitted successfully");
      router.replace("/account/settings/information");
    }
  };

  const isSubmitButtonDisabled = !form.formState.isValid;

  const renderDocumentFallback = (id: GovernmentIdField) => {
    switch (id) {
      case "idFrontSideImage":
        return <IdentificationIcon className="size-15" />;
      case "idBackSideImage":
        return <CreditCardIcon className="size-15" />;
      case "selfieWithIdImage":
        return <ViewfinderCircleIcon className="size-15" />;
      default:
        return (
          <div className="text-red-600">Unknown government ID field: {id}</div>
        );
    }
  };

  const documentParts: GovernmentIdPart[] = [
    {
      id: "idFrontSideImage",
      title: "ID front side (JPEG or PNG only)",
      description:
        "Upload a clear photo of maximal 10MB of the front side of one of your government identification card.",
      imageSrc: form.getValues("idFrontSideImage"),
      verified: Boolean(form.getValues("idFrontSideImage")),
    },
    {
      id: "idBackSideImage",
      title: "ID Back side (JPEG or PNG only)",
      description:
        "Upload a clear photo of maximal 10MB of the front side of one of your government identification card.",
      imageSrc: form.getValues("idBackSideImage"),
      verified: Boolean(form.getValues("idBackSideImage")),
    },
    {
      id: "selfieWithIdImage",
      title: "Selfie with your ID (JPEG or PNG only)",
      description:
        "Upload a selfie a 10MB photo of you holding a government identification card.",
      imageSrc: form.getValues("selfieWithIdImage"),
      verified: Boolean(form.getValues("selfieWithIdImage")),
    },
  ];

  return (
    <GovernmentIdDocumentProvider documentsParts={documentParts}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {documentParts.map((documentPart) => (
            <div key={documentPart.id}>
              <GovernmentDocumentPart key={documentPart.id}>
                <DocumentPartHeader>
                  <DocumentPreview>
                    <DocumentPreviewImage
                      src={documentPart.imageSrc}
                      alt=""
                      verified={documentPart.verified}
                    />
                    <DocumentPreviewFallback className="flex items-start justify-center">
                      {renderDocumentFallback(documentPart.id)}
                    </DocumentPreviewFallback>
                  </DocumentPreview>
                  <DocumentDescription>
                    <div>
                      <p className="font-medium">{documentPart.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {documentPart.description}
                      </p>
                    </div>
                  </DocumentDescription>
                  <GovernmentDocumentPartAction
                    control={form.control}
                    documentPart={documentPart}
                  />
                </DocumentPartHeader>
                <DocumentPartBody documentPart={documentPart} />
              </GovernmentDocumentPart>
            </div>
          ))}
          <div className="flex justify-end border-t border-border py-4">
            <Button
              type="submit"
              disabled={isSubmitButtonDisabled}
              loading={form.formState.isSubmitting}
              className="bg-accent-400 px-10 text-negative hover:bg-accent-500"
            >
              Complete verification
            </Button>
          </div>
        </form>
      </Form>
    </GovernmentIdDocumentProvider>
  );
}
