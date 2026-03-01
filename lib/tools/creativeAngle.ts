import type { AgentContext, ToolResult } from "@/lib/types";
import { callLLM, hasApiKey } from "@/lib/services/llm";
import {
  CREATIVE_ANGLE_SYSTEM_PROMPT,
  buildCreativeAngleUserPrompt,
} from "@/lib/prompts/creativeAnglePrompt";
import { generateMockResponse } from "@/lib/mock";

const TOOL_NAME = "CreativeAngleTool";

/**
 * 素材方向工具。
 * 输入：基础商品信息 + 人群洞察
 * 输出：3 个广告素材方向，每个方向含核心文案钩子
 */
export async function runCreativeAngle(
  ctx: AgentContext
): Promise<ToolResult> {
  if (!hasApiKey()) {
    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: true,
      output: mock.creativeAngle,
    };
  }

  try {
    const audienceInsight = ctx.audienceInsight || "暂无人群洞察数据";
    const userPrompt = buildCreativeAngleUserPrompt(ctx.input, audienceInsight);
    const output = await callLLM(CREATIVE_ANGLE_SYSTEM_PROMPT, userPrompt);
    return { toolName: TOOL_NAME, success: true, output };
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "未知错误";
    console.error(`[${TOOL_NAME}] LLM 调用失败:`, errMsg);

    const mock = generateMockResponse(ctx.input);
    return {
      toolName: TOOL_NAME,
      success: false,
      output: mock.creativeAngle,
      error: `LLM 调用失败，已降级为 fallback 数据。原因: ${errMsg}`,
    };
  }
}
