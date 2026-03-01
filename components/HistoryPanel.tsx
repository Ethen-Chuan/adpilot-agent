"use client";

import type { HistoryRecord } from "@/lib/types";

interface HistoryPanelProps {
  records: HistoryRecord[];
  activeId: string | null;
  onSelect: (record: HistoryRecord) => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hour}:${min}`;
}

function feedbackLabel(fb: HistoryRecord["feedback"]): React.ReactNode {
  if (fb === "helpful") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-green-900/40 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
        有帮助
      </span>
    );
  }
  if (fb === "needs_improvement") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-orange-900/40 px-1.5 py-0.5 text-[10px] font-medium text-orange-400">
        待优化
      </span>
    );
  }
  return null;
}

export default function HistoryPanel({
  records,
  activeId,
  onSelect,
}: HistoryPanelProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-700 p-4 text-center text-xs text-gray-500">
        暂无历史记录
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        最近分析（{records.length}）
      </h3>
      <ul className="space-y-1.5">
        {records.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onSelect(r)}
              className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                activeId === r.id
                  ? "bg-blue-600/20 ring-1 ring-blue-500/30"
                  : "bg-gray-800/40 hover:bg-gray-700/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium text-gray-200">
                  {r.input.productName}
                </span>
                {feedbackLabel(r.feedback)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>{r.input.platform}</span>
                <span>·</span>
                <span>{r.input.market}</span>
                <span>·</span>
                <span>{formatTime(r.timestamp)}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
