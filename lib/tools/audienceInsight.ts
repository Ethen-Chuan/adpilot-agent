import type { AgentContext, ToolResult } from "@/lib/types";
import { callLLM, hasApiKey } from "@/lib/services/llm";
import {
  AUDIENCE_INSIGHT_SYSTEM_PROMPT,
  buildAudienceInsightUserPrompt,
} from "@/lib/prompts/audienceInsightPrompt";
import { generateMockResponse } from "@/lib/mock";

const TOOL_NAME = "AudienceInsightTool";

/**
 * 人群洞察工具。
 * 输入：基础商品信息
 * 输出：目标人群画像、痛点、购买动机、建议切入点
 */
export async function runAudienceInsight(
  ctx: AgentContext
): Promise<ToolResult> {
  // 如果没有 API Key，直接使用 fallback
  if (!hasApiKey()) {
    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: true,
      output: mock.audienceInsight,
    };
  }

  try {
    const userPrompt = buildAudienceInsightUserPrompt(ctx.input);
    const output = await callLLM(AUDIENCE_INSIGHT_SYSTEM_PROMPT, userPrompt);
    return { toolName: TOOL_NAME, success: true, output };
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "未知错误";
    console.error(`[${TOOL_NAME}] LLM 调用失败:`, errMsg);

    // fallback 到 mock 数据
    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: false,
      output: mock.audienceInsight,
      error: `LLM 调用失败，已降级为 fallback 数据。原因: ${errMsg}`,
    };
  }
}
