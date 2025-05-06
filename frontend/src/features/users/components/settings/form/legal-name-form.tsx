"use client";
import * as _ from "lodash";
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
  LegalNameFormData,
  LegalNameSchema,
} from "@/server/api/routers/account/schema";
import { cn } from "@/lib/utils";
import twFocusClass from "@/lib/twFocusClass";
import { useCallback } from "react";
import { LegalName } from "@/server/types/domain";
import { BasicFormProps } from "@/features/users/components/settings/form/personal-information-form";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/formatter";

interface Props extends BasicFormProps {
  defaultValues?: LegalName;
  handleSubmit?: (data: LegalName) => Promise<void>;
}

export function LegalNameForm(props: Props) {
  const {
    defaultValues,
    handleSubmit,
    loading,
    disabled,
    onEditorClose,
    onEditorOpen,
  } = props;

  const form = useForm<LegalNameFormData>({
    resolver: zodResolver(LegalNameSchema),
    values: defaultValues,
  });

  const firstname = _.get(defaultValues, "firstName", undefined);
  const lastname = _.get(defaultValues, "lastName", undefined);

  const getLegalName = useCallback(() => {
    return formatter.legalName(defaultValues);
  }, [lastname, firstname]);

  async function onSubmit(data: LegalNameFormData) {
    if (handleSubmit) {
      await handleSubmit(data);
    }

    if (onEditorClose) {
      onEditorClose();
    }

    form.reset();
  }

  return (
    <EditableField
      disabled={disabled}
      label="Legal Name"
      value={getLegalName()}
      valueActionLabel="Edit"
      noValueActionLabel="Add"
      onEditorOpen={onEditorOpen}
      onEditorClose={onEditorClose}
      placeholder="Provide your full name as on your ID."
      renderSettingEditor={(afterSubmitCallback) => (
        <div className="w-full">
          <p className="text-sm text-caption">
            Provide your full name as on your ID.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await onSubmit(data);
                afterSubmitCallback();
              })}
            >
              <div className="grid w-full grid-cols-1 gap-2 py-6 md:grid-cols-2">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl className="flex-1">
                        <Input
                          {...field}
                          placeholder="First Name"
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
                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl className="flex-1">
                        <Input
                          {...field}
                          placeholder="Last Name"
                          className={cn(
                            "block w-full rounded-full border-neutral-200 bg-white py-6 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50",
                            twFocusClass()
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
