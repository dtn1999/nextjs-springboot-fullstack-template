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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircleIcon,
  CreditCardIcon,
  IdentificationIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAccountVerificationMutation } from "@/features/users/hooks/use-accounts";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { alert } from "@/lib/alert";
import { toast } from "sonner";
import useGoBack from "@/hooks/use-go-back";

interface GovernmentIdVerifierProps {
  accountId: number;
  governmentId?: GovernmentId;
}

const IdVerificationReviewFormSchema = z.object({
  idFrontSideImage: z.boolean(),
  idBackSideImage: z.boolean(),
  selfieWithIdImage: z.boolean(),
});

type IdVerificationReviewFormData = z.infer<
  typeof IdVerificationReviewFormSchema
>;

export function GovernmentIdVerifier({
  accountId,
  governmentId,
}: GovernmentIdVerifierProps) {
  const form = useForm<IdVerificationReviewFormData>({
    resolver: zodResolver(IdVerificationReviewFormSchema),
  });
  const goBack = useGoBack();

  const { approveGovernmentId } = useAccountVerificationMutation();

  const onSubmit = async (values: IdVerificationReviewFormData) => {
    const rejectedField = Object.entries(values).find((state) => !state);
    if (!rejectedField) {
      const response = await approveGovernmentId(accountId);
      if (response.error) {
        alert(response.error);
      }
      if (response.data) {
        toast.success("Government ID verified successfully.");
        goBack();
      }
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
      title: "ID front side",
      description:
        "Verify if information like first name, last name, and birthdate are correct.",
      imageSrc: governmentId?.idFrontSideImage,
      verified: form.getValues("idFrontSideImage"),
    },
    {
      id: "idBackSideImage",
      title: "ID Back side",
      description:
        "Verify (when possible) if information user's address is correct.",
      imageSrc: governmentId?.idBackSideImage,
      verified: form.getValues("idBackSideImage"),
    },
    {
      id: "selfieWithIdImage",
      title: "Selfie with your ID",
      description:
        "Check if the user's face on the selfie and on the ID card are the same.",
      imageSrc: governmentId?.selfieWithIdImage,
      verified: form.getValues("selfieWithIdImage"),
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
                  <GovernmentDocumentPartAction documentPart={documentPart} />
                </DocumentPartHeader>
                <DocumentPartBody
                  documentPart={documentPart}
                  renderAction={() => (
                    <div className={cn("flex justify-end gap-4 px-10 pt-2")}>
                      <FormField
                        control={form.control}
                        name={documentPart.id}
                        render={({ field }) => (
                          <FormItem
                            className={cn("flex-1 hover:cursor-pointer")}
                          >
                            <FormControl className="relative flex-1">
                              <Button
                                variant="default"
                                className="w-fit bg-green-600 hover:bg-green-700"
                                onClick={() => field.onChange(true)}
                              >
                                <CheckCircleIcon className="mr-2 h-4 w-4" />
                                Accept
                              </Button>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                />
              </GovernmentDocumentPart>
            </div>
          ))}
          <div className="flex justify-between border-t border-border py-4">
            <Button
              type="submit"
              variant="ghost"
              className="px-10 text-red-500 hover:text-red-700"
            >
              Decline Verification
            </Button>
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
