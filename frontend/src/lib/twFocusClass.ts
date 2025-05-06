export default function twFocusClass(hasRing = false): string {
  if (!hasRing) {
    return "focus:outline-none";
  }
  return "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 dark:focus:ring-offset-0";
}
