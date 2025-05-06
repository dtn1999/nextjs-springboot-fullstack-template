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
  PreferredLanguageData,
  PreferredLanguageSchema,
} from "@/server/api/routers/account/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/components/layout/language-dropdown";
import { BasicFormProps } from "./personal-information-form";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

interface Props extends BasicFormProps {
  defaultValues?: string;
  handleSubmit?: (data: string) => Promise<void>;
}

export function PreferredLanguageForm(props: Props) {
  const {
    defaultValues,
    handleSubmit,
    loading,
    disabled,
    onEditorOpen,
    onEditorClose,
  } = props;

  const preferredLanguageForm = useForm<PreferredLanguageData>({
    resolver: zodResolver(PreferredLanguageSchema),
    values: {
      preferredLanguage: defaultValues ?? routing.defaultLocale,
    },
  });

  async function onSubmit(data: PreferredLanguageData) {
    if (handleSubmit) {
      await handleSubmit(data.preferredLanguage);
    }
    if (onEditorClose) {
      onEditorClose();
    }
    preferredLanguageForm.reset();
  }

  const getLanguage = () => {
    const preferredLanguage = SUPPORTED_LANGUAGES.find(
      (item) => item.id === defaultValues
    );
    if (preferredLanguage) {
      return `${preferredLanguage?.name}`;
    }

    return SUPPORTED_LANGUAGES.find((item) => routing.defaultLocale)?.name;
  };

  return (
    <EditableField
      label="Preferred language"
      placeholder="Select your preferred language for all your sessions."
      noValueActionLabel="Add"
      valueActionLabel="Edit"
      value={getLanguage()}
      onEditorOpen={onEditorOpen}
      onEditorClose={onEditorClose}
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">
            This updates what you read on CozyStay, and how we communicate with
            you.
          </p>
          <Form {...preferredLanguageForm}>
            <form
              onSubmit={preferredLanguageForm.handleSubmit(async (data) => {
                await onSubmit(data);
                afterSubmitCallback();
              })}
            >
              <FormField
                control={preferredLanguageForm.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem className="flex-1 py-6">
                    <FormControl className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-full py-6">
                            <SelectValue placeholder="Select your preferred language." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                loading={loading}
                disabled={disabled}
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
