import { PropsWithChildren } from "react";

/**
 * This component is responsible from loading the user settings from the server
 * or from the local storage and setting them in the global store.
 */
export function UserSettingsProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
