import { invokeLLM } from "./_core/llm";

/**
 * AI Assistant Module for AFyalink
 * Provides nutrition recommendations, health insights, and care plan suggestions
 * using Groq API
 */

export interface ClientData {
  fullName: string;
  age?: number;
  gender?: string;
  medicalHistory?: string;
  currentDiagnoses?: string[];
  allergies?: string[];
  medications?: string[];
  lifestyle?: {
    smoking: boolean;
    alcohol: string;
    physicalActivity: string;
  };
}

export interface AssessmentData {
  height?: number;
  weight?: number;
  bmi?: number;
  bloodPressure?: string;
  bloodSugar?: number;
  dietaryAssessment?: string;
  riskClassification?: string;
}

/**
 * Generate nutrition recommendations based on client data
 */
export async function generateNutritionRecommendation(
  clientData: ClientData,
  assessmentData: AssessmentData,
  query: string
): Promise<string> {
  const systemPrompt = `You are AFyalink's clinical nutrition AI assistant. You provide evidence-based nutrition recommendations for dietitian practice management. 
Your responses should be:
- Clinically accurate and evidence-based
- Specific to the client's health conditions and goals
- Practical and actionable
- Formatted clearly with key points highlighted
- Always recommend consulting with the dietitian for final decisions`;

  const clientContext = `
Client: ${clientData.fullName}
Age: ${clientData.age || "Unknown"}
Gender: ${clientData.gender || "Unknown"}
Medical History: ${clientData.medicalHistory || "None reported"}
Current Diagnoses: ${clientData.currentDiagnoses?.join(", ") || "None"}
Allergies: ${clientData.allergies?.join(", ") || "None"}
Medications: ${clientData.medications?.join(", ") || "None"}
Lifestyle: Smoking: ${clientData.lifestyle?.smoking ? "Yes" : "No"}, Alcohol: ${clientData.lifestyle?.alcohol || "Unknown"}, Physical Activity: ${clientData.lifestyle?.physicalActivity || "Unknown"}

Assessment Data:
Height: ${assessmentData.height ? `${assessmentData.height} cm` : "Not recorded"}
Weight: ${assessmentData.weight ? `${assessmentData.weight} kg` : "Not recorded"}
BMI: ${assessmentData.bmi || "Not calculated"}
Blood Pressure: ${assessmentData.bloodPressure || "Not recorded"}
Blood Sugar: ${assessmentData.bloodSugar ? `${assessmentData.bloodSugar} mmol/L` : "Not recorded"}
Dietary Assessment: ${assessmentData.dietaryAssessment || "Not assessed"}
Risk Classification: ${assessmentData.riskClassification || "Not classified"}
`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${clientContext}\n\nQuestion: ${query}` },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Unable to generate recommendation";
  } catch (error) {
    console.error("[AI] Error generating recommendation:", error);
    throw error;
  }
}

/**
 * Draft a care plan based on client assessment
 */
export async function draftCarePlan(
  clientData: ClientData,
  assessmentData: AssessmentData
): Promise<{ diagnosis: string; prescription: string; goals: string[] }> {
  const systemPrompt = `You are AFyalink's clinical nutrition AI assistant specializing in care plan development.
Generate a structured care plan response with:
1. Nutrition Diagnosis (PES format if possible)
2. Diet Prescription (specific macronutrient targets, meal frequency, etc.)
3. 3-4 SMART goals for the client

Format your response as JSON with keys: diagnosis, prescription, goals (array of strings)`;

  const clientContext = `
Client: ${clientData.fullName}
Age: ${clientData.age || "Unknown"}
Medical History: ${clientData.medicalHistory || "None"}
Current Diagnoses: ${clientData.currentDiagnoses?.join(", ") || "None"}
Allergies: ${clientData.allergies?.join(", ") || "None"}

Assessment:
BMI: ${assessmentData.bmi || "Not calculated"}
Blood Pressure: ${assessmentData.bloodPressure || "Not recorded"}
Risk Classification: ${assessmentData.riskClassification || "Not classified"}
Dietary Assessment: ${assessmentData.dietaryAssessment || "Not assessed"}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create a care plan for this client:\n${clientContext}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "care_plan",
          strict: true,
          schema: {
            type: "object",
            properties: {
              diagnosis: { type: "string", description: "Nutrition diagnosis" },
              prescription: { type: "string", description: "Diet prescription" },
              goals: { type: "array", items: { type: "string" }, description: "SMART goals" },
            },
            required: ["diagnosis", "prescription", "goals"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const contentStr = typeof content === "string" ? content : JSON.stringify(content);
    return JSON.parse(contentStr);
  } catch (error) {
    console.error("[AI] Error drafting care plan:", error);
    throw error;
  }
}

/**
 * Generate meal plan suggestions
 */
export async function generateMealPlan(
  clientData: ClientData,
  assessmentData: AssessmentData,
  calorieTarget: number,
  preferences?: string[]
): Promise<string> {
  const systemPrompt = `You are AFyalink's nutrition meal planning AI. Generate practical, culturally-appropriate meal plans.
Your meal plans should:
- Meet the specified calorie target
- Include local/accessible foods
- Be practical for daily implementation
- Include breakfast, lunch, dinner, and snacks
- Consider allergies and preferences
- Include portion guidance`;

  const clientContext = `
Client: ${clientData.fullName}
Age: ${clientData.age || "Unknown"}
Allergies: ${clientData.allergies?.join(", ") || "None"}
Dietary Preferences: ${preferences?.join(", ") || "None specified"}
Risk Classification: ${assessmentData.riskClassification || "Not classified"}
Current Diagnoses: ${clientData.currentDiagnoses?.join(", ") || "None"}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate a 1-day ${calorieTarget} kcal meal plan for:\n${clientContext}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Unable to generate meal plan";
  } catch (error) {
    console.error("[AI] Error generating meal plan:", error);
    throw error;
  }
}

/**
 * Analyze client health data and provide insights
 */
export async function analyzeClientHealth(
  clientData: ClientData,
  assessmentData: AssessmentData,
  appointmentHistory?: { date: string; notes: string }[]
): Promise<string> {
  const systemPrompt = `You are AFyalink's clinical nutrition AI analyst. Analyze client health data and provide:
1. Key health concerns and risk factors
2. Progress observations (if history available)
3. Recommendations for follow-up
4. Areas requiring dietitian attention

Be concise, evidence-based, and actionable.`;

  const clientContext = `
Client: ${clientData.fullName}
Age: ${clientData.age || "Unknown"}
Medical History: ${clientData.medicalHistory || "None"}
Current Diagnoses: ${clientData.currentDiagnoses?.join(", ") || "None"}

Current Assessment:
BMI: ${assessmentData.bmi || "Not calculated"}
Blood Pressure: ${assessmentData.bloodPressure || "Not recorded"}
Blood Sugar: ${assessmentData.bloodSugar ? `${assessmentData.bloodSugar} mmol/L` : "Not recorded"}
Risk Classification: ${assessmentData.riskClassification || "Not classified"}

${appointmentHistory && appointmentHistory.length > 0 ? `Recent Appointments:\n${appointmentHistory.map((a) => `- ${a.date}: ${a.notes}`).join("\n")}` : ""}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Analyze this client's health data:\n${clientContext}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Unable to analyze health data";
  } catch (error) {
    console.error("[AI] Error analyzing health data:", error);
    throw error;
  }
}
