import React from "react";

function inline(text: string, keyBase: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) return <code key={key}>{part.slice(1, -1)}</code>;
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={key}>{part.slice(1, -1)}</em>;
    return part;
  });
}

const BULLET = /^[*\-•]\s+/;
const NUMBERED = /^\d+[.)]\s+/;

function cells(row: string): string[] {
  return row.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

export function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n").map((l) => l.trim());
  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = `b${out.length}`;

    if (!line) { i++; continue; }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) { rows.push(cells(lines[i])); i++; }
      const isSep = (r: string[]) => r.every((c) => /^:?-{2,}:?$/.test(c));
      const hasHeader = rows.length > 1 && isSep(rows[1]);
      const body = rows.filter((r, idx) => !isSep(r) && !(hasHeader && idx === 0));
      out.push(
        <div className="md-table-wrap" key={key}>
          <table>
            {hasHeader && (
              <thead><tr>{rows[0].map((c, ci) => <th key={ci}>{inline(c, `${key}h${ci}`)}</th>)}</tr></thead>
            )}
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{r.map((c, ci) => <td key={ci}>{inline(c, `${key}r${ri}c${ci}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (BULLET.test(line)) {
      const items: string[] = [];
      while (i < lines.length && BULLET.test(lines[i])) { items.push(lines[i].replace(BULLET, "")); i++; }
      out.push(<ul key={key}>{items.map((t, li) => <li key={li}>{inline(t, `${key}l${li}`)}</li>)}</ul>);
      continue;
    }

    if (NUMBERED.test(line)) {
      const items: string[] = [];
      while (i < lines.length && NUMBERED.test(lines[i])) { items.push(lines[i].replace(NUMBERED, "")); i++; }
      out.push(<ol key={key}>{items.map((t, li) => <li key={li}>{inline(t, `${key}l${li}`)}</li>)}</ol>);
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      out.push(<h4 key={key} className="md-heading">{inline(line.replace(/^#{1,6}\s+/, ""), key)}</h4>);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line)) { out.push(<hr key={key} />); i++; continue; }

    out.push(<p key={key}>{inline(line, key)}</p>);
    i++;
  }

  return out;
}

export function TypingDots() {
  return (
    <span className="typing-dots" aria-label="Thinking">
      <i /><i /><i />
    </span>
  );
}
