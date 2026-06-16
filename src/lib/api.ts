/**
 * API Integration Utilities
 * Provides helper functions for common API operations
 */

import { trpc } from './trpc';

export const apiHelpers = {
  // Clients
  async listClients(filters?: { status?: string; search?: string }) {
    return trpc.clients.list.useQuery(filters || {});
  },

  async getClient(id: number) {
    return trpc.clients.get.useQuery({ id });
  },

  // Appointments
  async listAppointments(filters?: { status?: string; clientId?: number }) {
    return trpc.appointment.list.useQuery(filters || {});
  },

  async getAppointment(id: number) {
    return trpc.appointment.get.useQuery({ id });
  },

  // Assessments
  async listAssessments(clientId: number) {
    return trpc.assessment.list.useQuery({ clientId });
  },

  async getAssessment(id: number) {
    return trpc.assessment.get.useQuery({ id });
  },

  // Care Plans
  async listCarePlans(clientId: number) {
    return trpc.carePlan.list.useQuery({ clientId });
  },

  async getCarePlan(id: number) {
    return trpc.carePlan.get.useQuery({ id });
  },

  // Billing
  async listInvoices(filters?: { clientId?: number; status?: string }) {
    return trpc.billing.listInvoices.useQuery(filters || {});
  },

  async getInvoice(id: number) {
    return trpc.billing.getInvoice.useQuery({ id });
  },

  // Messages
  async listMessages(filters?: { clientId?: number; channel?: string }) {
    return trpc.message.list.useQuery(filters || {});
  },

  // Analytics
  async getDashboardAnalytics() {
    return trpc.analytics.dashboard.useQuery();
  },

  // AI
  async generateRecommendation(clientId: number, query: string) {
    return trpc.ai.generateRecommendation.useMutation();
  },

  async draftCarePlan(clientId: number) {
    return trpc.ai.draftCarePlan.useMutation();
  },

  async generateMealPlan(clientId: number, calorieTarget: number, preferences?: string[]) {
    return trpc.ai.generateMealPlan.useMutation();
  },

  async analyzeClientHealth(clientId: number) {
    return trpc.ai.analyzeClientHealth.useMutation();
  },
};

/**
 * Format utilities for display
 */
export const formatters = {
  currency: (amount: number) => `KES ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  date: (date: Date | string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  time: (time: string) => time, // Format as HH:MM
  percentage: (value: number) => `${value}%`,
  bmi: (bmi: number) => {
    if (bmi < 18.5) return { value: bmi.toFixed(1), status: 'Underweight', color: 'var(--info)' };
    if (bmi < 25) return { value: bmi.toFixed(1), status: 'Normal', color: 'var(--success)' };
    if (bmi < 30) return { value: bmi.toFixed(1), status: 'Overweight', color: 'var(--warning)' };
    return { value: bmi.toFixed(1), status: 'Obese', color: 'var(--danger)' };
  },
};

/**
 * Status mappers
 */
export const statusMappers = {
  appointmentStatus: (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      'Confirmed': { label: 'Confirmed', color: 'var(--success)' },
      'Pending': { label: 'Pending', color: 'var(--warning)' },
      'Completed': { label: 'Completed', color: 'var(--info)' },
      'Scheduled': { label: 'Scheduled', color: 'var(--accent)' },
    };
    return map[status] || { label: status, color: 'var(--text-muted)' };
  },

  paymentStatus: (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      'Paid': { label: 'Paid', color: 'var(--success)' },
      'Pending': { label: 'Pending', color: 'var(--warning)' },
      'Overdue': { label: 'Overdue', color: 'var(--danger)' },
      'Partial': { label: 'Partial', color: 'var(--warning)' },
    };
    return map[status] || { label: status, color: 'var(--text-muted)' };
  },

  riskLevel: (level: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      'Low Risk': { label: 'Low', color: 'var(--success)', bg: 'var(--success-light)' },
      'Medium Risk': { label: 'Medium', color: 'var(--warning)', bg: 'var(--warning-light)' },
      'High Risk': { label: 'High', color: 'var(--danger)', bg: 'var(--danger-light)' },
      'Critical': { label: 'Critical', color: 'var(--danger)', bg: 'var(--danger-light)' },
    };
    return map[level] || { label: level, color: 'var(--text-muted)', bg: 'var(--bg-secondary)' };
  },
};
