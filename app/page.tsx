"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import InputForm from "@/components/InputForm";
import type { InputFormRef } from "@/components/InputForm";
import ResultCard from "@/components/ResultCard";
import StepList from "@/components/StepList";
import FeedbackBar from "@/components/FeedbackBar";
import HistoryPanel from "@/components/HistoryPanel";
import { getHistory, addHistory, updateFeedback } from "@/lib/history";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  Feedback,
  HistoryRecord,
} from "@/lib/types";

/* ── Mode Badge ─────────────────────────────────────── */

function ModeBadge({ mode }: { mode: string }) {
  if (mode === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-900/40 px-3 py-1 text-xs font-semibold text-green-400 ring-1 ring-green-500/30">
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        Live Mode
      </span>
    );
  }
  if (mode === "fallback") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-900/40 px-3 py-1 text-xs font-semibold text-yellow-400 ring-1 ring-yellow-500/30">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        Fallback Mode
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-700/40 px-3 py-1 text-xs font-semibold text-gray-400 ring-1 ring-gray-500/30">
      <span className="h-2 w-2 rounded-full bg-gray-400" />
      Mock
    </span>
  );
}

/* ── Result Card Icons ──────────────────────────────── */

const icons = {
  audience: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  creative: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  media: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  optimization: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  ),
};

/* ── Main Page ──────────────────────────────────────── */

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<AnalyzeRequest | null>(null);

  // 历史记录
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // 当前反馈
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>(null);

  const formRef = useRef<InputFormRef>(null);

  // 初始化：读取历史记录
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  /* ── Submit ─────────────────────────────────────── */

  const handleSubmit = useCallback(async (data: AnalyzeRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastInput(data);
    setActiveHistoryId(null);
    setCurrentFeedback(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || `请求失败 (${res.status})`);
      }

      const json: AnalyzeResponse = await res.json();
      setResult(json);

      // 写入历史记录
      const record = addHistory(data, json);
      setHistory(getHistory());
      setActiveHistoryId(record.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Retry ──────────────────────────────────────── */

  const handleRetry = () => {
    if (lastInput) handleSubmit(lastInput);
  };

  /* ── History Select ─────────────────────────────── */

  const handleHistorySelect = (record: HistoryRecord) => {
    setActiveHistoryId(record.id);
    setResult(record.result);
    setCurrentFeedback(record.feedback);
    setError(null);
    setLastInput(record.input);
    formRef.current?.setFormData(record.input);
  };

  /* ── Feedback ───────────────────────────────────── */

  const handleFeedback = (fb: Feedback) => {
    setCurrentFeedback(fb);
    if (activeHistoryId) {
      updateFeedback(activeHistoryId, fb);
      setHistory(getHistory());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* ── Header ──────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AdPilot Agent</h1>
              <p className="text-xs text-gray-400">
                AI 驱动的跨境电商广告投流 Copilot — 一键生成人群洞察、素材方向、投放计划与优化建议
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ── 左侧：输入 + 历史 ─────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-6">
                <h2 className="mb-5 text-base font-semibold text-gray-100">
                  广告投放信息
                </h2>
                <InputForm
                  ref={formRef}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </div>

              {/* 历史记录 */}
              <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-4">
                <HistoryPanel
                  records={history}
                  activeId={activeHistoryId}
                  onSelect={handleHistorySelect}
                />
              </div>
            </div>
          </div>

          {/* ── 右侧：结果区 ──────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="rounded-xl border border-red-800/60 bg-red-900/20 p-5">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-300">分析请求失败</p>
                    <p className="mt-1 text-sm text-red-400/80">{error}</p>
                  </div>
                  {lastInput && (
                    <button
                      onClick={handleRetry}
                      disabled={loading}
                      className="shrink-0 rounded-lg bg-red-700/40 px-4 py-2 text-xs font-medium text-red-200 hover:bg-red-700/60 transition-colors disabled:opacity-50"
                    >
                      重试
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Agent 步骤 */}
            <StepList steps={result?.agentSteps ?? []} loading={loading} />

            {/* 结果卡片 */}
            {result && (
              <>
                {/* Mode Badge */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-100">分析结果</h2>
                  <ModeBadge mode={result.mode} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ResultCard
                    title="Audience Insight · 人群洞察"
                    content={result.audienceInsight}
                    icon={icons.audience}
                  />
                  <ResultCard
                    title="Creative Angle · 素材方向"
                    content={result.creativeAngle}
                    icon={icons.creative}
                  />
                  <ResultCard
                    title="Media Plan · 投放计划"
                    content={result.mediaPlan}
                    icon={icons.media}
                  />
                  <ResultCard
                    title="Optimization · 优化建议"
                    content={result.optimizationAdvice}
                    icon={icons.optimization}
                  />
                </div>

                {/* 反馈闭环 */}
                <FeedbackBar
                  feedback={currentFeedback}
                  onFeedback={handleFeedback}
                />
              </>
            )}

            {/* 空状态 */}
            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 py-24 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
                  <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-400">
                  填写左侧表单并点击「开始分析」
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  AI 将为您生成人群洞察、素材方向、投放计划与优化建议
                </p>
              </div>
            )}

            {/* Loading 状态（无步骤时） */}
            {loading && !result && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-blue-800/30 bg-blue-900/10 py-16 text-center">
                <svg className="mb-4 h-8 w-8 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm font-medium text-blue-300">
                  Agent 正在分析中，请稍候…
                </p>
                <p className="mt-1 text-xs text-blue-400/60">
                  通常需要 10-30 秒完成全部分析
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        AdPilot Agent v0.3.0 · Round 3 Polish &amp; Handoff
      </footer>
    </div>
  );
}
