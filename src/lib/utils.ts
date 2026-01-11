export function cn(...inputs: Array<any>) {
  const out: string[] = [];
  for (const v of inputs) {
    if (!v) continue;
    if (typeof v === 'string' || typeof v === 'number') out.push(String(v));
    else if (Array.isArray(v)) out.push(...v.filter(Boolean).map(String));
    else if (typeof v === 'object') {
      for (const key in v) if (v[key]) out.push(key);
    }
  }
  return out.join(' ');
}
