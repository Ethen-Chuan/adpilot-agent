/** 投放平台 */
export type Platform = "Meta" | "TikTok" | "Google";

/** 核心目标 */
export type Goal = "拉新" | "转化" | "ROI" | "测品";

/** 前端表单输入 */
export interface AnalyzeRequest {
  productName: string;
  sellingPoints: string;
  market: string;
  platform: Platform;
  dailyBudget: string;
  goal: Goal;
}

/** API 返回结构 */
export interface AnalyzeResponse {
  audienceInsight: string;
  creativeAngle: string;
  mediaPlan: string;
  optimizationAdvice: string;
  agentSteps: string[];
  mode: "live" | "fallback" | "mock";
}

/** 单个工具的执行结果 */
export interface ToolResult {
  toolName: string;
  success: boolean;
  output: string;
  error?: string;
}

/** Agent 上下文，在工具链中传递 */
export interface AgentContext {
  input: AnalyzeRequest;
  audienceInsight?: string;
  creativeAngle?: string;
  mediaPlan?: string;
  optimizationAdvice?: string;
  steps: string[];
  mode: "live" | "fallback";
}

/** 用户反馈类型 */
export type Feedback = "helpful" | "needs_improvement" | null;

/** 历史记录条目 */
export interface HistoryRecord {
  id: string;
  timestamp: number;
  input: AnalyzeRequest;
  result: AnalyzeResponse;
  feedback: Feedback;
}
