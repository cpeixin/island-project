// check-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error("❌ 错误：在 .env.local 中没找到 GOOGLE_API_KEY");
    return;
  }

  console.log("🔍 正在使用 Key 连接 Google API 查询可用模型...");
  console.log(`🔑 Key 前缀: ${apiKey.substring(0, 8)}...`);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // 这里我们不指定具体模型，而是获取 ModelService
    // 注意：SDK 并没有直接暴露 listModels，我们用 fetch 模拟最底层的请求
    // 这样能绕过 SDK 的封装，看到最真实的服务器响应
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("\n❌ API 返回错误：");
      console.error(JSON.stringify(data.error, null, 2));
      console.log("\n💡 建议：如果显示 'PermissionDenied' 或 'Project not authorized'，说明需要在 Google Cloud Console 启用 Generative Language API。");
    } else if (data.models) {
      console.log("\n✅ 你的 API Key 可以访问以下模型：\n");
      data.models.forEach(model => {
        // 只显示支持 generateContent 的模型
        if (model.supportedGenerationMethods.includes("generateContent")) {
          console.log(`   - ${model.name.replace('models/', '')}`);
        }
      });
      console.log("\n👉 请从上面复制一个名字填入 route.ts");
    } else {
      console.log("⚠️ 响应为空，奇怪...", data);
    }

  } catch (error) {
    console.error("❌ 网络或请求错误:", error.message);
  }
}

listModels();