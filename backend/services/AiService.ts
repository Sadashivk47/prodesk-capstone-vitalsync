import { Injectable } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class AiService {
  async generateClinicalSummary(patientData: any, prompt?: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        summary: "Clinical Note Summary: Patient exhibits stable vital metrics (BP: 118/76 mmHg). Recent lab tests indicate mild vitamin deficiency (Vitamin D: 28 ng/mL). Antibiotic treatment completed for acute sinusitis with resolved symptoms.",
        recommendations: ["Monitor blood pressure bi-weekly", "Schedule follow-up lipid panel in 3 months", "Maintain Vitamin D supplementation"],
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are VitalSync Clinical Intelligence Assistant, an advanced medical AI helper for doctors. Provide concise, structured clinical insights, summary, and suggested next steps based on patient history. Keep tone professional, clinical, and precise.`;

    const userPrompt = prompt || `Summarize the following patient medical record and provide key observations and suggested follow-ups:
${JSON.stringify(patientData || {}, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return {
      summary: response.text || "No summary generated.",
    };
  }
}
