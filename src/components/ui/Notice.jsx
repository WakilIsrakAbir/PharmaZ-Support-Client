/** A centred icon, title and line of text, for empty, error and "not allowed" states. */
export default function Notice({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col items-center rounded-2xl px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent-text">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{text}</p>
      {children}
    </div>
  );
}
