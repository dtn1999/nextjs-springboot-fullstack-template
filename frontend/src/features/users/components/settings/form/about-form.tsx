import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditableField } from "@/components/form/editable-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  ProfileBioFormData,
  ProfileBioSchema,
} from "@/server/api/routers/account/schema";
import { cn } from "@/lib/utils";
import twFocusClass from "@/lib/twFocusClass";
import { BasicFormProps } from "@/features/users/components/settings/form/personal-information-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props extends BasicFormProps {
  defaultValues?: string;
  handleSubmit?: (data: string) => Promise<void>;
}

export function AboutForm(props: Props) {
  const {
    defaultValues: about,
    handleSubmit,
    loading,
    disabled,
    onEditorOpen,
    onEditorClose,
  } = props;

  const form = useForm<ProfileBioFormData>({
    resolver: zodResolver(ProfileBioSchema),
    values: {
      about: about ?? "",
    },
  });

  const getBio = useCallback(() => {
    if (!about) {
      return undefined;
    }
    return `${about}`;
  }, [about]);

  async function onSubmit(data: ProfileBioFormData) {
    await handleSubmit?.(data.about);
    onEditorClose?.();
    form.reset();
  }

  return (
    <EditableField
      value={getBio()}
      label="About"
      valueActionLabel="Edit"
      noValueActionLabel="Add"
      disabled={disabled}
      loading={loading}
      onEditorOpen={onEditorOpen}
      onEditorClose={onEditorClose}
      placeholder="Provide information about yourself."
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">
            Provide a valid email address for communication.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await onSubmit(data);
                afterSubmitCallback();
              })}
            >
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="flex-1 py-6">
                    <FormControl className="flex-1">
                      <Textarea
                        {...field}
                        rows={5}
                        className={cn(
                          "block w-full border-neutral-200 bg-white focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50",
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
