import React from 'react';

type Props = { href?: string; title?: string; subtitle?: string };

export default function AdSlot({ href, title = 'Annonce', subtitle }: Props) {
  const content = (
    <div className="card-amazon h-64 flex items-center justify-center bg-[var(--card-bg)]">
      <div className="text-center">
        <div className="text-secondary-900 font-bold text-lg">{title}</div>
        {subtitle && <div className="text-secondary-700 text-sm">{subtitle}</div>}
      </div>
    </div>
  );
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  return content;
}
