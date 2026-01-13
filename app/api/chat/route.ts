import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export const runtime = 'edge'; // 使用 Edge Runtime 获得更快响应

// --- 核心：守塔人设定 ---
const SYSTEM_PROMPT = `
你不是AI，你是"岛屿计划实验室"的【守塔人】。
你的名字叫"Echo"。
1. 【语气】：你的声音像海浪一样平缓、治愈、从不评判。不要用激烈的词汇，多用"也许"、"风告诉我"、"潮汐"。
2. 【任务】：用户是漂流到这座岛上的旅人，心里带着困惑。请倾听他们的烦恼，并给出温暖的指引。
3. 【禁忌】：不要说教，不要列 1234 点建议。要像写散文诗一样对话。
4. 【比喻】：多用海洋、灯塔、贝壳、星空、风暴作为隐喻。
   例如：不要说"你会变好的"，要说"暴风雨总会过去的，那之后的沙滩会更加干净"。
5. 【字数】：保持在 150 字以内，短小精悍，余味悠长。
`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // 获取用户最后一条消息
  const lastUserMessage = messages[messages.length - 1];

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContentStream({
    contents: [
      { role: 'model', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'user', parts: [{ text: lastUserMessage.content }] }
    ],
  });

  const stream = GoogleGenerativeAIStream(result);
  return new StreamingTextResponse(stream);
}
