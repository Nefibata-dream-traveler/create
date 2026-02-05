
import { GoogleGenAI } from "@google/genai";
import { SystemState } from "../types";

export const analyzeGrainStatus = async (state: SystemState): Promise<string> => {
  // Initialize AI client inside the function to ensure it uses the latest API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      你是一位负责监控粮仓数字孪生系统的资深农业 AI 专家。
      请分析来自 STM32H750 边缘节点的以下实时传感器数据：

      - 温度传感器阵列 (底层/中层/顶层): ${state.temperatures.join(', ')} °C
      - 相对湿度: ${state.humidity.toFixed(1)} %
      - 害虫计数 (视觉检测): ${state.pestCount}
      - 害虫坐标: ${state.pestPosition ? `检测于 X:${state.pestPosition.x.toFixed(2)}, Y:${state.pestPosition.y.toFixed(2)}` : '未发现'}

      请提供一份简明的 Markdown 格式状态报告：
      1. 评估霉变风险 (湿度 > 70% 为高风险)。
      2. 评估局部高温点风险 (温度 > 30°C 为高风险)。
      3. 评估害虫威胁。
      4. 为仓库管理员提供立即采取的行动建议。
      
      请使用专业、干练的中文进行回复。如果检测到风险，请在报告开头突出显示。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    // Access the text property directly as per Gemini API guidelines
    return response.text || "分析完成。未发现异常情况。";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "错误：无法连接到 AI 分析服务。请检查网络或 API 密钥设置。";
  }
};
