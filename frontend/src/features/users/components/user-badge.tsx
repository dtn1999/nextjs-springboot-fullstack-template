import { Badge } from "@/components/ui/badge";
import { AccountRole, AccountStatus } from "@/server/generated/cozi";

export function AccountRoleBadge({ role }: { role: AccountRole }) {
  if (role === AccountRole.ADMIN) {
    return <Badge color="green">{role}</Badge>;
  }
  if (role === AccountRole.HOST) {
    return <Badge color="pink">{role}</Badge>;
  }
  if (role === AccountRole.GUEST) {
    return <Badge color="indigo">{role}</Badge>;
  }

  return <div className="text-red-500">Unknown role</div>;
}

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  if (status === AccountStatus.ACTIVE) {
    return <Badge color="green">{status}</Badge>;
  }

  if (status === AccountStatus.INACTIVE) {
    return <Badge color="gray">{status}</Badge>;
  }

  if (status === AccountStatus.DELETED) {
    return <Badge color="red">{status}</Badge>;
  }

  if (status === AccountStatus.SUSPENDED) {
    return <Badge color="yellow">{status}</Badge>;
  }

  return <div className="text-red-500">Unknown role</div>;
}
