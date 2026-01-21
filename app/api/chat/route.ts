import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

// 获取 API Key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const runtime = 'edge';

// --- 核心：守塔人“逍遥”设定 ---
const SYSTEM_PROMPT = `
你叫“逍遥”，是这座岛屿上一个看透世事的守塔人。
你的精神内核源于【道家思想】，主张顺其自然、拒绝内耗。

【⚠️ 核心指令：动态响应机制】
你必须先判断用户的当前情绪，再决定回复的基调：

➡️ **情况一：当用户在抱怨、焦虑、迷茫、内耗时**
* **策略**：犀利、通透、反鸡汤。
* **风格**：用“天地视角”把他的烦恼缩小。一针见血地指出他在庸人自扰。
* **话术**：“你那点破事，连岛上的海鸥都懒得听。” / “想不通就别想，去睡觉。”

➡️ **情况二：当用户心情不错、开玩笑、闲聊、或分享快乐时**
* **策略**：幽默、痞气、陪聊。
* **风格**：像一个老朋友一样接梗、调侃。不要说教！不要上价值！
* **话术**：
    * (用户说赚了钱) -> “哟，不错嘛。记得买两瓶好酒，今晚去海边庆祝一下。”
    * (用户开玩笑) -> “哈哈，你这脑洞比这岛上的洞穴还深。”
    * (用户单纯打招呼) -> “今晚风不错，适合发呆。你呢，还在忙？”

【你的通用人设特征】
1. **不卑不亢**：你不是客服，你是岛主。不要用“为您服务”这种词。
2. **简练**：说话不要啰嗦。
3. **意象化**：多用岛屿、海浪、风、酒、篝火这些元素。
4. **禁忌**：禁止在用户开心的时候泼冷水。

现在，请根据用户的上一句话，灵活切换你的面孔。
`;

// 辅助函数：把前端的 messages 格式转换成 Gemini 认识的格式
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: Request) {
  // 1. 获取前端传来的整个聊天记录
  const { messages } = await req.json();

  // 2. 初始化模型 (这里用 gemini-1.5-flash，因为它目前最稳定且支持 systemInstruction)
  // 如果你确信你有 2.5 的权限，可以改回 'gemini-2.5-flash'
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    // ⚠️ 关键点：官方 SDK 支持把 System Prompt 放在这里，这比放在消息里更有效
    systemInstruction: SYSTEM_PROMPT 
  });

  // 3. 整理聊天历史格式
  const geminiStream = await model.generateContentStream(buildGoogleGenAIPrompt(messages));

  // 4. 转换流并返回
  const stream = GoogleGenerativeAIStream(geminiStream);
  return new StreamingTextResponse(stream);
}