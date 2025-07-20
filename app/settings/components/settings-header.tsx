export function SettingsHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4 flex flex-col">
      <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
      {description && <p className="text-muted-foreground text-sm md:text-base">{description}</p>}
    </div>
  );
}
