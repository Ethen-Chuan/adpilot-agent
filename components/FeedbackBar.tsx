"use client";

import type { Feedback } from "@/lib/types";

interface FeedbackBarProps {
  feedback: Feedback;
  onFeedback: (fb: Feedback) => void;
}

export default function FeedbackBar({ feedback, onFeedback }: FeedbackBarProps) {
  return (
    <div className="flex items-center justify-center gap-4 rounded-xl border border-gray-700 bg-gray-800/60 px-5 py-4">
      <span className="text-sm text-gray-400">本次分析结果对您有帮助吗？</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onFeedback(feedback === "helpful" ? null : "helpful")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
            feedback === "helpful"
              ? "bg-green-600/30 text-green-400 ring-1 ring-green-500/40"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3.75a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 5.25c0 .372-.042.745-.12 1.118a11.963 11.963 0 01-1.11 3.497c-.312.56-.475 1.19-.475 1.834 0 .952.564 1.8 1.396 2.178a2.78 2.78 0 00.842.207l5.845.847c.857.124 1.472.897 1.34 1.756a14.98 14.98 0 01-1.155 3.773c-.2.424-.558.716-.946.832a2.666 2.666 0 01-.728.11H14.25M6.633 10.5H4.5a2.25 2.25 0 00-2.25 2.25v5.25A2.25 2.25 0 004.5 20.25h2.133M6.633 10.5v9.75" />
          </svg>
          有帮助
        </button>
        <button
          onClick={() =>
            onFeedback(feedback === "needs_improvement" ? null : "needs_improvement")
          }
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
            feedback === "needs_improvement"
              ? "bg-orange-600/30 text-orange-400 ring-1 ring-orange-500/40"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1 3.03.98-5.72L3 8.36l5.74-.83L11.42 2.5l2.56 5.03 5.74.83-4.3 4.12.98 5.72-5.1-3.03z" />
          </svg>
          需要优化
        </button>
      </div>
      {feedback && (
        <span className="text-xs text-gray-500">
          {feedback === "helpful" ? "感谢反馈！" : "已记录，后续会持续优化"}
        </span>
      )}
    </div>
  );
}
