import { Field, inputClass } from "@/components/ui/FormControls";
import { cn } from "@/lib/utils";

/** A labelled input with an icon on the left and an optional button on the right. */
export default function AuthField({ id, label, icon: Icon, error, help, labelAction, action, ...inputProps }) {
  return (
    <Field label={label} htmlFor={id} error={error} help={help} labelAction={labelAction}>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          className={cn(inputClass, "pl-11 aria-invalid:border-rose-500", action && "pr-12")}
          {...inputProps}
        />
        {action && <div className="absolute right-2 top-1/2 -translate-y-1/2">{action}</div>}
      </div>
    </Field>
  );
}
