import type { AgentContext, ToolResult } from "@/lib/types";
import { callLLM, hasApiKey } from "@/lib/services/llm";
import {
  MEDIA_PLAN_SYSTEM_PROMPT,
  buildMediaPlanUserPrompt,
} from "@/lib/prompts/mediaPlanPrompt";
import { generateMockResponse } from "@/lib/mock";

const TOOL_NAME = "MediaPlanTool";

/**
 * 投放计划工具。
 * 输入：基础商品信息 + 平台 + 预算 + 目标
 * 输出：预算分配建议、测试节奏建议、投放结构建议
 */
export async function runMediaPlan(
  ctx: AgentContext
): Promise<ToolResult> {
  if (!hasApiKey()) {
    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: true,
      output: mock.mediaPlan,
    };
  }

  try {
    const userPrompt = buildMediaPlanUserPrompt(ctx.input);
    const output = await callLLM(MEDIA_PLAN_SYSTEM_PROMPT, userPrompt);
    return { toolName: TOOL_NAME, success: true, output };
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "未知错误";
    console.error(`[${TOOL_NAME}] LLM 调用失败:`, errMsg);

    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: false,
      output: mock.mediaPlan,
      error: `LLM 调用失败，已降级为 fallback 数据。原因: ${errMsg}`,
    };
  }
}
