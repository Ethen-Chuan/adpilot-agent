# AdPilot Agent 项目状态

本文档记录了项目在 **Round 3** 结束时的状态，用于在不同环境或账号中继续开发。

## 1. 当前版本号

v0.3.0 demo

## 2. 当前已完成功能总表

| 功能模块 | 描述 | 状态 |
| :--- | :--- | :--- |
| **核心 Agent** | 实现了基于 `Orchestrator` 和 `Tool Router` 的真实 LLM 调用链。 | 已完成 |
| **LLM 服务层** | 封装了 OpenAI API 调用，支持从环境变量读取 `OPENAI_API_KEY`。 | 已完成 |
| **独立工具函数** | 4 个独立工具（人群洞察、素材方向、投放计划、优化建议）及其 Prompt 模板。 | 已完成 |
| **Live / Fallback 模式** | 根据 `OPENAI_API_KEY` 自动切换 `live` 或 `fallback` 模式。 | 已完成 |
| **前端表单校验** | 商品名称、卖点、市场必填，日预算必须为正数。 | 已完成 |
| **历史记录** | 使用 `localStorage` 保存最近 5 次分析请求和结果，可点击回填。 | 已完成 |
| **反馈闭环** | 每次结果后提供“有帮助”/“需要优化”按钮，状态存入 `localStorage`。 | 已完成 |
| **示例输入** | 提供一键填充示例数据的按钮，方便演示。 | 已完成 |
| **结果复制** | 每个结果卡片提供“复制内容”按钮。 | 已完成 |
| **UI 打磨** | 页面层级、卡片标题、Agent 步骤区、mode 标识、空/错误状态视觉优化。 | 已完成 |
| **可迁移文档** | `PROJECT_STATE`, `NEXT_STEPS`, `CHANGELOG`, `README`。 | 已完成 |
| **交接文档** | 新增 `HANDOFF.md`, `FILE_MAP.md`。 | 已完成 |

## 3. 当前未完成功能总表

| 功能模块 | 描述 | 状态 |
| :--- | :--- | :--- |
| **结构化输出** | LLM 输出仍为纯文本，未强制 JSON 格式。 | 待完成 |
| **流式响应** | API 仍为一次性返回，无实时步骤和结果流。 | 待完成 |
| **前端交互优化** | 缺少取消请求、更精细的 Loading 状态（如当前步骤高亮）。 | 待完成 |
| **错误处理** | 错误提示不够具体，无详细错误码或建议。 | 待完成 |
| **扩展工具集** | 暂无竞品分析、预算建议等高级工具。 | 待完成 |

## 4. 当前文件树（核心）

```
.
├── .env.example
├── README.md
├── app
│   ├── api/analyze/route.ts
│   └── page.tsx
├── components
│   ├── FeedbackBar.tsx
│   ├── HistoryPanel.tsx
│   ├── InputForm.tsx
│   ├── ResultCard.tsx
│   └── StepList.tsx
├── docs
│   ├── CHANGELOG.md
│   ├── FILE_MAP.md
│   ├── HANDOFF.md
│   ├── NEXT_STEPS.md
│   └── PROJECT_STATE.md
├── lib
│   ├── agent
│   │   ├── orchestrator.ts
│   │   └── toolRouter.ts
│   ├── history.ts
│   ├── mock.ts
│   ├── prompts
│   │   ├── audienceInsightPrompt.ts
│   │   ├── creativeAnglePrompt.ts
│   │   ├── mediaPlanPrompt.ts
│   │   └── optimizationPrompt.ts
│   ├── services
│   │   └── llm.ts
│   ├── tools
│   │   ├── audienceInsight.ts
│   │   ├── creativeAngle.ts
│   │   ├── mediaPlan.ts
│   │   └── optimization.ts
│   └── types.ts
└── package.json
```

## 5. 当前 API 输入输出结构

### `POST /api/analyze` 请求体 (`AnalyzeRequest`)

```typescript
interface AnalyzeRequest {
  productName: string; // 商品名称
  sellingPoints: string; // 商品卖点
  market: string; // 目标市场
  platform: "Meta" | "TikTok" | "Google"; // 投放平台
  dailyBudget: string; // 日预算（字符串，前端校验为正数）
  goal: "拉新" | "转化" | "ROI" | "测品"; // 核心目标
}
```

### `POST /api/analyze` 响应体 (`AnalyzeResponse`)

```typescript
interface AnalyzeResponse {
  audienceInsight: string; // 人群洞察结果 (Markdown 格式)
  creativeAngle: string; // 素材方向结果 (Markdown 格式)
  mediaPlan: string; // 投放计划结果 (Markdown 格式)
  optimizationAdvice: string; // 优化建议结果 (Markdown 格式)
  agentSteps: string[]; // Agent 执行步骤列表
  mode: "live" | "fallback" | "mock"; // 当前运行模式
}
```

## 6. 当前本地存储字段说明

| 字段名 | 存储位置 | 存储内容 | 描述 |
| :--- | :--- | :--- | :--- |
| `adpilot_form_input` | `localStorage` | `AnalyzeRequest` JSON 字符串 | 用户上次填写的表单数据，用于恢复输入。 |
| `adpilot_history` | `localStorage` | `HistoryRecord[]` JSON 字符串 | 最近 5 次分析请求和结果的列表，包含用户反馈。 |

## 7. 当前 Fallback 机制说明

- 当 `OPENAI_API_KEY` 环境变量未配置或无效时，系统会自动切换到 `fallback` 模式。
- 在 `fallback` 模式下，LLM 调用将不会实际发生，而是直接使用 `lib/mock.ts` 中预设的 mock 数据作为结果。
- 这种机制确保了即使在没有 LLM API Key 的情况下，应用的核心功能（表单提交、结果展示、历史记录等）依然可用，方便演示和测试。
- 前端会显示 "Fallback Mode" 徽章以提示用户当前模式。

## 8. 已知限制

- LLM 输出仍为纯文本，未强制结构化，可能存在格式不一致问题。
- API 响应非流式，用户需等待所有结果生成完毕。
- 错误处理和提示仍有优化空间。
- 暂不支持取消正在进行的分析请求。

## 9. 若切换到新账号，应该先读哪些文件

1.  `README.md`: 快速了解项目概览、运行方式和交接流程。
2.  `docs/PROJECT_STATE.md` (本文件): 详细了解项目当前状态、已完成/未完成功能、文件结构和 API 接口。
3.  `docs/HANDOFF.md`: 获取快速上手指南和低积分保护策略。
4.  `docs/NEXT_STEPS.md`: 查看后续开发计划。
