import type { TroubleshootingEntry } from "@/lib/content";

export function TroubleshootingBlock({ entry }: { entry: TroubleshootingEntry }) {
  return (
    <div className="border-t pt-8">
      <h4 className="text-xl font-bold">{entry.title}</h4>
      <div className="mt-4 grid gap-4">
        <div>
          <span className="font-semibold">Problem</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.problem}</p>
        </div>
        <div>
          <span className="font-semibold">Cause</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.cause}</p>
        </div>
        <div>
          <span className="font-semibold">Solution</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.solution}</p>
        </div>
        <div>
          <span className="font-semibold">Result</span>
          <p className="mt-1 text-sm leading-relaxed">{entry.result}</p>
        </div>
      </div>
      {entry.codeBefore && entry.codeAfter && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <span className="text-xs font-semibold text-muted-foreground">Before</span>
            <pre className="mt-1 rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100 overflow-x-auto">
              <code>{entry.codeBefore.code}</code>
            </pre>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground">After</span>
            <pre className="mt-1 rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100 overflow-x-auto">
              <code>{entry.codeAfter.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
