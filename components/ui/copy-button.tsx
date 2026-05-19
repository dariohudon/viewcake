"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "Copy as text",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
