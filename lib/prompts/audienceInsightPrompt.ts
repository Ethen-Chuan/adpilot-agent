import type { AnalyzeRequest } from "@/lib/types";

export const AUDIENCE_INSIGHT_SYSTEM_PROMPT = `你是一位资深的跨境电商广告投放专家，擅长目标人群分析。
请根据用户提供的商品信息，输出结构清晰的人群洞察分析。

输出要求：
- 使用中文回答
- 包含以下四个维度：目标人群画像、痛点分析、购买动机、建议切入点
- 每个维度用 2-3 句话说明
- 结合具体的市场和平台特征
- 语言简洁专业，适合运营人员直接参考`;

export function buildAudienceInsightUserPrompt(input: AnalyzeRequest): string {
  return `请分析以下商品的目标人群：

商品名称：${input.productName}
商品卖点：${input.sellingPoints}
目标市场：${input.market}
投放平台：${input.platform}
核心目标：${input.goal}

请从以下四个维度输出分析：
1. 目标人群画像
2. 痛点分析
3. 购买动机
4. 建议切入点`;
}
