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
  AddressFormData,
  AddressSchema,
} from "@/server/api/routers/account/schema";
import { cn } from "@/lib/utils";
import twFocusClass from "@/lib/twFocusClass";
import { BasicFormProps } from "@/features/users/components/settings/form/personal-information-form";
import { Address } from "@/server/types/domain";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/formatter";

interface Props extends BasicFormProps {
  defaultValues?: Address;
  handleSubmit?: (data: Address) => Promise<void>;
}

export function AddressForm(props: Props) {
  const {
    defaultValues,
    handleSubmit,
    loading,
    onEditorClose,
    onEditorOpen,
    disabled,
  } = props;

  const form = useForm<AddressFormData>({
    resolver: zodResolver(AddressSchema),
    values: {
      country: defaultValues?.country ?? "",
      state: defaultValues?.state ?? "",
      city: defaultValues?.city ?? "",
      zipCode: defaultValues?.zipCode ?? "",
      street: defaultValues?.street ?? "",
    },
  });

  async function onSubmit(data: AddressFormData) {
    await handleSubmit?.(data);
    onEditorClose?.();
    form.reset();
  }

  function getAddress() {
    return formatter.address(defaultValues);
  }

  return (
    <EditableField
      label="Address"
      loading={loading}
      disabled={disabled}
      noValueActionLabel="Add"
      valueActionLabel="Edit"
      placeholder="Not provided"
      value={getAddress()}
      onEditorOpen={onEditorOpen}
      onEditorClose={onEditorClose}
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">Provide your address details.</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await onSubmit(data);
                afterSubmitCallback();
              })}
              className="flex flex-col space-y-2 py-6"
            >
              <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl className="flex-1">
                        <Input
                          {...field}
                          placeholder="Country"
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
                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl className="flex-1">
                        <Input
                          {...field}
                          placeholder="State"
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
              </div>
              {/* City */}
              <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl className="flex-1">
                        <Input
                          {...field}
                          placeholder="City"
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
                {/* Zip Code */}
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl className="flex-1">
                        <Input
                          {...field}
                          placeholder="zip"
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
              </div>
              {/* Street */}
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="flex-1">
                      <Input
                        {...field}
                        placeholder="Street"
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
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
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
