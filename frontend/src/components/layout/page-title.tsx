interface PageTitleProps extends React.InputHTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <header className={className}>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
