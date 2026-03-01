import type { AnalyzeRequest, AnalyzeResponse, AgentContext } from "@/lib/types";
import { hasApiKey } from "@/lib/services/llm";
import { runToolPipeline } from "./toolRouter";

/**
 * Agent Orchestrator：核心编排器。
 *
 * 执行流程：
 * 1. 解析输入并初始化上下文
 * 2. 判断 API Key 可用性，确定初始模式（live / fallback）
 * 3. 调用 Tool Router 顺序执行 4 个工具
 * 4. 汇总结构化结果
 * 5. 返回前端所需的 AnalyzeResponse
 */
export async function runOrchestrator(
  input: AnalyzeRequest
): Promise<AnalyzeResponse> {
  // Step 1: 初始化 Agent 上下文
  const ctx: AgentContext = {
    input,
    steps: [],
    mode: hasApiKey() ? "live" : "fallback",
  };

  // Step 2: 记录启动信息
  ctx.steps.push("开始分析: 解析商品信息与投放需求");

  if (ctx.mode === "fallback") {
    ctx.steps.push("⚠ 未检测到 API Key，将使用 fallback 模式");
  } else {
    ctx.steps.push("✓ API Key 已配置，使用 live 模式调用 LLM");
  }

  // Step 3: 识别平台和市场语境
  ctx.steps.push(
    `识别投放语境: ${input.platform} 平台 · ${input.market}市场 · 目标${input.goal}`
  );

  // Step 4: 调用 Tool Router 执行工具管道
  await runToolPipeline(ctx);

  // Step 5: 汇总结果
  ctx.steps.push("汇总分析结果，生成最终报告");

  // Step 6: 构造返回结构
  const response: AnalyzeResponse = {
    audienceInsight: ctx.audienceInsight || "人群洞察数据生成失败",
    creativeAngle: ctx.creativeAngle || "素材方向数据生成失败",
    mediaPlan: ctx.mediaPlan || "投放计划数据生成失败",
    optimizationAdvice: ctx.optimizationAdvice || "优化建议数据生成失败",
    agentSteps: ctx.steps,
    mode: ctx.mode,
  };

  return response;
}
