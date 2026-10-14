import { cn } from "@/lib/utils";

/** A grey block that pulses where content is still loading. Size and round it with `className`. */
export default function Skeleton({ className, style }) {
  return <div aria-hidden="true" style={style} className={cn("animate-pulse rounded-xl bg-elevated", className)} />;
}
