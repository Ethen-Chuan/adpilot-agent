# AdPilot Agent

面向跨境电商卖家和投流运营人员的广告投流 Agent Copilot。

这是 **Round 3** 的交付成果，一个功能更完善、用户体验更佳的 Agent Demo。

## 功能

- **信息输入**: 用户可以输入商品名称、卖点、目标市场、投放平台、日预算和核心目标。
- **前端校验**: 对输入字段进行基本校验，确保数据有效性。
- **示例数据**: 提供一键填充示例数据的按钮，方便快速演示。
- **智能分析**: 
  - **Live 模式**: 当配置了 `OPENAI_API_KEY` 时，系统会真实调用大语言模型，经过 `Orchestrator -> ToolRouter -> 4个Tool` 的完整链路，生成高质量的分析建议。
  - **Fallback 模式**: 未配置 API Key 时，自动降级为使用预设文案的 fallback 模式，保证核心流程可用。
- **Agent 步骤**: 实时展示 Agent 从解析需求到调用各个工具的完整执行步骤。
- **分析结果展示**: 以卡片形式清晰展示四项分析结果，并支持内容复制。
- **历史记录**: 用户的输入和分析结果（最近 5 次）都会保存在浏览器的 `localStorage` 中，刷新页面不会丢失，并支持点击回填。
- **用户反馈**: 对分析结果提供“有帮助”或“需要优化”的反馈机制，并持久化反馈状态。
- **UI/UX 优化**: 页面层级更清晰，卡片标题更专业，Agent 步骤区、mode 标识、空状态/错误状态视觉效果更佳。

## 技术栈

- Next.js 14 (App Router)
- React
- Tailwind CSS
- TypeScript
- **OpenAI SDK**: 用于与大语言模型交互。
- **Agent-based Architecture**: 包含 Orchestrator, Tool Router, 和多个独立 Tools。

## 如何本地运行

1.  **环境要求**:
    - Node.js (v18.17 或更高版本)
    - pnpm

2.  **配置环境变量**:
    将项目根目录下的 `.env.example` 文件复制一份，重命名为 `.env.local`，然后填入你的 OpenAI API Key。
    ```bash
    cp .env.example .env.local
    ```
    编辑 `.env.local`:
    ```
    OPENAI_API_KEY=sk-...
    ```
    *如果留空，项目将以 fallback 模式运行。*

3.  **安装依赖**:
    在项目根目录下运行：
    ```bash
    pnpm install
    ```

4.  **启动开发服务**:
    ```bash
    pnpm run dev
    ```

5.  **访问应用**:
    打开浏览器并访问 [http://localhost:3000](http://localhost:3000)。

## 跨账号续作说明（非常重要）

为了确保项目可以在不同的 Manus 会话或账号中无缝继续开发，本项目内置了“可迁移续作机制”。

### 1. 优先阅读文档

在开始编码前，请务必仔细阅读以下文件，它们包含了继续开发所需的全部上下文：
- `README.md` (本文件): 了解项目概览、如何运行。
- `docs/PROJECT_STATE.md`: 获取项目在上一轮结束时的完整状态，包括文件结构、API 定义、已完成和未完成的功能等。
- `docs/NEXT_STEPS.md`: 查看下一轮（Round 4）的详细开发计划和任务列表。
- `docs/CHANGELOG.md`: 查看项目版本变更历史。
- `docs/HANDOFF.md`: 获取快速上手指南和低积分保护策略。
- `docs/FILE_MAP.md`: 核心文件功能速查。

### 2. 跨账号续作检查清单

在新账号或新环境中继续开发前，请务必检查以下事项：

- [x] **依赖安装**: 在项目根目录运行 `pnpm install` 确保所有依赖已安装。
- [x] **环境变量**: 确认根目录存在 `.env.local` 文件，并已正确配置 `OPENAI_API_KEY`。
- [x] **文档同步**: 确认 `docs` 目录下的所有文档（`PROJECT_STATE.md`, `NEXT_STEPS.md`, `CHANGELOG.md`, `HANDOFF.md`, `FILE_MAP.md`）已同步到最新版本。
- [x] **运行测试**: 运行 `pnpm run dev`，并尝试提交一次分析请求，确认 `live` 或 `fallback` 模式至少有一种能正常工作。

### 3. 遵循开发计划

根据 `docs/NEXT_STEPS.md` 中的任务列表，逐项完成 Round 4 的开发目标。
