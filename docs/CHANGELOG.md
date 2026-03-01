# Changelog

## [0.3.0] - 2026-03-01

### Added
- **前端校验**: 在 `InputForm` 中增加了商品名称、卖点、市场必填，日预算为正数的校验。
- **历史记录**: 新增 `lib/history.ts` 模块，实现了最近 5 次分析请求和结果的本地存储与回填。
- **反馈闭环**: 新增 `FeedbackBar` 组件，支持用户对分析结果进行“有帮助”或“需要优化”的反馈，并持久化状态。
- **示例输入**: `InputForm` 增加了“填入示例数据”按钮，方便快速演示。
- **结果复制**: `ResultCard` 增加了“复制内容”按钮，方便用户获取分析结果。
- **交接文档**: 新增 `docs/HANDOFF.md` 和 `docs/FILE_MAP.md`。

### Improved
- **UI/UX 打磨**: 
  - 页面整体层级更清晰，Header 和 Footer 样式优化。
  - `ResultCard` 标题更专业，增加了图标和英文名称。
  - `StepList` 视觉效果优化，Loading 状态更明确，已完成步骤显示勾选。
  - Mode 标识（Live/Fallback）更明显，并增加了动画效果。
  - 空状态和错误状态的视觉提示更友好。
- **代码结构**: 历史记录相关逻辑抽离到 `lib/history.ts`。
- **文档体系**: `PROJECT_STATE.md`, `NEXT_STEPS.md`, `README.md` 均已更新，包含 Round 3 的所有变更和后续计划。

### Fixed
- 修复了 `InputForm` 中 `dailyBudget` 字段类型为 `string` 但校验为 `number` 的潜在类型不一致问题（通过 `Number()` 转换处理）。

### Remaining Gaps
- LLM 输出仍为纯文本，未强制结构化（待 Round 4 解决）。
- API 响应非流式，用户需等待所有结果生成完毕（待 Round 4 解决）。
- 错误处理和提示仍有优化空间。
- 暂不支持取消正在进行的分析请求。

### Next
- 详见 `docs/NEXT_STEPS.md`，Round 4 将重点引入结构化输出 (Zod + Instructor) 和 API 流式响应。

---

## [0.2.0] - 2026-03-01

### Added
- **Agent Core**: 引入了 `Orchestrator` 和 `Tool Router`，实现了真实的 Agent 调用链。
- **LLM Integration**: 新增 `lib/services/llm.ts`，封装了对 OpenAI API 的调用。
- **Tooling**: 创建了 4 个独立的工具函数（`AudienceInsight`, `CreativeAngle`, `MediaPlan`, `Optimization`），每个工具都有独立的 prompt 模板。
- **Live/Fallback Mode**: 实现了 `live` 和 `fallback` 双模式。当 `OPENAI_API_KEY` 可用时使用真实 LLM，否则自动降级到 mock 数据。
- **Frontend Enhancement**: 
  - 增加了 `live` / `fallback` 模式徽章。
  - Agent 执行步骤现在能反映真实的后端调用过程。
  - 增加了请求失败后的“重试”功能。

### Changed
- **API `/api/analyze`**: 从返回 mock 数据升级为调用 `Orchestrator` 执行真实分析。
- **`lib/types.ts`**: 扩展了类型定义，增加了 `AgentContext` 和 `ToolResult` 等接口。
- **`app/page.tsx`**: 升级了前端逻辑以支持重试和模式显示。
- **`.env.example`**: 更新了环境变量说明，明确了 `OPENAI_API_KEY` 的作用。

### Known Issues
- LLM 输出为纯文本，格式不稳定。
- 用户需等待整个流程结束才能看到结果，缺少流式响应。

### Next
- 详见 `docs/NEXT_STEPS.md`，Round 3 将重点引入结构化输出 (Zod + Instructor) 和 API 流式响应。

---

## [0.1.0] - 2026-03-01

### Added

- **项目初始化**: 创建了基于 Next.js 14, React, Tailwind CSS, TypeScript 的项目骨架。
- **目录结构**: 搭建了 `app`, `components`, `lib`, `docs`, `public` 等核心目录。
- **API**: 新增 `POST /api/analyze` 路由，目前返回 mock 数据并模拟 1.5s 延迟。
- **核心组件**:
  - `components/InputForm.tsx`: 广告信息输入表单，支持下拉选择和必填校验。
  - `components/ResultCard.tsx`: 用于展示分析结果的通用卡片。
  - `components/StepList.tsx`: 展示 Agent 执行步骤的列表。
- **核心页面**:
  - `app/page.tsx`: 项目首页，整合了输入、提交、加载、错误处理、结果展示等完整交互逻辑。
- **类型定义**: 在 `lib/types.ts` 中定义了 `AnalyzeRequest` 和 `AnalyzeResponse` 等核心类型。
- **Mock 数据**: 在 `lib/mock.ts` 中创建了 `generateMockResponse` 函数，用于生成占位数据。
- **数据持久化**: 使用 `localStorage` 实现了表单输入和分析结果的本地持久化，刷新页面不丢失。
- **文档体系**:
  - `docs/PROJECT_STATE.md`: 记录当前项目状态，便于迁移。
  - `docs/NEXT_STEPS.md`: 规划 Round 2 的开发任务。
  - `docs/CHANGELOG.md`: 本变更日志。
  - `README.md`: 包含项目运行和跨账号续作说明。
- **环境配置**: 添加了 `.env.example` 文件。

### Pending

- 真实 LLM API 对接。
- 真实 Agent 编排逻辑。
- 数据库集成。
- 用户认证系统。
