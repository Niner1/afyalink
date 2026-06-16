import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trpc } from '../lib/trpc';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: "Hello! I'm AFyalinkAI, your intelligent clinical assistant. I can help you analyze patient data, suggest dietary interventions, calculate nutritional requirements, draft care plans, and provide evidence-based recommendations. How can I assist you today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Notifications state (placeholder for future backend integration)
  const [notifications, setNotifications] = useState([]);
  const unreadCount = 0;

  const markAllRead = useCallback(async () => {
    // Placeholder for future notification marking
    console.log('Mark all notifications as read');
  }, []);

  // AI message handler - uses real Groq API via backend
  const sendAiMessage = useCallback(async (message) => {
    const userMsg = { role: 'user', content: message };
    setAiMessages(prev => [...prev, userMsg]);
    setAiLoading(true);

    try {
      // Get client context if available
      const clientContext = selectedClient ? `Client: ${selectedClient.fullName}` : '';
      
      const response = await trpc.ai.generateRecommendation.mutate({
        prompt: message,
        clientId: selectedClient?.id,
        context: clientContext,
      });

      setAiMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('AI response error:', error);
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setAiLoading(false);
    }
  }, [selectedClient]);

  return (
    <AppContext.Provider value={{
      activePage, setActivePage,
      selectedClient, setSelectedClient,
      sidebarOpen, setSidebarOpen,
      notifications, markAllRead, unreadCount,
      aiAssistantOpen, setAiAssistantOpen,
      aiMessages, sendAiMessage, aiLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
