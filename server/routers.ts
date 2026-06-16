import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { aiRouter } from "./ai.router";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import * as db from "./db";

// ============================================================
// CLIENTS ROUTER
// ============================================================

const clientsRouter = router({
  list: protectedProcedure
    .input(z.object({ status: z.string().optional(), search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return await db.listClients(input);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const client = await db.getClientById(input.id);
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });
      return client;
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        fullName: z.string(),
        phone: z.string().optional(),
        email: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.enum(["Male", "Female", "Other"]).optional(),
        address: z.string().optional(),
        registrationDate: z.date(),
        medicalHistory: z.string().optional(),
        currentDiagnoses: z.array(z.string()).optional(),
        allergies: z.array(z.string()).optional(),
        medications: z.array(z.string()).optional(),
        lifestyle: z.object({ smoking: z.boolean(), alcohol: z.string(), physicalActivity: z.string() }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const age = input.dateOfBirth ? Math.floor((new Date().getTime() - input.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined;
      return await db.createClient({
        ...input,
        age,
        status: "Active",
        totalVisits: 0,
        outstanding: "0",
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        medicalHistory: z.string().optional(),
        currentDiagnoses: z.array(z.string()).optional(),
        allergies: z.array(z.string()).optional(),
        medications: z.array(z.string()).optional(),
        lifestyle: z.object({ smoking: z.boolean(), alcohol: z.string(), physicalActivity: z.string() }).optional(),
        status: z.enum(["Active", "Inactive"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateClient(id, data);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.deleteClient(input.id);
    }),
});

// ============================================================
// APPOINTMENTS ROUTER
// ============================================================

const appointmentRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          clientId: z.number().optional(),
          dateRange: z.object({ start: z.date(), end: z.date() }).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await db.listAppointments(input);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const appointment = await db.getAppointmentById(input.id);
      if (!appointment) throw new TRPCError({ code: "NOT_FOUND" });
      return appointment;
    }),

  create: protectedProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        clientId: z.number(),
        clientName: z.string(),
        appointmentDate: z.date(),
        appointmentTime: z.string(),
        duration: z.number(),
        type: z.enum(["New Patient", "Follow-up", "Walk-in"]),
        mode: z.enum(["In-Person", "Telehealth"]),
        status: z.enum(["Confirmed", "Pending", "Completed", "Scheduled"]),
        notes: z.string().optional(),
        dietitianId: z.number().optional(),
        dietitianName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createAppointment(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["Confirmed", "Pending", "Completed", "Scheduled"]).optional(),
        appointmentTime: z.string().optional(),
        appointmentDate: z.date().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateAppointment(id, data);
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.updateAppointment(input.id, { status: "Pending" });
    }),

  complete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.updateAppointment(input.id, { status: "Completed" });
    }),
});

// ============================================================
// ASSESSMENTS ROUTER
// ============================================================

const assessmentRouter = router({
  list: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      return await db.listAssessments(input.clientId);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const assessment = await db.getAssessmentById(input.id);
      if (!assessment) throw new TRPCError({ code: "NOT_FOUND" });
      return assessment;
    }),

  create: protectedProcedure
    .input(
      z.object({
        assessmentId: z.string(),
        clientId: z.number(),
        assessmentDate: z.date(),
        height: z.number().optional(),
        weight: z.number().optional(),
        bmi: z.number().optional(),
        bmiCategory: z.string().optional(),
        waistCircumference: z.number().optional(),
        bloodPressure: z.string().optional(),
        bloodSugar: z.number().optional(),
        dietaryAssessment: z.string().optional(),
        foodRecall: z.string().optional(),
        lifestyleEvaluation: z.string().optional(),
        riskClassification: z.enum(["Low Risk", "Medium Risk", "High Risk", "Critical"]),
        nutritionDiagnosis: z.string().optional(),
        notes: z.string().optional(),
        weightHistory: z.array(z.object({ date: z.string(), weight: z.number() })).optional(),
        dietitianId: z.number().optional(),
        dietitianName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { height, weight, bmi, waistCircumference, bloodSugar, ...rest } = input;
      const data: any = { ...rest };
      if (height !== undefined) data.height = height.toString();
      if (weight !== undefined) data.weight = weight.toString();
      if (bmi !== undefined) data.bmi = bmi.toString();
      if (waistCircumference !== undefined) data.waistCircumference = waistCircumference.toString();
      if (bloodSugar !== undefined) data.bloodSugar = bloodSugar.toString();
      return await db.createAssessment(data);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        weight: z.number().optional(),
        bmi: z.number().optional(),
        bmiCategory: z.string().optional(),
        bloodPressure: z.string().optional(),
        bloodSugar: z.number().optional(),
        riskClassification: z.enum(["Low Risk", "Medium Risk", "High Risk", "Critical"]).optional(),
        notes: z.string().optional(),
        weightHistory: z.array(z.object({ date: z.string(), weight: z.number() })).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, weight, bmi, bloodSugar, ...data } = input;
      const updateData: any = { ...data };
      if (weight !== undefined) updateData.weight = weight.toString();
      if (bmi !== undefined) updateData.bmi = bmi.toString();
      if (bloodSugar !== undefined) updateData.bloodSugar = bloodSugar.toString();
      return await db.updateAssessment(id, updateData);
    }),
});

