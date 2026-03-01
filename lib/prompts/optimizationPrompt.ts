import type { AnalyzeRequest } from "@/lib/types";

export const OPTIMIZATION_SYSTEM_PROMPT = `你是一位资深的广告优化专家，擅长根据投放策略给出优化建议。
请根据用户提供的已有策略信息，输出具体的优化建议。

输出要求：
- 使用中文回答
- 包含以下三个维度：关注指标及阈值、低于阈值时的排查方向、下一步优化建议
- 关注指标需涵盖 CTR / CVR / CPA / ROAS
- 给出具体的数值参考范围
- 语言简洁专业，适合运营人员直接参考执行`;

export function buildOptimizationUserPrompt(
  input: AnalyzeRequest,
  mediaPlan: string
): string {
  return `请根据以下信息给出广告优化建议：

商品名称：${input.productName}
目标市场：${input.market}
投放平台：${input.platform}
日预算：${input.dailyBudget} 元
核心目标：${input.goal}

当前投放计划：
${mediaPlan}

请从以下三个维度输出优化建议：
1. 关注指标及阈值（CTR / CVR / CPA / ROAS）
2. 低于阈值时的排查方向
3. 下一步优化建议`;
}
