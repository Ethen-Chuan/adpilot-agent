import type { AnalyzeRequest, AnalyzeResponse, Feedback, HistoryRecord } from "./types";

const HISTORY_KEY = "adpilot_history";
const MAX_RECORDS = 5;

/**
 * 从 localStorage 读取历史记录列表。
 * 按时间倒序排列（最新在前）。
 */
export function getHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 新增一条历史记录。
 * 自动裁剪到最近 MAX_RECORDS 条。
 */
export function addHistory(
  input: AnalyzeRequest,
  result: AnalyzeResponse
): HistoryRecord {
  const record: HistoryRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    input,
    result,
    feedback: null,
  };

  const list = getHistory();
  list.unshift(record);
  const trimmed = list.slice(0, MAX_RECORDS);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }

  return record;
}

/**
 * 更新某条历史记录的反馈。
 */
export function updateFeedback(id: string, feedback: Feedback): void {
  const list = getHistory();
  const target = list.find((r) => r.id === id);
  if (target) {
    target.feedback = feedback;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}