// ============================================================
// CARE PLANS ROUTER
// ============================================================

const carePlanRouter = router({
  list: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      return await db.listCarePlans(input.clientId);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const plan = await db.getCarePlanById(input.id);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND" });
      return plan;
    }),

  create: protectedProcedure
    .input(
      z.object({
        carePlanId: z.string(),
        clientId: z.number(),
        clientName: z.string(),
        createdDate: z.date(),
        updatedDate: z.date(),
        nutritionDiagnosis: z.string(),
        dietPrescription: z.string(),
        goals: z
          .array(
            z.object({
              id: z.number(),
              goal: z.string(),
              status: z.enum(["Not Started", "In Progress", "Achieved"]),
              target: z.string(),
            })
          )
          .optional(),
        mealPlanFile: z.string().optional(),
        dietitianId: z.number().optional(),
        dietitianName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createCarePlan(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nutritionDiagnosis: z.string().optional(),
        dietPrescription: z.string().optional(),
        goals: z
          .array(
            z.object({
              id: z.number(),
              goal: z.string(),
              status: z.enum(["Not Started", "In Progress", "Achieved"]),
              target: z.string(),
            })
          )
          .optional(),
        status: z.enum(["Active", "Inactive", "Completed"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateCarePlan(id, { ...data, updatedDate: new Date() });
    }),

  addFollowUpNote: protectedProcedure
    .input(z.object({ id: z.number(), date: z.date(), note: z.string() }))
    .mutation(async ({ input }) => {
      const plan = await db.getCarePlanById(input.id);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

      const followUpNotes = (plan.followUpNotes || []) as any[];
      followUpNotes.push({ date: input.date.toISOString(), note: input.note });

      return await db.updateCarePlan(input.id, { followUpNotes, updatedDate: new Date() });
    }),

  updateGoal: protectedProcedure
    .input(z.object({ id: z.number(), goalId: z.number(), status: z.enum(["Not Started", "In Progress", "Achieved"]) }))
    .mutation(async ({ input }) => {
      const plan = await db.getCarePlanById(input.id);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

      const goals = (plan.goals || []) as any[];
      const goal = goals.find((g) => g.id === input.goalId);
      if (!goal) throw new TRPCError({ code: "NOT_FOUND" });

      goal.status = input.status;

      return await db.updateCarePlan(input.id, { goals, updatedDate: new Date() });
    }),
});

// ============================================================
// BILLING ROUTER
// ============================================================

const billingRouter = router({
  listInvoices: protectedProcedure
    .input(z.object({ clientId: z.number().optional(), status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return await db.listInvoices(input);
    }),

  getInvoice: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const invoice = await db.getInvoiceWithItems(input.id);
      if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });
      return invoice;
    }),

  createInvoice: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        clientId: z.number(),
        clientName: z.string(),
        invoiceDate: z.date(),
        items: z.array(z.object({ description: z.string(), quantity: z.number(), unitPrice: z.number() })),
        discount: z.number().optional(),
        paymentMethod: z.enum(["M-Pesa", "Cash", "Waived"]),
      })
    )
    .mutation(async ({ input }) => {
      const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const discount = input.discount || 0;
      const total = subtotal - discount;

      const invoiceResult = await db.createInvoice({
        invoiceId: input.invoiceId,
        clientId: input.clientId,
        clientName: input.clientName,
        invoiceDate: input.invoiceDate,
        subtotal: subtotal.toString(),
        discount: discount.toString(),
        total: total.toString(),
        paid: "0",
        outstanding: total.toString(),
        paymentMethod: input.paymentMethod,
        status: input.paymentMethod === "Waived" ? "Waived" : "Pending",
      });

      // Create invoice items
      const invoiceId = (invoiceResult as any).insertId;
      for (const item of input.items) {
        await db.createInvoiceItem({
          invoiceId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
        });
      }

      return invoiceResult;
    }),

  recordPayment: protectedProcedure
    .input(
      z.object({
        invoiceId: z.number(),
        amount: z.number(),
        paymentMethod: z.enum(["M-Pesa", "Cash", "Waived"]),
        transactionId: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invoice = await db.getInvoiceById(input.invoiceId);
      if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

      // Record payment
      await db.recordPayment({
        invoiceId: input.invoiceId,
        amount: input.amount.toString(),
        paymentMethod: input.paymentMethod,
        paymentDate: new Date(),
        transactionId: input.transactionId,
        notes: input.notes,
        recordedBy: ctx.user?.id,
      });

      // Update invoice
      const newPaid = parseFloat((invoice.paid || 0).toString()) + input.amount;
      const newOutstanding = parseFloat(invoice.total.toString()) - newPaid;
      const newStatus = newOutstanding <= 0 ? "Paid" : "Partial";

      return await db.updateInvoice(input.invoiceId, {
        paid: newPaid.toString(),
        outstanding: Math.max(0, newOutstanding).toString(),
        status: newStatus,
      });
    }),
});

