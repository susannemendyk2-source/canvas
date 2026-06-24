import { NextResponse } from "next/server";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  messages?: ChatMessage[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const baseUrl = (body.baseUrl || "https://api.deepseek.com").replace(/\/$/, "");
    const apiKey = body.apiKey?.trim();
    const model = body.model?.trim() || "deepseek-chat";
    const messages = body.messages?.filter((message) => message.content?.trim());

    if (!apiKey) {
      return NextResponse.json({ error: "请先在设置里填写 DeepSeek API Key。" }, { status: 400 });
    }
    if (!messages?.length) {
      return NextResponse.json({ error: "消息不能为空。" }, { status: 400 });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || data?.message || `DeepSeek 请求失败：${response.status}`
        },
        { status: response.status }
      );
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "DeepSeek 没有返回可用内容。" }, { status: 502 });
    }

    return NextResponse.json({ content, raw: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "未知错误" }, { status: 500 });
  }
}
