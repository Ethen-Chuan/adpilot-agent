"use client";

import { useState } from "react";

interface ResultCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

export default function ResultCard({ title, content, icon }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: 旧浏览器
      const ta = document.createElement("textarea");
      ta.value = content;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group rounded-xl border border-gray-700 bg-gray-800/60 p-5 transition-colors hover:border-gray-600">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
            {icon}
          </span>
          <h3 className="text-base font-semibold text-gray-100">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          title="复制内容"
          className="shrink-0 rounded-md p-1.5 text-gray-500 opacity-0 transition-all hover:bg-gray-700 hover:text-gray-300 group-hover:opacity-100"
        >
          {copied ? (
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
          )}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300 font-sans">
        {content}
      </pre>
    </div>
  );
}
