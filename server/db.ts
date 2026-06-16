import { eq, desc, and, gte, lte, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clients,
  appointments,
  assessments,
  carePlans,
  invoices,
  invoiceItems,
  messages,
  analyticsSnapshots,
  paymentRecords,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================
// CLIENTS
// ============================================================

export async function listClients(filters?: { status?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(clients);

  if (filters?.status) {
    query = query.where(eq(clients.status, filters.status as any));
  }
  if (filters?.search) {
    query = query.where(
      like(clients.fullName, `%${filters.search}%`)
    );
  }

  return await query.orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getClientByClientId(clientId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(clients).where(eq(clients.clientId, clientId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createClient(data: typeof clients.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clients).values(data);
  return result;
}

export async function updateClient(id: number, data: Partial<typeof clients.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(clients).set(data).where(eq(clients.id, id));
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(clients).where(eq(clients.id, id));
}

// ============================================================
// APPOINTMENTS
// ============================================================

export async function listAppointments(filters?: { status?: string; clientId?: number; dateRange?: { start: Date; end: Date } }) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(appointments);
  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(appointments.status, filters.status as any));
  }
  if (filters?.clientId) {
    conditions.push(eq(appointments.clientId, filters.clientId));
  }
  if (filters?.dateRange) {
    conditions.push(gte(appointments.appointmentDate, filters.dateRange.start));
    conditions.push(lte(appointments.appointmentDate, filters.dateRange.end));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createAppointment(data: typeof appointments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(appointments).values(data);
}

export async function updateAppointment(id: number, data: Partial<typeof appointments.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(appointments).set(data).where(eq(appointments.id, id));
}

// ============================================================
// ASSESSMENTS
// ============================================================

export async function listAssessments(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assessments).where(eq(assessments.clientId, clientId)).orderBy(desc(assessments.assessmentDate));
}

export async function getAssessmentById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createAssessment(data: typeof assessments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(assessments).values(data);
}

export async function updateAssessment(id: number, data: Partial<typeof assessments.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(assessments).set(data).where(eq(assessments.id, id));
}

// ============================================================
// CARE PLANS
// ============================================================

export async function listCarePlans(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(carePlans).where(eq(carePlans.clientId, clientId)).orderBy(desc(carePlans.updatedDate));
}

export async function getCarePlanById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(carePlans).where(eq(carePlans.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCarePlan(data: typeof carePlans.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(carePlans).values(data);
}

export async function updateCarePlan(id: number, data: Partial<typeof carePlans.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(carePlans).set(data).where(eq(carePlans.id, id));
}

// ============================================================
// INVOICES & BILLING
// ============================================================

export async function listInvoices(filters?: { clientId?: number; status?: string }) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(invoices);
  const conditions = [];

  if (filters?.clientId) {
    conditions.push(eq(invoices.clientId, filters.clientId));
  }
  if (filters?.status) {
    conditions.push(eq(invoices.status, filters.status as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(desc(invoices.invoiceDate));
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getInvoiceWithItems(invoiceId: number) {
  const db = await getDb();
  if (!db) return null;

  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) return null;

  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));

  return { ...invoice, items };
}

export async function createInvoice(data: typeof invoices.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(invoices).values(data);
}

export async function createInvoiceItem(data: typeof invoiceItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(invoiceItems).values(data);
}

export async function updateInvoice(id: number, data: Partial<typeof invoices.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(invoices).set(data).where(eq(invoices.id, id));
}

export async function recordPayment(data: typeof paymentRecords.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(paymentRecords).values(data);
}

// ============================================================
// MESSAGES
// ============================================================

export async function listMessages(filters?: { clientId?: number; channel?: string; direction?: string }) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(messages);
  const conditions = [];

  if (filters?.clientId) {
    conditions.push(eq(messages.clientId, filters.clientId));
  }
  if (filters?.channel) {
    conditions.push(eq(messages.channel, filters.channel as any));
  }
  if (filters?.direction) {
    conditions.push(eq(messages.direction, filters.direction as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(desc(messages.timestamp));
}

export async function createMessage(data: typeof messages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(messages).values(data);
}

export async function updateMessage(id: number, data: Partial<typeof messages.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(messages).set(data).where(eq(messages.id, id));
}

// ============================================================
// ANALYTICS
// ============================================================

export async function getLatestAnalyticsSnapshot() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(analyticsSnapshots).orderBy(desc(analyticsSnapshots.snapshotDate)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createAnalyticsSnapshot(data: typeof analyticsSnapshots.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(analyticsSnapshots).values(data);
}

// ============================================================
// AGGREGATION HELPERS
// ============================================================

export async function getClientStats() {
  const db = await getDb();
  if (!db) return { activeClients: 0, totalClients: 0, newThisMonth: 0 };

  const allClients = await db.select().from(clients);
  const activeClients = allClients.filter((c) => c.status === "Active");

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const newThisMonth = allClients.filter((c) => new Date(c.registrationDate) >= thisMonth);

  return {
    activeClients: activeClients.length,
    totalClients: allClients.length,
    newThisMonth: newThisMonth.length,
  };
}

export async function getRevenueStats() {
  const db = await getDb();
  if (!db) return { totalRevenue: 0, outstandingBalance: 0 };

  const allInvoices = await db.select().from(invoices);

  const totalRevenue = allInvoices.reduce((sum, inv) => sum + parseFloat((inv.paid || 0).toString()), 0);
  const outstandingBalance = allInvoices.reduce((sum, inv) => sum + parseFloat(inv.outstanding.toString()), 0);

  return { totalRevenue, outstandingBalance };
}

export async function getAppointmentStats() {
  const db = await getDb();
  if (!db) return { completed: 0, pending: 0, confirmed: 0 };

  const allAppointments = await db.select().from(appointments);

  return {
    completed: allAppointments.filter((a) => a.status === "Completed").length,
    pending: allAppointments.filter((a) => a.status === "Pending").length,
    confirmed: allAppointments.filter((a) => a.status === "Confirmed").length,
  };
}

export async function getRiskDistribution() {
  const db = await getDb();
  if (!db) return { lowRisk: 0, mediumRisk: 0, highRisk: 0, critical: 0 };

  const allAssessments = await db.select().from(assessments);

  return {
    lowRisk: allAssessments.filter((a) => a.riskClassification === "Low Risk").length,
    mediumRisk: allAssessments.filter((a) => a.riskClassification === "Medium Risk").length,
    highRisk: allAssessments.filter((a) => a.riskClassification === "High Risk").length,
    critical: allAssessments.filter((a) => a.riskClassification === "Critical").length,
  };
}