// ============================================================
// MESSAGES ROUTER
// ============================================================

const messageRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          clientId: z.number().optional(),
          channel: z.string().optional(),
          direction: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await db.listMessages(input);
    }),

  create: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
        clientId: z.number(),
        clientName: z.string(),
        channel: z.enum(["WhatsApp", "SMS"]),
        direction: z.enum(["Inbound", "Outbound"]),
        message: z.string(),
        status: z.enum(["Sent", "Delivered", "Read", "Failed"]),
        type: z.enum(["Reminder", "Reply", "Welcome", "Alert", "Other"]).optional(),
        senderId: z.number().optional(),
        senderName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createMessage(input);
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.updateMessage(input.id, { status: "Read" });
    }),
});

// ============================================================
// ANALYTICS ROUTER
// ============================================================

const analyticsRouter = router({
  dashboard: protectedProcedure.query(async () => {
    const clientStats = await db.getClientStats();
    const revenueStats = await db.getRevenueStats();
    const appointmentStats = await db.getAppointmentStats();
    const riskDistribution = await db.getRiskDistribution();

    return {
      activeClients: clientStats.activeClients,
      totalClients: clientStats.totalClients,
      newThisMonth: clientStats.newThisMonth,
      totalRevenue: revenueStats.totalRevenue,
      outstandingBalance: revenueStats.outstandingBalance,
      appointmentsCompleted: appointmentStats.completed,
      appointmentsPending: appointmentStats.pending,
      appointmentsConfirmed: appointmentStats.confirmed,
      riskDistribution,
    };
  }),
});

// ============================================================
// AUTH ROUTER
// ============================================================

const authRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),
  
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string(), userType: z.enum(['admin', 'dietitian', 'client']) }))
    .mutation(async ({ input }) => {
      try {
        const authModule = await import('./auth');
        const user = await authModule.loginUser(input.email, input.password);
        return { success: true, user };
      } catch (error: any) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message });
      }
    }),

  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string(), name: z.string(), userType: z.enum(['admin', 'dietitian', 'client']) }))
    .mutation(async ({ input }) => {
      try {
        const authModule = await import('./auth');
        const role = input.userType === 'admin' ? 'admin' : input.userType === 'dietitian' ? 'admin' : 'user';
        const user = await authModule.registerUser(input.email, input.password, input.name, role as any);
        return { success: true, user };
      } catch (error: any) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
      }
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),
});

// ============================================================
// MAIN APP ROUTER
// ============================================================

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  clients: clientsRouter,
  appointment: appointmentRouter,
  assessment: assessmentRouter,
  carePlan: carePlanRouter,
  billing: billingRouter,
  message: messageRouter,
  analytics: analyticsRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
