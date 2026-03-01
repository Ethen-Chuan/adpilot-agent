import type { AgentContext, ToolResult } from "@/lib/types";
import { callLLM, hasApiKey } from "@/lib/services/llm";
import {
  OPTIMIZATION_SYSTEM_PROMPT,
  buildOptimizationUserPrompt,
} from "@/lib/prompts/optimizationPrompt";
import { generateMockResponse } from "@/lib/mock";

const TOOL_NAME = "OptimizationTool";

/**
 * 优化建议工具。
 * 输入：已有策略（投放计划）
 * 输出：关注指标、排查方向、下一步优化建议
 */
export async function runOptimization(
  ctx: AgentContext
): Promise<ToolResult> {
  if (!hasApiKey()) {
    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: true,
      output: mock.optimizationAdvice,
    };
  }

  try {
    const mediaPlan = ctx.mediaPlan || "暂无投放计划数据";
    const userPrompt = buildOptimizationUserPrompt(ctx.input, mediaPlan);
    const output = await callLLM(OPTIMIZATION_SYSTEM_PROMPT, userPrompt);
    return { toolName: TOOL_NAME, success: true, output };
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "未知错误";
    console.error(`[${TOOL_NAME}] LLM 调用失败:`, errMsg);

    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: false,
      output: mock.optimizationAdvice,
      error: `LLM 调用失败，已降级为 fallback 数据。原因: ${errMsg}`,
    };
  }
}
