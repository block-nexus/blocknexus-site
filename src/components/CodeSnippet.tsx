interface CodeSnippetProps {
  title?: string;
  code: string;
}

export function CodeSnippet({ title, code }: CodeSnippetProps) {
  return (
    <div className="card-surface rounded-2xl p-4 text-xs">
      {title ? (
        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>{title}</span>
          <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px]">TypeScript</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto rounded-xl bg-slate-950/70 p-3 text-[11px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
