import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumber } from "react-phone-number-input";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";

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
  EmergencyContactFormData,
  EmergencyContactSchema,
} from "@/server/api/routers/account/schema";
import { cn } from "@/lib/utils";
import twFocusClass from "@/lib/twFocusClass";
import { EmergencyContact } from "@/server/types/domain";
import { BasicFormProps } from "@/features/users/components/settings/form/personal-information-form";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/formatter";

interface Props extends BasicFormProps {
  defaultValues?: EmergencyContact;
  handleSubmit?: (data: EmergencyContact) => Promise<void>;
}

export function EmergencyContactForm(props: Props) {
  const {
    defaultValues,
    handleSubmit,
    loading,
    onEditorClose,
    onEditorOpen,
    disabled,
  } = props;

  const form = useForm<EmergencyContactFormData>({
    resolver: zodResolver(EmergencyContactSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      relationship: defaultValues?.relationship ?? "",
    },
  });

  function getEmergencyContact() {
    return formatter.emergencyContact(defaultValues);
  }

  async function onSubmit(data: EmergencyContactFormData) {
    if (handleSubmit) {
      const phoneNumberFrag = parsePhoneNumber(data.phone);
      await handleSubmit({
        name: data.name,
        email: data.email,
        relationship: data.relationship,
        phoneNumber: {
          number: phoneNumberFrag?.number ?? "",
          countryCode: phoneNumberFrag?.countryCallingCode ?? "",
        },
        preferredLanguage: "English",
      });
    }

    if (onEditorClose) {
      onEditorClose();
    }
    form.reset();
  }

  return (
    <EditableField
      loading={loading}
      valueActionLabel="Edit"
      noValueActionLabel="Add"
      disabled={disabled}
      label="Emergency contact"
      value={getEmergencyContact()}
      onEditorOpen={onEditorOpen}
      className="border-transparent"
      onEditorClose={onEditorClose}
      placeholder="Who do you want us to contact in case of any issue?"
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">
            Who do you want us to contact in case of any issue?
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await onSubmit(data);
                afterSubmitCallback();
              })}
              className="flex flex-col space-y-2 py-6"
            >
              {/* Emergency Contact Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="flex-1">
                      <Input
                        {...field}
                        placeholder="Name"
                        className={cn(
                          "block w-full border-neutral-200 bg-white py-6 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent",
                          twFocusClass()
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Emergency Contact Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="flex-1">
                      <Input
                        {...field}
                        placeholder="Email"
                        className={cn(
                          "block w-full border-neutral-200 bg-white py-6 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent",
                          twFocusClass()
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Emergency Contact Relationship */}
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="flex-1">
                      <Input
                        {...field}
                        placeholder="Relationship"
                        className={cn(
                          "block w-full border-neutral-200 bg-white py-6 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent",
                          twFocusClass()
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Emergency Contact Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={() => (
                  <FormItem className="flex-1">
                    <FormControl className="flex-1">
                      <PhoneInputWithCountry
                        name="phone"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        inputComponent={(props: any) => (
                          <Input
                            {...props}
                            className="border-none border-transparent focus:border-none focus:border-transparent focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          />
                        )}
                        control={form.control}
                        rules={{ required: true }}
                        className="group rounded-md border border-border px-4 py-2 focus-within:border-brand-300 focus-within:ring-1 focus-within:ring-brand-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={disabled}
                  loading={loading}
                  className="w-fit bg-accent-500 text-negative"
                >
                  Save and continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    />
  );
}
