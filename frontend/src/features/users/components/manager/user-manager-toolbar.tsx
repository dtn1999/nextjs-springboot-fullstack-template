import { Account } from "@/server/types/domain";
import {
  ToolbarTable,
  useResourceTable,
} from "@/components/table/resource-table";
import { SearchInput } from "@/components/search-input";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { AccountRole, AccountStatus } from "@/server/generated/cozi";

interface UserManagerToolbarProps {}

const userRoles: { label: string; value: AccountRole }[] = [
  {
    label: "Guest",
    value: AccountRole.GUEST,
  },
  {
    label: "Host",
    value: AccountRole.HOST,
  },
  {
    label: "Admin",
    value: AccountRole.ADMIN,
  },
];

const userStatus: { label: string; value: AccountStatus }[] = [
  {
    label: "Active",
    value: AccountStatus.ACTIVE,
  },
  {
    label: "Inactive",
    value: AccountStatus.INACTIVE,
  },
  {
    label: "Deleted",
    value: AccountStatus.DELETED,
  },
  {
    label: "Suspended",
    value: AccountStatus.SUSPENDED,
  },
];

export function UserManagerToolbar({}: UserManagerToolbarProps) {
  const { table, globalFilter, setGlobalFilter } = useResourceTable<Account>();
  const activeFilters = table?.getState().columnFilters.length ?? 0;
  const isFiltered = activeFilters > 0;

  return (
    <ToolbarTable>
      <div className="flex w-full items-center justify-end space-x-2">
        <SearchInput
          value={globalFilter}
          onChange={setGlobalFilter}
          className="w-full max-w-md"
          placeholder="Search by name, email, address, etc..."
        />
        {table?.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={userRoles}
          />
        )}

        {table?.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={userStatus}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table?.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="size-5" />
          </Button>
        )}
      </div>
    </ToolbarTable>
  );
}
