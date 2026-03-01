import { NextRequest, NextResponse } from "next/server";
import type { AnalyzeRequest } from "@/lib/types";
import { runOrchestrator } from "@/lib/agent/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    // 基础校验
    const requiredFields: (keyof AnalyzeRequest)[] = [
      "productName",
      "sellingPoints",
      "market",
      "platform",
      "dailyBudget",
      "goal",
    ];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `缺少必填字段: ${field}` },
          { status: 400 }
        );
      }
    }

    // 调用 Agent Orchestrator 执行真实分析流程
    const result = await runOrchestrator(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}
