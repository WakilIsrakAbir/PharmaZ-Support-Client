import { ListChecks, MessageSquareQuote, Pencil, Target } from "lucide-react";
import { useProductSetup } from "@/hooks/useProductSetup";
import { formatDate, formatDuration, formatTime } from "@/lib/format";
import { formatAnswer } from "@/lib/product-setup";
import { cn } from "@/lib/utils";
import { DialogBody, DialogFooter, secondaryButtonClass } from "@/components/ui/DialogParts";
import { Dash, DirectionLabel, PriorityBadge, StatusBadge } from "./CallBadges";

/** The read-only view of a call inside the details dialog. */
export default function CallSummary({ call, canEdit, onEdit, onClose }) {
  const { setup } = useProductSetup();
  const answers = call.customFields ?? {};
  // Every field this call has an answer for, including fields switched off since
  const extraFields = (setup?.customFields ?? []).filter((field) => answers[field.key] !== undefined);

  return (
    <>
      <DialogBody>
        <section className="overflow-hidden rounded-xl border border-border bg-background/40">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">The call</h3>
            <StatusBadge status={call.status} />
          </div>
          <dl className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Stat label="Date & time">
              <span className="block font-semibold">{formatDate(call.calledAt)}</span>
              <span className="block font-mono text-xs text-muted">{formatTime(call.calledAt)}</span>
            </Stat>
            <Stat label="Duration">
              <span className="font-mono font-semibold">{formatDuration(call.durationSeconds)}</span>
            </Stat>
            <Stat label="Direction">
              <DirectionLabel direction={call.direction} />
            </Stat>
          </dl>
        </section>

        <dl className="grid gap-x-8 sm:grid-cols-2">
          <Detail label="Support person">{call.createdBy?.name}</Detail>
          <Detail label="Problem type">
            {/* The area's name as it was when the call was logged */}
            {call.areaName && (
              <>
                {call.areaName}
                {call.issue && <span className="mt-0.5 block text-xs font-normal text-muted">{call.issue}</span>}
              </>
            )}
          </Detail>
          <Detail label="Customer ID" mono>
            {call.customerId}
          </Detail>
          <Detail label="Mobile" mono>
            {call.mobile}
          </Detail>
          <Detail label="Transaction no." mono>
            {call.transactionNo}
          </Detail>
          <Detail label="Priority">{call.priority && <PriorityBadge priority={call.priority} />}</Detail>
        </dl>

        {extraFields.length > 0 && (
          <section>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
              <ListChecks className="size-4 text-accent-text" />
              Details
            </h3>
            <dl className="grid gap-x-8 sm:grid-cols-2">
              {extraFields.map((field) => (
                <Detail key={field.key} label={field.label} mono={field.type === "number"}>
                  {formatAnswer(field, answers[field.key])}
                </Detail>
              ))}
            </dl>
          </section>
        )}

        <Note icon={Target} title="Outcome" text={call.outcome} emptyText="No outcome recorded." />
        <Note icon={MessageSquareQuote} title="Comments" text={call.comments} emptyText="No comments recorded." />
      </DialogBody>

      <DialogFooter>
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Close
        </button>
        {canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Pencil className="size-4" />
            Update call
          </button>
        )}
      </DialogFooter>
    </>
  );
}

function Stat({ label, children }) {
  return (
    <div className="px-4 py-3">
      <dt className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Detail({ label, mono, children }) {
  return (
    <div className="border-b border-border py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={cn("mt-0.5 text-sm font-semibold", mono && "font-mono")}>{children || <Dash />}</dd>
    </div>
  );
}

function Note({ icon: Icon, title, text, emptyText }) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-accent-text" />
        {title}
      </h3>
      <p
        className={cn(
          "whitespace-pre-line border-l-2 pl-3 text-sm",
          text ? "border-accent/60" : "border-border italic text-muted",
        )}
      >
        {text || emptyText}
      </p>
    </section>
  );
}
