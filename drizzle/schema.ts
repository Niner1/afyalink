import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  date,
} from "drizzle-orm/mysql-core";

/**
 * AFyalink Database Schema
 * Comprehensive nutrition and dietitian practice management platform
 */

// ============================================================
// USERS & AUTHENTICATION
// ============================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "dietitian", "client"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================
// CLIENTS
// ============================================================

export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  clientId: varchar("clientId", { length: 20 }).notNull().unique(), // e.g., CLT-001
  userId: int("userId"), // Link to user if client has portal access
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  dateOfBirth: date("dateOfBirth"),
  age: int("age"),
  gender: mysqlEnum("gender", ["Male", "Female", "Other"]),
  address: text("address"),
  photoUrl: text("photoUrl"),
  status: mysqlEnum("status", ["Active", "Inactive"]).default("Active").notNull(),
  registrationDate: date("registrationDate").notNull(),
  medicalHistory: text("medicalHistory"),
  currentDiagnoses: json("currentDiagnoses").$type<string[]>().default([]),
  allergies: json("allergies").$type<string[]>().default([]),
  medications: json("medications").$type<string[]>().default([]),
  lifestyle: json("lifestyle").$type<{
    smoking: boolean;
    alcohol: string;
    physicalActivity: string;
  }>(),
  lastVisit: date("lastVisit"),
  nextAppointment: date("nextAppointment"),
  totalVisits: int("totalVisits").default(0),
  outstanding: decimal("outstanding", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// ============================================================
// APPOINTMENTS
// ============================================================

export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: varchar("appointmentId", { length: 20 }).notNull().unique(), // e.g., APT-001
  clientId: int("clientId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  appointmentDate: date("appointmentDate").notNull(),
  appointmentTime: varchar("appointmentTime", { length: 10 }).notNull(), // HH:MM format
  duration: int("duration").notNull(), // in minutes
  type: mysqlEnum("type", ["New Patient", "Follow-up", "Walk-in"]).notNull(),
  mode: mysqlEnum("mode", ["In-Person", "Telehealth"]).notNull(),
  status: mysqlEnum("status", ["Confirmed", "Pending", "Completed", "Scheduled"]).notNull(),
  notes: text("notes"),
  dietitianId: int("dietitianId"),
  dietitianName: varchar("dietitianName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// ============================================================
// ASSESSMENTS
// ============================================================

export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: varchar("assessmentId", { length: 20 }).notNull().unique(), // e.g., ASS-001
  clientId: int("clientId").notNull(),
  assessmentDate: date("assessmentDate").notNull(),
  dietitianId: int("dietitianId"),
  dietitianName: varchar("dietitianName", { length: 255 }),
  height: decimal("height", { precision: 5, scale: 2 }), // cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // kg
  bmi: decimal("bmi", { precision: 5, scale: 1 }),
  bmiCategory: varchar("bmiCategory", { length: 50 }), // e.g., "Obese Class I"
  waistCircumference: decimal("waistCircumference", { precision: 5, scale: 2 }), // cm
  bloodPressure: varchar("bloodPressure", { length: 20 }), // e.g., "138/88"
  bloodSugar: decimal("bloodSugar", { precision: 5, scale: 1 }), // mmol/L
  dietaryAssessment: text("dietaryAssessment"),
  foodRecall: text("foodRecall"), // 24-hour food recall
  lifestyleEvaluation: text("lifestyleEvaluation"),
  riskClassification: mysqlEnum("riskClassification", ["Low Risk", "Medium Risk", "High Risk", "Critical"]).notNull(),
  nutritionDiagnosis: text("nutritionDiagnosis"),
  notes: text("notes"),
  weightHistory: json("weightHistory").$type<Array<{ date: string; weight: number }>>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

// ============================================================
// CARE PLANS
// ============================================================

export const carePlans = mysqlTable("carePlans", {
  id: int("id").autoincrement().primaryKey(),
  carePlanId: varchar("carePlanId", { length: 20 }).notNull().unique(), // e.g., CP-001
  clientId: int("clientId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  createdDate: date("createdDate").notNull(),
  updatedDate: date("updatedDate").notNull(),
  dietitianId: int("dietitianId"),
  dietitianName: varchar("dietitianName", { length: 255 }),
  nutritionDiagnosis: text("nutritionDiagnosis").notNull(),
  dietPrescription: text("dietPrescription").notNull(),
  goals: json("goals").$type<Array<{
    id: number;
    goal: string;
    status: "Not Started" | "In Progress" | "Achieved";
    target: string;
  }>>().default([]),
  mealPlanFile: varchar("mealPlanFile", { length: 255 }),
  followUpNotes: json("followUpNotes").$type<Array<{
    date: string;
    note: string;
  }>>().default([]),
  status: mysqlEnum("status", ["Active", "Inactive", "Completed"]).default("Active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CarePlan = typeof carePlans.$inferSelect;
export type InsertCarePlan = typeof carePlans.$inferInsert;

// ============================================================
// INVOICES & BILLING
// ============================================================

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: varchar("invoiceId", { length: 20 }).notNull().unique(), // e.g., INV-2025-001
  clientId: int("clientId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  invoiceDate: date("invoiceDate").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  paid: decimal("paid", { precision: 12, scale: 2 }).default("0"),
  outstanding: decimal("outstanding", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["M-Pesa", "Cash", "Waived"]).notNull(),
  status: mysqlEnum("status", ["Paid", "Partial", "Pending", "Waived"]).notNull(),
  receiptNo: varchar("receiptNo", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export const invoiceItems = mysqlTable("invoiceItems", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: int("invoiceId").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  quantity: int("quantity").default(1),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = typeof invoiceItems.$inferInsert;

// ============================================================
// MESSAGES
// ============================================================

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  messageId: varchar("messageId", { length: 20 }).notNull().unique(), // e.g., MSG-001
  clientId: int("clientId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  channel: mysqlEnum("channel", ["WhatsApp", "SMS"]).notNull(),
  direction: mysqlEnum("direction", ["Inbound", "Outbound"]).notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: mysqlEnum("status", ["Sent", "Delivered", "Read", "Failed"]).notNull(),
  type: mysqlEnum("type", ["Reminder", "Reply", "Welcome", "Alert", "Other"]).default("Other"),
  senderId: int("senderId"),
  senderName: varchar("senderName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ============================================================
// ANALYTICS & AGGREGATES
// ============================================================

export const analyticsSnapshots = mysqlTable("analyticsSnapshots", {
  id: int("id").autoincrement().primaryKey(),
  snapshotDate: date("snapshotDate").notNull(),
  activeClients: int("activeClients"),
  newClients: int("newClients"),
  revenue: decimal("revenue", { precision: 12, scale: 2 }),
  appointmentsCompleted: int("appointmentsCompleted"),
  appointmentsPending: int("appointmentsPending"),
  outstandingBalance: decimal("outstandingBalance", { precision: 12, scale: 2 }),
  clientRetentionRate: decimal("clientRetentionRate", { precision: 5, scale: 2 }),
  followUpAdherence: decimal("followUpAdherence", { precision: 5, scale: 2 }),
  riskDistribution: json("riskDistribution").$type<{
    lowRisk: number;
    mediumRisk: number;
    highRisk: number;
    critical: number;
  }>(),
  topDiagnoses: json("topDiagnoses").$type<Array<{ diagnosis: string; count: number }>>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
export type InsertAnalyticsSnapshot = typeof analyticsSnapshots.$inferInsert;

// ============================================================
// PAYMENT RECORDS
// ============================================================

export const paymentRecords = mysqlTable("paymentRecords", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: int("invoiceId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["M-Pesa", "Cash", "Waived"]).notNull(),
  paymentDate: date("paymentDate").notNull(),
  transactionId: varchar("transactionId", { length: 100 }),
  notes: text("notes"),
  recordedBy: int("recordedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PaymentRecord = typeof paymentRecords.$inferSelect;
export type InsertPaymentRecord = typeof paymentRecords.$inferInsert;
