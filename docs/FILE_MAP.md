# AdPilot Agent 文件地图

本文档提供了 AdPilot Agent 项目中核心文件和目录的快速参考，帮助开发者快速定位和理解代码结构。

## 1. 根目录 (`/`)

| 文件/目录 | 描述 |
| :--- | :--- |
| `.env.example` | 环境变量示例文件，用于配置 `OPENAI_API_KEY` 等敏感信息。 |
| `README.md` | 项目的入口文档，包含项目概览、运行指南、技术栈和交接流程。 |
| `package.json` | 项目的元数据文件，定义了项目名称、版本、依赖和脚本命令。 |
| `pnpm-lock.yaml` | `pnpm` 包管理器的锁定文件，确保依赖安装的一致性。 |
| `next.config.mjs` | Next.js 配置文件，用于自定义 Next.js 的行为。 |
| `postcss.config.mjs` | PostCSS 配置文件，用于处理 CSS 样式。 |
| `tailwind.config.ts` | Tailwind CSS 配置文件，用于自定义 Tailwind 的样式。 |
| `tsconfig.json` | TypeScript 配置文件，定义了 TypeScript 编译器的选项。 |

## 2. `app` 目录

| 文件/目录 | 描述 |
| :--- | :--- |
| `app/layout.tsx` | 根布局文件，定义了整个应用的 HTML 结构、字体和全局样式。 |
| `app/page.tsx` | 首页组件，包含了 AdPilot Agent 的所有 UI 逻辑、状态管理和交互处理。 |
| `app/globals.css` | 全局 CSS 样式文件，包含 Tailwind CSS 的导入和自定义样式。 |
| `app/api/analyze/route.ts` | 后端 API 路由，处理 `/api/analyze` 的 POST 请求，是 Agent 逻辑的入口。 |

## 3. `components` 目录

| 文件 | 描述 |
| :--- | :--- |
| `components/InputForm.tsx` | 用户输入表单组件，负责收集广告投放信息，包含输入校验和示例数据填充功能。 |
| `components/ResultCard.tsx` | 分析结果展示卡片组件，用于显示 LLM 生成的各项分析结果，并提供复制功能。 |
| `components/StepList.tsx` | Agent 执行步骤列表组件，实时展示 Agent 的分析进度和状态。 |
| `components/FeedbackBar.tsx` | 用户反馈组件，允许用户对分析结果进行“有帮助”或“需要优化”的反馈。 |
| `components/HistoryPanel.tsx` | 历史记录面板组件，展示最近的分析记录，并支持点击回填。 |

## 4. `lib` 目录

| 文件/目录 | 描述 |
| :--- | :--- |
| `lib/types.ts` | 项目中所有 TypeScript 类型定义，包括 API 请求/响应、历史记录、Agent 上下文等。 |
| `lib/mock.ts` | Mock 数据生成模块，用于在 Fallback 模式下提供模拟的分析结果。 |
| `lib/history.ts` | 历史记录管理模块，封装了 `localStorage` 的读写操作，用于持久化用户输入和分析结果。 |
| `lib/services/llm.ts` | LLM 服务层，封装了与 OpenAI API 的交互逻辑，处理 API Key 校验和 LLM 调用。 |
| `lib/prompts/` | 包含所有 LLM Prompt 模板的目录，每个文件对应一个具体工具的 Prompt。 |
| `lib/prompts/audienceInsightPrompt.ts` | 人群洞察工具的 Prompt 模板。 |
| `lib/prompts/creativeAnglePrompt.ts` | 素材方向工具的 Prompt 模板。 |
| `lib/prompts/mediaPlanPrompt.ts` | 投放计划工具的 Prompt 模板。 |
| `lib/prompts/optimizationPrompt.ts` | 优化建议工具的 Prompt 模板。 |
| `lib/tools/` | 包含所有 Agent 工具函数的目录，每个文件对应一个具体工具的实现。 |
| `lib/tools/audienceInsight.ts` | 人群洞察工具的实现。 |
| `lib/tools/creativeAngle.ts` | 素材方向工具的实现。 |
| `lib/tools/mediaPlan.ts` | 投放计划工具的实现。 |
| `lib/tools/optimization.ts` | 优化建议工具的实现。 |
| `lib/agent/` | 包含 Agent 核心逻辑的目录。 |
| `lib/agent/orchestrator.ts` | Agent 编排器，负责调度工具和管理 Agent 的执行流程。 |
| `lib/agent/toolRouter.ts` | 工具路由器，根据 Agent 的决策选择合适的工具进行调用。 |

## 5. `docs` 目录

| 文件 | 描述 |
| :--- | :--- |
| `docs/PROJECT_STATE.md` | 项目状态文档，详细记录了项目当前的功能、未完成项、文件结构和 API 接口。 |
| `docs/NEXT_STEPS.md` | 后续开发计划文档，规划了下一轮（Round 4）的开发任务和目标。 |
| `docs/CHANGELOG.md` | 变更日志，记录了项目每个版本的功能增删改查历史。 |
| `docs/HANDOFF.md` | 项目交接文档，为下一位接手者提供了快速上手指南、核心文件说明和低积分保护策略。 |
| `docs/FILE_MAP.md` | 本文件，提供了项目核心文件和目录的快速参考。 |
