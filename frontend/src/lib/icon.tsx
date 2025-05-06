import { icons } from "lucide-react";
import { ReactNode } from "react";

export function renderIcon(
  icon: string,
  iconSizeClassName: string = "size-6"
): ReactNode {
  const Icon = icons[icon as keyof typeof icons];

  if (!Icon)
    return <span className="text-red-500">{`Icon "${icon}" not found`}</span>;

  return <Icon className={iconSizeClassName} />;
}
