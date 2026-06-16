import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import * as ai from "./ai";
import * as db from "./db";

/**
 * AI Assistant Router
 * Exposes AI-powered nutrition and health analysis endpoints
 */

export const aiRouter = router({
  generateRecommendation: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        query: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const client = await db.getClientById(input.clientId);
      if (!client) throw new Error("Client not found");

      // Get latest assessment
      const assessments = await db.listAssessments(input.clientId);
      const latestAssessment = assessments[0];

      const clientData: ai.ClientData = {
        fullName: client.fullName,
        age: client.age || undefined,
        gender: client.gender || undefined,
        medicalHistory: client.medicalHistory || undefined,
        currentDiagnoses: client.currentDiagnoses as string[],
        allergies: client.allergies as string[],
        medications: client.medications as string[],
        lifestyle: client.lifestyle as any,
      };

      const assessmentData: ai.AssessmentData = latestAssessment
        ? {
            height: latestAssessment.height ? parseFloat(latestAssessment.height.toString()) : undefined,
            weight: latestAssessment.weight ? parseFloat(latestAssessment.weight.toString()) : undefined,
            bmi: latestAssessment.bmi ? parseFloat(latestAssessment.bmi.toString()) : undefined,
            bloodPressure: latestAssessment.bloodPressure || undefined,
            bloodSugar: latestAssessment.bloodSugar ? parseFloat(latestAssessment.bloodSugar.toString()) : undefined,
            dietaryAssessment: latestAssessment.dietaryAssessment || undefined,
            riskClassification: latestAssessment.riskClassification || undefined,
          }
        : {};

      return await ai.generateNutritionRecommendation(clientData, assessmentData, input.query);
    }),

  draftCarePlan: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .mutation(async ({ input }) => {
      const client = await db.getClientById(input.clientId);
      if (!client) throw new Error("Client not found");

      const assessments = await db.listAssessments(input.clientId);
      const latestAssessment = assessments[0];

      const clientData: ai.ClientData = {
        fullName: client.fullName,
        age: client.age || undefined,
        gender: client.gender || undefined,
        medicalHistory: client.medicalHistory || undefined,
        currentDiagnoses: client.currentDiagnoses as string[],
        allergies: client.allergies as string[],
        medications: client.medications as string[],
        lifestyle: client.lifestyle as any,
      };

      const assessmentData: ai.AssessmentData = latestAssessment
        ? {
            height: latestAssessment.height ? parseFloat(latestAssessment.height.toString()) : undefined,
            weight: latestAssessment.weight ? parseFloat(latestAssessment.weight.toString()) : undefined,
            bmi: latestAssessment.bmi ? parseFloat(latestAssessment.bmi.toString()) : undefined,
            bloodPressure: latestAssessment.bloodPressure || undefined,
            bloodSugar: latestAssessment.bloodSugar ? parseFloat(latestAssessment.bloodSugar.toString()) : undefined,
            dietaryAssessment: latestAssessment.dietaryAssessment || undefined,
            riskClassification: latestAssessment.riskClassification || undefined,
          }
        : {};

      return await ai.draftCarePlan(clientData, assessmentData);
    }),

  generateMealPlan: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        calorieTarget: z.number(),
        preferences: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const client = await db.getClientById(input.clientId);
      if (!client) throw new Error("Client not found");

      const assessments = await db.listAssessments(input.clientId);
      const latestAssessment = assessments[0];

      const clientData: ai.ClientData = {
        fullName: client.fullName,
        age: client.age || undefined,
        gender: client.gender || undefined,
        medicalHistory: client.medicalHistory || undefined,
        currentDiagnoses: client.currentDiagnoses as string[],
        allergies: client.allergies as string[],
        medications: client.medications as string[],
        lifestyle: client.lifestyle as any,
      };

      const assessmentData: ai.AssessmentData = latestAssessment
        ? {
            height: latestAssessment.height ? parseFloat(latestAssessment.height.toString()) : undefined,
            weight: latestAssessment.weight ? parseFloat(latestAssessment.weight.toString()) : undefined,
            bmi: latestAssessment.bmi ? parseFloat(latestAssessment.bmi.toString()) : undefined,
            bloodPressure: latestAssessment.bloodPressure || undefined,
            bloodSugar: latestAssessment.bloodSugar ? parseFloat(latestAssessment.bloodSugar.toString()) : undefined,
            dietaryAssessment: latestAssessment.dietaryAssessment || undefined,
            riskClassification: latestAssessment.riskClassification || undefined,
          }
        : {};

      return await ai.generateMealPlan(clientData, assessmentData, input.calorieTarget, input.preferences);
    }),

  analyzeClientHealth: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .mutation(async ({ input }) => {
      const client = await db.getClientById(input.clientId);
      if (!client) throw new Error("Client not found");

      const assessments = await db.listAssessments(input.clientId);
      const latestAssessment = assessments[0];
      const appointments = await db.listAppointments({ clientId: input.clientId });

      const clientData: ai.ClientData = {
        fullName: client.fullName,
        age: client.age || undefined,
        gender: client.gender || undefined,
        medicalHistory: client.medicalHistory || undefined,
        currentDiagnoses: client.currentDiagnoses as string[],
        allergies: client.allergies as string[],
        medications: client.medications as string[],
        lifestyle: client.lifestyle as any,
      };

      const assessmentData: ai.AssessmentData = latestAssessment
        ? {
            height: latestAssessment.height ? parseFloat(latestAssessment.height.toString()) : undefined,
            weight: latestAssessment.weight ? parseFloat(latestAssessment.weight.toString()) : undefined,
            bmi: latestAssessment.bmi ? parseFloat(latestAssessment.bmi.toString()) : undefined,
            bloodPressure: latestAssessment.bloodPressure || undefined,
            bloodSugar: latestAssessment.bloodSugar ? parseFloat(latestAssessment.bloodSugar.toString()) : undefined,
            dietaryAssessment: latestAssessment.dietaryAssessment || undefined,
            riskClassification: latestAssessment.riskClassification || undefined,
          }
        : {};

      const appointmentHistory = appointments.slice(0, 5).map((apt: any) => ({
        date: apt.appointmentDate.toString(),
        notes: apt.notes || "",
      }));

      return await ai.analyzeClientHealth(clientData, assessmentData, appointmentHistory);
    }),
});
