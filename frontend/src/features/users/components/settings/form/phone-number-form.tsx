import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";

import { EditableField } from "@/components/form/editable-field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  PhoneNumberFormData,
  PhoneNumbersSchema,
} from "@/server/api/routers/account/schema";
import { BasicFormProps } from "@/features/users/components/settings/form/personal-information-form";
import { PhoneNumber } from "@/server/types/domain";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/formatter";
import type React from "react";
import { PhoneNumberInput } from "@/components/form/phone-number-input";

interface Props extends BasicFormProps {
  defaultValues?: PhoneNumber;
  handleSubmit?: (data: PhoneNumber) => Promise<void>;
}

export function PhoneNumberForm(props: Props) {
  const {
    defaultValues,
    handleSubmit,
    loading,
    disabled,
    onEditorClose,
    onEditorOpen,
  } = props;

  const form = useForm<PhoneNumberFormData>({
    resolver: zodResolver(PhoneNumbersSchema),
    values: {
      phone: defaultValues?.number ?? "",
    },
  });

  function getPhoneNumber() {
    return formatter.phoneString(defaultValues?.number);
  }

  async function onSubmit(
    data: PhoneNumberFormData,
    afterSubmitCallback?: () => void
  ) {
    if (handleSubmit) {
      const isPhoneNumberValid = isValidPhoneNumber(data.phone);
      if (!isPhoneNumberValid) {
        form.setError("phone", {
          message: "You need to provide a valid phone number",
        });
        form.setFocus("phone");
        return;
      }
      const phoneNumberFrag = parsePhoneNumber(data.phone);
      await handleSubmit({
        number: phoneNumberFrag?.number ?? "",
        countryCode: phoneNumberFrag?.countryCallingCode ?? "",
      });

      afterSubmitCallback?.();
    }

    if (onEditorClose) {
      onEditorClose();
    }

    form.reset();
  }

  return (
    <EditableField
      label="Phone number"
      disabled={disabled}
      noValueActionLabel="Add"
      valueActionLabel="Edit"
      value={getPhoneNumber()}
      onEditorOpen={onEditorOpen}
      onEditorClose={onEditorClose}
      placeholder="Provide a valid phone number we can reach you on."
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">
            Provide a valid phone number we can reach you on.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                async (data) => await onSubmit(data, afterSubmitCallback)
              )}
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1 py-6">
                    <FormControl className="flex-1">
                      <PhoneNumberInput
                        control={form.control}
                        {...props}
                        {...field}
                        error={form.formState.errors.phone}
                      />
                    </FormControl>
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
