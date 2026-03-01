import type { AnalyzeRequest } from "@/lib/types";

export const MEDIA_PLAN_SYSTEM_PROMPT = `你是一位资深的广告投放策略专家，擅长制定跨境电商的媒体投放计划。
请根据用户提供的商品信息、平台、预算和目标，输出一份结构化的投放计划。

输出要求：
- 使用中文回答
- 包含以下三个维度：预算分配建议、测试节奏建议、投放结构建议
- 投放结构需包含 Campaign / Ad Set / Creative 层级的简要建议
- 结合具体平台的投放特性
- 给出具体的数字建议（如百分比、天数等）
- 语言简洁专业，适合运营人员直接执行`;

export function buildMediaPlanUserPrompt(input: AnalyzeRequest): string {
  return `请为以下商品制定投放计划：

商品名称：${input.productName}
商品卖点：${input.sellingPoints}
目标市场：${input.market}
投放平台：${input.platform}
日预算：${input.dailyBudget} 元
核心目标：${input.goal}

请从以下三个维度输出投放计划：
1. 预算分配建议（含具体比例）
2. 测试节奏建议（含时间节点）
3. 投放结构建议（Campaign / Ad Set / Creative 层级）`;
}
