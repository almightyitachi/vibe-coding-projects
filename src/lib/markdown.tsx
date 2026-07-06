import type { ReactNode } from "react";

/** Minimal, safe markdown-ish renderer for the documentation reader. */
export function renderDoc(body: string): ReactNode {
  const lines = body.split("\n");
  const out: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length) {
      out.push(
        <ul key={key++}>
          {list.map((li, i) => <li key={i}>{inline(li)}</li>)}
        </ul>,
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) { flushList(); out.push(<h2 key={key++}>{inline(line.slice(3))}</h2>); }
    else if (line.startsWith("### ")) { flushList(); out.push(<h3 key={key++}>{inline(line.slice(4))}</h3>); }
    else if (line.startsWith("# ")) { flushList(); out.push(<h1 key={key++}>{inline(line.slice(2))}</h1>); }
    else if (line.startsWith("> ")) { flushList(); out.push(<blockquote key={key++}>{inline(line.slice(2))}</blockquote>); }
    else if (line.startsWith("- ")) { list.push(line.slice(2)); }
    else if (line.trim() === "") { flushList(); }
    else { flushList(); out.push(<p key={key++}>{inline(line)}</p>); }
  }
  flushList();
  return <div className="prose-doc">{out}</div>;
}

function inline(text: string): ReactNode {
  // Handle **bold** and `code`
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={i++}>{tok.slice(2, -2)}</strong>);
    else parts.push(<code key={i++}>{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
