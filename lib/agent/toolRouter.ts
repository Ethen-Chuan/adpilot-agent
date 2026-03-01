import type { AgentContext, ToolResult } from "@/lib/types";
import { runAudienceInsight } from "@/lib/tools/audienceInsight";
import { runCreativeAngle } from "@/lib/tools/creativeAngle";
import { runMediaPlan } from "@/lib/tools/mediaPlan";
import { runOptimization } from "@/lib/tools/optimization";

/**
 * 工具定义：名称、描述、执行函数、以及执行后如何将结果写回上下文。
 */
interface ToolDefinition {
  name: string;
  description: string;
  run: (ctx: AgentContext) => Promise<ToolResult>;
  applyResult: (ctx: AgentContext, result: ToolResult) => void;
}

/**
 * 工具注册表：按执行顺序排列。
 * 后续工具可以读取前序工具写入 ctx 的结果。
 */
const TOOL_PIPELINE: ToolDefinition[] = [
  {
    name: "AudienceInsightTool",
    description: "分析目标人群画像、痛点、购买动机和建议切入点",
    run: runAudienceInsight,
    applyResult: (ctx, result) => {
      ctx.audienceInsight = result.output;
    },
  },
  {
    name: "CreativeAngleTool",
    description: "基于人群洞察生成 3 个广告素材方向及核心文案钩子",
    run: runCreativeAngle,
    applyResult: (ctx, result) => {
      ctx.creativeAngle = result.output;
    },
  },
  {
    name: "MediaPlanTool",
    description: "制定预算分配、测试节奏和投放结构建议",
    run: runMediaPlan,
    applyResult: (ctx, result) => {
      ctx.mediaPlan = result.output;
    },
  },
  {
    name: "OptimizationTool",
    description: "输出关注指标、排查方向和下一步优化建议",
    run: runOptimization,
    applyResult: (ctx, result) => {
      ctx.optimizationAdvice = result.output;
    },
  },
];

/**
 * Tool Router：按顺序调度工具管道。
 *
 * 特性：
 * - 顺序执行，前一个工具的结果通过 ctx 传递给后一个工具
 * - 统一错误处理：单个工具失败时使用 fallback 文案，不会导致整个管道崩溃
 * - 如果任何一个工具调用 LLM 失败，将 ctx.mode 降级为 "fallback"
 * - 每个步骤的执行状态都记录到 ctx.steps 中
 */
export async function runToolPipeline(
  ctx: AgentContext
): Promise<ToolResult[]> {
  const results: ToolResult[] = [];

  for (const tool of TOOL_PIPELINE) {
    ctx.steps.push(`正在执行: ${tool.description}...`);

    const result = await tool.run(ctx);
    results.push(result);

    // 将结果写回上下文，供后续工具使用
    tool.applyResult(ctx, result);

    // 如果工具执行失败（LLM 调用失败但有 fallback），标记模式降级
    if (!result.success) {
      ctx.mode = "fallback";
      ctx.steps.push(
        `⚠ ${tool.name} 执行异常，已使用 fallback 数据: ${result.error}`
      );
    } else {
      ctx.steps.push(`✓ ${tool.name} 执行完成`);
    }
  }

  return results;
}
