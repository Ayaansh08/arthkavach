"use client";

import React, { useState } from "react";
import { Copy, Check, ShieldCheck } from "lucide-react";

interface HashChipProps {
  hash: string;
  prefix?: string;
  truncateLength?: number;
  className?: string;
}

export function HashChip({
  hash,
  prefix = "SHA-256",
  truncateLength = 8,
  className = "",
}: HashChipProps) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const cleanHash = hash.replace(/^SHA:/i, "");
  const truncated =
    cleanHash.length > truncateLength * 2
      ? `${cleanHash.slice(0, truncateLength)}...${cleanHash.slice(-truncateLength)}`
      : cleanHash;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => setShowFull(!showFull)}
      title="Click to toggle full hash / Copy"
      className={`inline-flex items-center gap-1.5 px-2 py-1 bg-[#1A1F1B]/5 border border-[#1A1F1B]/25 hover:border-[#F2A900] hover:bg-[#F2A900]/10 font-mono text-[11px] cursor-pointer transition-colors ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#1A1F1B]/70 shrink-0" strokeWidth={1.5} />
      {prefix && (
        <span className="font-semibold text-[9.5px] uppercase tracking-wider text-[#1A1F1B]/60 border-r border-[#1A1F1B]/20 pr-1.5">
          {prefix}
        </span>
      )}
      <span className="font-mono text-xs tabular-nums text-[#0C1411]">
        {showFull ? cleanHash : truncated}
      </span>
      <button
        onClick={copyToClipboard}
        className="ml-1 p-0.5 hover:text-[#C4301C] transition-colors"
        title="Copy raw hash"
      >
        {copied ? (
          <Check className="w-3 h-3 text-[#1E8A5A]" />
        ) : (
          <Copy className="w-3 h-3 text-[#1A1F1B]/60" />
        )}
      </button>
    </div>
  );
}
