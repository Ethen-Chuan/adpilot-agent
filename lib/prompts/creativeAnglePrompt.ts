import type { AnalyzeRequest } from "@/lib/types";

export const CREATIVE_ANGLE_SYSTEM_PROMPT = `你是一位资深的广告创意策划专家，擅长为跨境电商产品设计广告素材方向。
请根据用户提供的商品信息和人群洞察，输出 3 个广告素材方向。

输出要求：
- 使用中文回答
- 提供 3 个不同的素材方向
- 每个方向包含：方向名称、创意说明、一句核心文案钩子（Hook）
- 素材方向需要适配指定的投放平台特性
- 语言简洁有力，适合直接用于创意 Brief`;

export function buildCreativeAngleUserPrompt(
  input: AnalyzeRequest,
  audienceInsight: string
): string {
  return `请为以下商品设计 3 个广告素材方向：

商品名称：${input.productName}
商品卖点：${input.sellingPoints}
目标市场：${input.market}
投放平台：${input.platform}

参考人群洞察：
${audienceInsight}

请输出 3 个素材方向，每个方向包含：
1. 方向名称
2. 创意说明（2-3 句话）
3. 一句核心文案钩子（Hook）`;
}
