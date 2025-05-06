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
  PreferredCurrencyData,
  PreferredCurrencySchema,
} from "@/server/api/routers/account/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/components/layout/currency-dropdown";
import { BasicFormProps } from "@/features/users/components/settings/form/personal-information-form";
import { Button } from "@/components/ui/button";

interface Props extends BasicFormProps {
  defaultValues?: string;
  handleSubmit?: (data: string) => Promise<void>;
}

export function PreferredCurrencyForm(props: Props) {
  const {
    defaultValues,
    handleSubmit,
    loading,
    disabled,
    onEditorOpen,
    onEditorClose,
  } = props;

  const form = useForm<PreferredCurrencyData>({
    resolver: zodResolver(PreferredCurrencySchema),
    values: {
      preferredCurrency: defaultValues ?? "EUR",
    },
  });

  async function onSubmit(data: PreferredCurrencyData) {
    if (handleSubmit) {
      await handleSubmit(data.preferredCurrency);
    }
    if (onEditorClose) {
      onEditorClose();
    }
    form.reset();
  }

  const getCurrency = () => {
    const preferredCurrency = SUPPORTED_CURRENCIES.find(
      (item) => item.id === defaultValues
    );
    if (preferredCurrency) {
      return `${preferredCurrency?.name}`;
    }

    return SUPPORTED_CURRENCIES.find((item) => item.id === "USD")?.name;
  };

  return (
    <EditableField
      label="Preferred currency"
      placeholder="Select your preferred currency for all your sessions."
      noValueActionLabel="Add"
      valueActionLabel="Edit"
      value={getCurrency()}
      disabled={disabled}
      onEditorOpen={onEditorOpen}
      onEditorClose={onEditorClose}
      className="border-transparent"
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">
            This updates what you read on CozyStay, and how we communicate with
            you.
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
                name="preferredCurrency"
                render={({ field }) => (
                  <FormItem className="flex-1 py-6">
                    <FormControl className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-full py-6">
                            <SelectValue placeholder="Select your preferred currency." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUPPORTED_CURRENCIES.map((item) => (
                            <SelectItem key={item.id} value={item.name}>
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
