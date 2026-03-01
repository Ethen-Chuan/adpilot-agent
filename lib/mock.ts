import type { AnalyzeRequest, AnalyzeResponse } from "./types";

/**
 * 根据用户输入生成 mock 分析结果。
 * 本轮不接真实 LLM，所有内容均为预设文案。
 */
export function generateMockResponse(input: AnalyzeRequest): AnalyzeResponse {
  return {
    audienceInsight: [
      `【人群洞察】针对「${input.productName}」在${input.market}市场的分析：`,
      `• 核心受众为 25-44 岁对跨境商品有高购买意愿的消费者`,
      `• 该人群活跃于 ${input.platform} 平台，日均使用时长 45 分钟以上`,
      `• 对「${input.sellingPoints}」等卖点关注度较高`,
      `• 建议优先触达中高消费力用户群体`,
    ].join("\n"),

    creativeAngle: [
      `【素材方向】基于${input.platform}平台特性，建议以下素材策略：`,
      `• 短视频素材：突出「${input.sellingPoints}」核心卖点，时长控制在 15-30 秒`,
      `• 图文素材：使用高质量产品图 + 场景化展示`,
      `• UGC 风格内容：真实用户使用场景，增强信任感`,
      `• A/B 测试建议：至少准备 3 组不同风格素材进行测试`,
    ].join("\n"),

    mediaPlan: [
      `【投放计划】${input.platform} 平台 · ${input.market}市场 · 日预算 ${input.dailyBudget} 元`,
      `• 投放目标：${input.goal}`,
      `• 建议投放时段：目标市场当地时间 10:00-22:00`,
      `• 初期测试阶段：建议 3-5 天，每日预算的 60% 用于核心人群`,
      `• 扩量阶段：根据 ROAS 数据逐步提升预算至 150%`,
      `• 预估 CPM 范围：$5-$15（视市场竞争程度浮动）`,
    ].join("\n"),

    optimizationAdvice: [
      `【优化建议】针对「${input.goal}」目标的优化策略：`,
      `• 每 48 小时检查一次广告组表现，关停 CTR < 1% 的素材`,
      `• 利用 Lookalike 人群扩展高转化用户群体`,
      `• 关注频次指标，当频次 > 3 时考虑更换素材`,
      `• 定期更新素材库，避免素材疲劳`,
      `• 建议设置自动规则：CPA 超出目标 30% 时自动降低预算`,
    ].join("\n"),

    agentSteps: [
      "解析商品信息",
      "识别目标市场",
      "生成投放策略",
      "返回建议",
    ],

    mode: "mock",
  };
}
