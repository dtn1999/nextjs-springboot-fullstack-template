"use client";

import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EyeIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ResourceTable } from "@/components/table/resource-table";
import { Account } from "@/server/types/domain";
import {
  useAllAccountsQuery,
  useMakeHostMutation,
  useSuspendAccountMutation,
} from "@/features/users/hooks/use-accounts";
import { formatter } from "@/lib/formatter";
import { alert } from "@/lib/alert";
import {
  AccountRoleBadge,
  AccountStatusBadge,
} from "@/features/users/components/user-badge";
import { useRouter } from "@/i18n/routing";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { useMemo, useState } from "react";
import { UserVerificationState } from "@/features/users/components/manager/user-verification-state";
import { UserManagerToolbar } from "@/features/users/components/manager/user-manager-toolbar";
import { HomeModernIcon } from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// TODO: Optimize this component
export function UserManager() {
  const [filter, setFilter] = useState<string>();
  const router = useRouter();
  const { accounts, error, isLoading } = useAllAccountsQuery();
  const [selectedUser, setSelectedUser] = useState<Account | null>(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const { mutateAsync: updateAccountRole } = useMakeHostMutation();
  const { mutateAsync: suspendAccount } = useSuspendAccountMutation();

  if (error) {
    alert(error);
  }

  const handleMakeHost = async (accountId: number) => {
    const response = await updateAccountRole({ accountId });
    if (response.error) {
      alert(response.error);
    } else {
      toast.success("User has been made host successfully");
    }
  };

  const handleAccountSuspensionConfirmation = async (accountId: number) => {
    const response = await suspendAccount({ accountId });
    if (response.error) {
      alert(response.error);
    } else {
      toast.success("User has been suspended successfully");
    }
  };

  // Define columns for the ResourceTable
  const columns: ColumnDef<Account>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "user",
        header: "User information",
        filterFn: "fuzzy",
        accessorFn: (row) =>
          `${formatter.legalName(row.personalInformation.legalName)},${formatter.email(row.personalInformation.email)} `,
        cell: ({ row }) => {
          const legalName = formatter.legalName(
            row.original.personalInformation.legalName
          );
          return (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={row.original.profile.profilePictureUrl}
                  alt={`Profile of ${legalName}`}
                />
                <AvatarFallback>{legalName}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{legalName}</div>
                <div className="text-sm text-gray-500">
                  {formatter.email(row.original.personalInformation.email)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "role",
        accessorFn: (row) => row.role,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            <AccountRoleBadge role={row.original.role} />
          </div>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            <AccountStatusBadge status={row.original.status} />
          </div>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: "verificationStatus",
        accessorFn: (row) => row.status,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Verification Status" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            <UserVerificationState
              isIdVerified={row.original.profile.isGovernmentIdVerified}
              isEmailVerified={row.original.profile.isEmailVerified}
              isPhoneVerified={row.original.profile.isPhoneNumberVerified}
            />
          </div>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => (
          <span>{format(row.original.createdAt, "MMM d, yyyy")}</span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <MoreVerticalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => router.push(`/admin/users/${row.original.id}`)}
                className="flex cursor-pointer items-center space-x-2"
              >
                <EyeIcon className="size-6" />
                <span className="text-nowrap">View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMakeHost(row.original.id)}
                className="flex cursor-pointer items-center space-x-2"
              >
                <HomeModernIcon className="size-6" />
                <span className="text-nowrap">Make host</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(row.original);
                  setOpenConfirmationDialog(true);
                }}
              >
                <div className="flex h-full w-full cursor-pointer items-center justify-between text-red-500 hover:bg-red-500/10">
                  <div className="flex items-center space-x-2">
                    <Trash2Icon className="size-6" />
                    <span className="text-nowrap">Suspend</span>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [accounts]
  );

  return (
    <>
      <ResourceTable
        columns={columns}
        data={accounts}
        pageSize={5}
        dataLoading={isLoading}
        globalFilter={filter}
        setGlobalFilter={setFilter}
      >
        <UserManagerToolbar />
      </ResourceTable>

      {selectedUser && (
        <AlertDialog
          open={openConfirmationDialog}
          onOpenChange={setOpenConfirmationDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                <span>
                  This action cannot be undone. This will permanently ban
                </span>{" "}
                <span className="font-bold">
                  {formatter.legalName(
                    selectedUser?.personalInformation.legalName
                  )}
                </span>{" "}
                <span>and prevent him from accessing the platform.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleAccountSuspensionConfirmation(selectedUser.id)
                }
                className="hover:brand-600 bg-brand-500 text-white"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
