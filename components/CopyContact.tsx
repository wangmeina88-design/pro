"use client";

import { useState } from "react";

type CopyContactProps = {
  label: string;
  value: string;
  displayValue: string;
  href?: string;
};

export default function CopyContact({ label, value, displayValue, href }: CopyContactProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="contact-item">
      {href ? <a href={href}>{displayValue}</a> : <span>{displayValue}</span>}
      <button type="button" onClick={copyValue} data-copy-value={value} aria-label={`复制${label}`}>
        {copied ? "已复制" : "复制"}
      </button>
    </div>
  );
}
