"use client";

interface StepListProps {
  steps: string[];
  loading: boolean;
}

export default function StepList({ steps, loading }: StepListProps) {
  if (steps.length === 0 && !loading) return null;

  const placeholders = [
    "解析商品信息与投放需求",
    "识别目标市场与人群特征",
    "生成投放策略与素材方向",
    "输出优化建议与执行计划",
  ];

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
        <h3 className="text-base font-semibold text-gray-100">
          Agent 执行步骤
        </h3>
        {loading && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-blue-900/40 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-blue-500/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            执行中
          </span>
        )}
      </div>
      <ol className="space-y-2.5">
        {loading && steps.length === 0
          ? placeholders.map((placeholder, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg bg-gray-800/40 px-3 py-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-gray-500">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-500 animate-pulse">
                  {placeholder}
                </span>
              </li>
            ))
          : steps.map((step, i) => {
              const isComplete = step.startsWith("✓");
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
                    isComplete ? "bg-green-900/10" : "bg-gray-800/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isComplete
                        ? "bg-green-600/20 text-green-400"
                        : "bg-blue-600/20 text-blue-400"
                    }`}
                  >
                    {isComplete ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="text-sm text-gray-200">{step}</span>
                </li>
              );
            })}
      </ol>
    </div>
  );
}
