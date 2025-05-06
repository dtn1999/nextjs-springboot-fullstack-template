import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import twFocusClass from "@/lib/twFocusClass";
import { Checkbox } from "@/components/form/checkbox";
import { useEffect, useState } from "react";
import { useSecurityWidget, useSessionUtils } from "@/hooks/use-auth";
import { alert } from "@/lib/alert";
import { api } from "@/trpc/react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { coziApi } from "@/server/config";
import type { EmailUniquenessResponse } from "@/server/types/domain";
import {
  RegistrationFormData,
  RegistrationFormSchema,
} from "@/server/api/routers/account/schema";
import { usePathname } from "@/i18n/routing";
import { fetcherResponseHandler, ServerResponse } from "@/server/utils";

interface Props {
  onClose?: () => void;
}

export function RegistrationDialog(props: Readonly<Props>) {
  const [openModal, setOpenModal] = useState<boolean>(true);
  const { loading, isUserFullyConnected } = useSessionUtils();

  console.log(
    "loading ",
    loading,
    "is user fully connected",
    isUserFullyConnected
  );

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (!open && props.onClose) {
      props.onClose();
    }
  };

  if (loading) {
    return null;
  }

  if (isUserFullyConnected) {
    return null;
  }

  return (
    <ResponsiveDialog
      defaultOpen
      open={openModal}
      onOpenChange={handleOpenChange}
    >
      <ResponsiveDialogContent className="p-0">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Complete your registration
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="sr-only">
            A form with all the necessary inputs for user's data.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="px-6">
          <RegistrationForm onSuccess={props.onClose} />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

interface RegistrationFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

function RegistrationForm(props: Readonly<RegistrationFormProps>) {
  const pathname = usePathname();
  const { user, tokens, isUserFullyConnected } = useSessionUtils({
    required: true,
  });
  const [isEmailUnique, setIsEmailUnique] = useState<boolean>(true);
  const [isEmailFieldDisabled, setIsEmailFieldDisabled] =
    useState<boolean>(false);
  const { activeAuthProvider, closeAuthWidget } = useSecurityWidget();
  const { mutateAsync: registerNewUser } = api.account.register.useMutation();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationFormSchema),
    values: {
      email: user?.email ?? "",
      firstname: "",
      lastname: "",
      birthdate: "",
    },
  });

  const submitButtonDisabled =
    form.formState.isSubmitting || !form.formState.isValid || !isEmailUnique;

  async function onSubmit(data: RegistrationFormData) {
    const response = await registerNewUser(data);
    if (response.data && props.onSuccess) {
      props.onSuccess();
    }

    if (response?.error) {
      alert(response?.error);
      closeAuthWidget();
    }

    window.location.replace(pathname);
  }

  async function _isEmailUnique(email: string) {
    const response = await checkEmailUniqueness(
      email,
      tokens?.accessToken ?? ""
    );
    return response.data?.isUnique ?? true;
  }

  useEffect(() => {
    if (isUserFullyConnected) {
      closeAuthWidget();
    }

    (async () => {
      if (!user?.email) {
        setIsEmailUnique(true);
        setIsEmailFieldDisabled(false);
      } else {
        const isUnique = await _isEmailUnique(user?.email);
        setIsEmailUnique(isUnique);
        setIsEmailFieldDisabled(isUnique);
      }
    })();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-2 py-8 md:p-4"
      >
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>First name</FormLabel>
              <FormControl className="flex-1">
                <Input
                  {...field}
                  className={cn(
                    "block h-11 w-full rounded-full border-neutral-200 bg-white focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent",
                    twFocusClass()
                  )}
                />
              </FormControl>
              <FormDescription>
                Provide your first name as it appears on your ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Last name</FormLabel>
              <FormControl className="flex-1">
                <Input
                  {...field}
                  className={cn(
                    "block h-11 w-full rounded-full border-neutral-200 bg-white focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent",
                    twFocusClass()
                  )}
                />
              </FormControl>
              <FormDescription>
                Provide your last name as it appears on your ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={!!user?.email}
          render={({ field }) => {
            return (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl className="flex-1">
                  <Input
                    {...field}
                    value={field.value}
                    disabled={isEmailFieldDisabled}
                    onChange={async (e) => {
                      e.preventDefault();
                      field.onChange(e);
                      const isUnique = await _isEmailUnique(e.target.value);
                      setIsEmailUnique(isUnique);
                    }}
                    className={cn(
                      "block h-11 w-full rounded-full border-neutral-200 bg-white focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent",
                      {
                        "border border-accent-400": isEmailUnique,
                        "border-2 border-red-700": !isEmailUnique,
                      },
                      twFocusClass()
                    )}
                  />
                </FormControl>
                {user?.email && (
                  <FormDescription>
                    {`Your email comes from your login to `}
                    <span className="text-brand-500">{activeAuthProvider}</span>
                  </FormDescription>
                )}
                {!isEmailUnique && (
                  <FormDescription className="text-red-500">
                    This email is already in use. Please provide a different
                    one.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Birth of date</FormLabel>
              <FormControl className="flex-1">
                <Input
                  {...field}
                  type="date"
                  className={cn(
                    "block h-11 w-full rounded-full border-neutral-200 bg-white focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent",
                    twFocusClass()
                  )}
                />
              </FormControl>
              <FormDescription>
                You must be 18 years or older to register.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-4">
          <Button
            variant="primary"
            type="submit"
            disabled={submitButtonDisabled}
            loading={form.formState.isSubmitting || form.formState.isLoading}
            className="w-full"
          >
            Complete registration
          </Button>
        </div>

        <div className="py-4">
          <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Checkbox
                    name={field.name}
                    label="I don’t want to receive marketing messages from Cozy."
                    defaultChecked={field.value}
                    onChange={field.onChange}
                    className="text-sm text-caption"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

export function checkEmailUniqueness(
  email: string,
  accessToken: string
): Promise<ServerResponse<EmailUniquenessResponse>> {
  return fetcherResponseHandler<EmailUniquenessResponse>(async () => {
    const { data, error } = await coziApi.POST(
      "/accounts/check-email-uniqueness",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          query: {
            email,
          },
        },
      }
    );

    return { data, error };
  }, "EXPECT_DATA");
}
