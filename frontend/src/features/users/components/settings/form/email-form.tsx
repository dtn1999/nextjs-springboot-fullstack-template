import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditableField } from "@/components/form/editable-field";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  EmailFormData,
  EmailSchema,
} from "@/server/api/routers/account/schema";
import { cn } from "@/lib/utils";
import twFocusClass from "@/lib/twFocusClass";
import { Email } from "@/server/types/domain";
import { BasicFormProps } from "@/features/users/components/settings/form/personal-information-form";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/formatter";
import { useEmailUniquenessQuery } from "@/features/users/hooks/use-accounts";

interface Props extends BasicFormProps {
  defaultValues?: Email;
  handleSubmit?: (data: Email) => Promise<void>;
}

export function EmailForm(props: Props) {
  const {
    defaultValues: currentEmail,
    handleSubmit,
    loading,
    disabled,
    onEditorOpen,
    onEditorClose,
  } = props;

  const form = useForm<EmailFormData>({
    resolver: zodResolver(EmailSchema),
    values: {
      email: currentEmail ?? "",
    },
  });

  const { data: emailUniquenessResult, refetch } = useEmailUniquenessQuery(
    form.getValues("email")
  );

  const getEmail = useCallback(() => {
    return formatter.email(currentEmail);
  }, [currentEmail]);

  async function onSubmit(data: EmailFormData, afterSubmit?: () => void) {
    await refetch({});

    if (emailUniquenessResult?.data?.isUnique || currentEmail) {
      if (handleSubmit) {
        await handleSubmit(data.email);
      }
      if (onEditorClose) {
        onEditorClose();
      }
      form.reset();
      afterSubmit?.();
      return;
    }

    form.setError("email", {
      message: "email already exists. Please try again with another email",
    });
    form.setFocus("email");
  }

  return (
    <EditableField
      value={getEmail()}
      label="Email address"
      valueActionLabel="Edit"
      noValueActionLabel="Add"
      disabled={disabled}
      onEditorOpen={onEditorOpen}
      onEditorClose={onEditorClose}
      placeholder="Provide a valid email address for communication."
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">
            Provide a valid email address for communication.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await onSubmit(data, afterSubmitCallback);
              })}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1 py-6">
                    <FormControl className="flex-1">
                      <Input
                        {...field}
                        placeholder="Email"
                        className={cn(
                          "block w-full rounded-full border-neutral-200 bg-white py-6 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50",
                          twFocusClass()
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={disabled}
                loading={loading}
                className="bg-accent-500 text-negative"
              >
                Save and continue
              </Button>
            </form>
          </Form>
        </div>
      )}
    />
  );
}
