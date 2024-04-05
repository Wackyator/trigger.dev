import {
  isExceptionSpanEvent,
  type ExceptionEventProperties,
  type SpanEvent as OtelSpanEvent,
} from "@trigger.dev/core/v3";
import { CodeBlock } from "~/components/code/CodeBlock";
import { Callout } from "~/components/primitives/Callout";
import { DateTimeAccurate } from "~/components/primitives/DateTime";
import { Header2 } from "~/components/primitives/Headers";
import { Paragraph } from "~/components/primitives/Paragraph";

type SpanEventsProps = {
  spanEvents: OtelSpanEvent[];
};

export function SpanEvents({ spanEvents }: SpanEventsProps) {
  return (
    <div className="flex flex-col gap-4">
      {spanEvents.map((event, index) => (
        <SpanEvent key={index} spanEvent={event} />
      ))}
    </div>
  );
}

function SpanEventHeader({
  title,
  titleClassName,
  time,
}: {
  title: string;
  titleClassName?: string;
  time: Date;
}) {
  return (
    <div className="flex items-center justify-between">
      <Header2 className={titleClassName}>{title}</Header2>
      <Paragraph variant="small">
        <DateTimeAccurate date={time} />
      </Paragraph>
    </div>
  );
}

function SpanEvent({ spanEvent }: { spanEvent: OtelSpanEvent }) {
  if (isExceptionSpanEvent(spanEvent)) {
    return <SpanEventError spanEvent={spanEvent} exception={spanEvent.properties.exception} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <SpanEventHeader title={spanEvent.name} time={spanEvent.time} />
      {spanEvent.properties && (
        <CodeBlock code={JSON.stringify(spanEvent.properties, null, 2)} maxLines={20} />
      )}
    </div>
  );
}

function SpanEventError({
  spanEvent,
  exception,
}: {
  spanEvent: OtelSpanEvent;
  exception: ExceptionEventProperties;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-rose-500/50 p-3">
      <SpanEventHeader
        title={exception.type ?? "Error"}
        time={spanEvent.time}
        titleClassName="text-rose-500"
      />
      {exception.message && <Callout variant="error">{exception.message}</Callout>}
      {exception.stacktrace && (
        <CodeBlock
          showCopyButton={false}
          showLineNumbers={false}
          code={exception.stacktrace}
          maxLines={20}
        />
      )}
    </div>
  );
}
