
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeLabLogs = async (logsContent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `请为这些实验室日志提供一个结构化的中文总结，重点指出实验进度和记录中提到的任何潜在安全风险：${logsContent}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "生成 AI 总结失败。";
  }
};

export const getSmartSOPAdvice = async (instrumentName: string, issue: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `作为一名高级实验室技师，请针对 ${instrumentName} 在出现 ${issue} 问题时提供简短的中文故障排除建议。请保持简洁并优先考虑安全。`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "安全第一：请咨询您的实验室导师。";
  }
};

export const generateLabReport = async (data: any) => {
  try {
    const prompt = `
      请扮演一位专业的实验室管理专家，根据以下实时数据生成一份《实验室运营简报》：
      
      【数据概览】
      - 报告时间: ${new Date().toLocaleDateString()}
      - 仪器使用率: ${data.inUseCount}/${data.totalEquipment} 台 (${Math.round(data.inUseCount/data.totalEquipment*100)}%)
      - 待处理低库存: ${data.lowStockCount} 项
      - 环境状态: ${data.environment}
      - 近期关键警报: ${data.alerts.map((a: any) => a.title).join(', ')}

      【报告要求】
      请输出 Markdown 格式，包含以下三个简短的章节：
      1. 📊 **运营效能分析**：评价当前的设备利用率和环境状况。
      2. ⚠️ **风险与预警**：基于库存和警报数据，指出需要立即关注的问题。
      3. ✅ **管理建议**：给出 2-3 条具体的行动建议。

      语气请保持专业、客观且简洁。
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return `
    ### ⚠️ 自动生成失败
    
    无法连接至 AI 服务。请手动查看以下关键指标：
    
    *   **设备状态**: ${data.inUseCount}/${data.totalEquipment} 台运行中
    *   **库存预警**: ${data.lowStockCount} 项物资紧缺
    *   **环境**: ${data.environment}
    `;
  }
};
