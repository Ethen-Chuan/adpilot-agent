import OpenAI from "openai";

let clientInstance: OpenAI | null = null;

/**
 * 检查是否配置了有效的 API Key。
 */
export function hasApiKey(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && key.trim() !== "" && key !== "sk-xxx");
}

/**
 * 获取 OpenAI 客户端单例。
 * API Key 和 Base URL 均从环境变量读取（openai 库自动读取 OPENAI_API_KEY）。
 */
function getClient(): OpenAI {
  if (!clientInstance) {
    clientInstance = new OpenAI();
  }
  return clientInstance;
}

/**
 * 统一封装的 LLM 调用函数。
 * 使用 system prompt + user prompt 的标准对话格式。
 *
 * @param systemPrompt - 系统提示词，定义角色与输出格式
 * @param userPrompt   - 用户提示词，包含具体业务输入
 * @returns LLM 返回的文本内容
 * @throws 调用失败时抛出异常
 */
export async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("LLM 返回内容为空");
  }

  return content.trim();
}
