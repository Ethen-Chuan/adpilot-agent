# AdPilot Agent - Round 3 开发计划

本轮目标：**提升 Agent 的稳定性和用户体验，为生产可用性做准备。**

## P0 - 核心必做任务

### 1. 引入结构化输出（Zod + Instructor）

**问题**：当前 LLM 返回纯文本，格式不稳定，容易在前端展示时错乱。

**方案**：
- 使用 `zod` 定义每个工具函数期望返回的 JSON Schema。
- 引入 `openai/instructor` 库，将其与 `zod` 结合，包装 `callLLM` 函数。
- 强制 LLM 必须返回符合 `zod` schema 的 JSON 对象，否则自动重试或抛出结构化错误。

**涉及文件**：
- `lib/types.ts`: 定义 Zod schemas。
- `lib/services/llm.ts`: 改造 `callLLM` 函数。
- `lib/tools/*.ts`: 更新每个工具的输出处理逻辑，直接返回结构化对象。
- `app/page.tsx`: 调整前端渲染逻辑，适配结构化数据。

### 2. 实现 API 流式响应（Streaming Response）

**问题**：用户需等待所有工具执行完毕，耗时较长，体验不佳。

**方案**：
- 将 `/api/analyze` 改造为流式响应接口。
- Orchestrator 每执行完一步（或一个工具），就通过 stream 向前端发送一个事件。
- 事件可以是 `agent_step`（更新步骤）、`result_chunk`（返回部分结果）、`error` 或 `finish`。

**涉及文件**：
- `app/api/analyze/route.ts`: 使用 `ReadableStream` 和 `TextEncoder` 实现流式响应。
- `lib/agent/orchestrator.ts`: 改造为逐步生成并推送数据块。
- `app/page.tsx`: 使用 `fetch` 和 `ReadableStream` 的 reader 来处理流式数据，实时更新 UI。

## P1 - 建议完成任务

### 3. 优化前端交互与状态管理

**问题**：当前前端交互较为基础。

**方案**：
- **取消请求**：在 `loading` 状态时，提供一个“取消”按钮，使用 `AbortController` 来中断 `fetch` 请求。
- **历史记录**：将每次的分析结果（无论成功失败）存入一个列表，并在侧边栏或弹窗中展示，方便用户回顾和对比。
- **更精细的 Loading**：在 `StepList` 中，可以高亮当前正在执行的步骤。

**涉及文件**：
- `app/page.tsx`: 引入更复杂的状态管理逻辑（如 `useReducer`）。
- `components/InputForm.tsx`: 可能需要新增“取消”按钮。
- 新增 `components/HistoryPanel.tsx` 组件。

## P2 - 可选任务

### 4. 扩展工具集

- 新增一个 `CompetitorAnalysisTool`，可以模拟分析竞品广告策略。
- 新增一个 `BudgetSuggestionTool`，根据用户目标和市场给出更详细的预算建议。

## Round 3 验收标准

- [ ] LLM 输出是稳定的、可预测的 JSON 结构。
- [ ] 前端页面能够实时展示 Agent 的执行步骤和逐步生成的结果。
- [ ] 用户在请求过程中可以取消分析。
- [ ] 所有 Round 2 的功能在重构后依然可用。
- [ ] `docs` 目录下的所有文档已同步更新。
