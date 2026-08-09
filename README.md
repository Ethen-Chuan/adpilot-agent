# AdPilot Agent

AdPilot Agent 是一个面向跨境电商卖家和广告投放运营人员的 AI 投放分析 Copilot。用户输入商品、卖点、市场、平台、预算和投放目标后，系统会依次完成受众洞察、素材方向、媒体计划和优化建议，最后将四部分内容组合成一份可阅读、可复制的投放建议。

它适合作为广告策略 Agent 的产品原型、交互演示和工程架构示例，不是可以直接替代广告平台开户、实时数据分析或自动投放的生产系统。

## 核心流程

```text
商品与投放信息
      ↓
Agent Orchestrator
      ↓
Audience Insight Tool
      ↓
Creative Angle Tool
      ↓
Media Plan Tool
      ↓
Optimization Tool
      ↓
分析报告 + 执行步骤 + 模式标识
```

四个工具按照固定顺序运行，后续工具可以使用前面步骤产生的上下文：

1. **Audience Insight Tool**：分析目标人群、痛点、购买动机和沟通切入点。
2. **Creative Angle Tool**：根据受众洞察生成广告创意方向和文案钩子。
3. **Media Plan Tool**：给出预算分配、测试节奏和投放结构建议。
4. **Optimization Tool**：整理关键指标、问题排查方向和后续优化动作。

## 两种运行模式

### Live 模式

配置 `OPENAI_API_KEY` 后，服务端会通过 OpenAI SDK 调用模型。默认模型是 `gpt-4.1-mini`，可以使用 `OPENAI_MODEL` 修改。

每一个工具都有独立的提示词和调用逻辑。界面显示的 Agent 步骤来自服务端实际执行过程，而不是预先播放的动画。

### Fallback 模式

没有配置 Key 时，应用会自动使用本地 fallback 结果，方便在无外部服务的环境中演示完整交互流程。

如果已经进入 Live 模式，但某个工具调用失败，该工具会返回备用内容，整个流程不会因此中断；响应中的 `mode` 会降级为 `fallback`。

Fallback 内容是预设规则和文案，不代表模型完成了真实分析。

## 用户可以做什么

- 输入商品名称、核心卖点、目标市场、广告平台、日预算和核心目标；
- 使用示例数据快速体验完整流程；
- 查看 Agent 当前执行到哪个工具；
- 阅读并复制四类分析结果；
- 回看最近 5 次分析，并将历史输入重新填入表单；
- 对结果标记“有帮助”或“需要优化”；
- 刷新页面后继续使用保存在本机的历史记录和上次输入。

历史记录、表单草稿和反馈存放在浏览器 `localStorage` 中。项目目前没有数据库，也不会把这些历史同步到其他设备。

## API

应用提供一个 Next.js Route Handler：

```text
POST /api/analyze
```

请求示例：

```json
{
  "productName": "便携式咖啡机",
  "sellingPoints": "无需插电、体积小、适合旅行",
  "market": "美国",
  "platform": "Meta",
  "dailyBudget": "100",
  "goal": "转化"
}
```

返回结构包含：

```json
{
  "audienceInsight": "...",
  "creativeAngle": "...",
  "mediaPlan": "...",
  "optimizationAdvice": "...",
  "agentSteps": ["..."],
  "mode": "live"
}
```

接口会检查六个必填字段。字段缺失时返回 `400`；无法处理的服务端异常返回 `500`。

## 技术架构

- Next.js 14（App Router）
- React 18
- TypeScript
- Tailwind CSS
- OpenAI JavaScript SDK
- 浏览器 `localStorage`

主要目录：

```text
adpilot-agent/
├── app/
│   ├── page.tsx                    # 主页面状态与分析请求
│   └── api/analyze/route.ts        # 分析 API 与输入校验
├── components/                     # 表单、步骤、结果、历史和反馈组件
├── lib/
│   ├── agent/orchestrator.ts       # Agent 上下文初始化与总流程编排
│   ├── agent/toolRouter.ts         # 四个工具的顺序调度与降级处理
│   ├── tools/                      # 各分析工具及其 fallback 逻辑
│   ├── services/llm.ts             # OpenAI 客户端和统一模型调用
│   ├── history.ts                  # 本地历史与反馈持久化
│   └── types.ts                    # 请求、响应和 Agent 类型
├── docs/                            # 项目状态、文件地图和历史开发记录
└── .env.example                     # 环境变量示例
```

## 本地运行

### 环境要求

- Node.js 18.17 或更高版本
- pnpm

### 安装

```bash
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env.local
```

`.env.local` 示例：

```dotenv
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_API_KEY` 留空时会进入 Fallback 模式。不要把 `.env.local` 或真实密钥提交到仓库。

### 启动开发服务

```bash
pnpm dev
```

打开：

```text
http://localhost:3000
```

### 构建与运行生产版本

```bash
pnpm build
pnpm start
```

## 当前能力边界

这个版本验证的是“结构化输入 → 多工具顺序分析 → 可解释结果展示”的产品链路。它目前不具备：

- Meta、TikTok、Google Ads 等广告平台的账号授权；
- 广告账户、Campaign、素材和转化数据的实时读取；
- 自动创建或修改广告计划；
- 基于历史表现的持续学习和归因分析；
- 用户账号、团队空间、数据库和跨设备同步；
- 流式模型输出；
- 对模型输出的严格 JSON Schema 约束；
- 生产级限流、计费、内容审核、可观测性和自动化测试覆盖。

因此，生成结果应被视为策略草案。涉及真实预算和投放决策时，仍需要运营人员结合平台数据、品牌约束和市场情况复核。

## 隐私与安全

- OpenAI Key 只应配置在服务端环境变量中，不应写入前端代码。
- Live 模式会将用户填写的商品和投放信息发送给所配置的模型服务。
- 浏览器会在本机保存最近 5 条分析历史；共用设备上使用时请注意本地数据暴露风险。
- 当前接口没有登录和访问控制。公开部署前应增加鉴权、限流和调用额度保护。

## 项目文档

`docs/` 保留了开发过程中的项目状态、文件地图、变更记录和后续计划。这些文件适合继续开发时参考；本 README 是面向仓库访客的功能与运行说明。

## 说明

本仓库未声明开源许可证。在获得明确授权前，请不要将代码视为可自由再分发或商用的开源内容。
